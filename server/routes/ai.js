import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getDb } from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';
import multer from 'multer';

const router = express.Router();
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
});

const AI_SYSTEM_PROMPT = `You are a highly empathetic accessibility assistant. Your primary task is to analyze images and documents and explain them in a way that is understandable to users of all cognitive levels. When analyzing places, act as a helpful local guide providing weather and travel tips. When analyzing documents or posters, extract only the most important information and simplify it. Always respond in valid JSON format. Do not include markdown formatting like \`\`\`json in the output.`;

const PROMPT_TEMPLATE = `Analyze the attached image. Determine if it is a 'place', 'poster', 'document', or 'general' image. Provide a highly simplified description. Based on the category, provide the following in your JSON response:
{
  "category": "place | poster | document | general",
  "simplified_description": "A very easy to understand paragraph describing the main visual elements.",
  "place_details": {
    "places_to_cover": ["list of nearby attractions"],
    "climatic_changes": "Expected weather/climate info for different times of day",
    "directions_and_tips": "General navigational advice"
  },
  "poster_details": {
    "main_subject": "What is the poster about?",
    "brief_summary": "Simplified summary of the event/info",
    "target_audience": "Who is this for?"
  },
  "document_details": {
    "key_points": ["Point 1", "Point 2"],
    "simplified_explanation": "What does this document mean in plain language?"
  }
}
Note: Only populate the details object corresponding to the detected category.`;

router.post('/analyze', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image provided' });
        }

        if (!genAI) {
            return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
        }

        const db = getDb();
        const user = await db.get('SELECT accessibility_needs, preferred_language FROM users WHERE id = ?', [req.user.id]);
        
        let customSystemPrompt = AI_SYSTEM_PROMPT;
        if (user) {
            if (user.accessibility_needs) {
                customSystemPrompt += `\nThe user has the following accessibility needs: ${user.accessibility_needs}. Please ensure the simplified description respects these needs.`;
            }
            if (user.preferred_language) {
                customSystemPrompt += `\nPlease provide the final output in the following language: ${user.preferred_language}.`;
            }
        }

        const customText = req.body.customText || '';
        let finalPrompt = PROMPT_TEMPLATE;
        if (customText.trim()) {
            finalPrompt += `\n\nUSER'S SPECIFIC CONTEXT OR QUESTION: "${customText}"\nPlease ensure your response actively addresses this context/question while adhering to the JSON schema.`;
        }

        const imagePart = {
            inlineData: {
                data: req.file.buffer.toString('base64'),
                mimeType: req.file.mimetype
            }
        };

        let selectedModel = "gemini-1.5-flash"; // Default fallback
        try {
            // Dynamically fetch the EXACT models available for this specific API key
            const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
            if (modelsRes.ok) {
                const data = await modelsRes.json();
                const availableModels = data.models
                    .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
                    .map(m => m.name.replace('models/', ''));
                
                if (availableModels.length > 0) {
                    // Prefer a 'flash' model for speed, otherwise just grab the first one that works
                    const flashModel = availableModels.find(m => m.includes('flash'));
                    selectedModel = flashModel || availableModels[0];
                }
            }
        } catch (e) {
            console.error("Failed to dynamically fetch models, using fallback", e);
        }

        const model = genAI.getGenerativeModel({ 
            model: selectedModel,
            systemInstruction: customSystemPrompt,
            generationConfig: { responseMimeType: "application/json" }
        });

        const result = await model.generateContent([finalPrompt, imagePart]);
        const response = result.response;
        const responseText = response.text();
        
        let structuredData;
        try {
            structuredData = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse Gemini response as JSON', responseText);
            return res.status(500).json({ error: 'Failed to generate a valid structured response' });
        }

        const result = await db.run(
            `INSERT INTO analyses (user_id, image_name, category, simplified_description, structured_data, user_prompt) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                req.user.id, 
                req.file.originalname, 
                structuredData.category, 
                structuredData.simplified_description, 
                JSON.stringify(structuredData),
                customText
            ]
        );

        res.json({ 
            id: result.lastID,
            ...structuredData 
        });

    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ error: error.message || 'Failed to process image' });
    }
});

router.get('/history', authMiddleware, async (req, res) => {
    try {
        const db = getDb();
        const analyses = await db.all('SELECT * FROM analyses WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        
        const parsedAnalyses = analyses.map(a => ({
            ...a,
            structured_data: JSON.parse(a.structured_data)
        }));

        res.json(parsedAnalyses);
    } catch (error) {
        console.error('Fetch history error:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

export default router;
