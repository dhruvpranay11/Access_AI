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

const AI_SYSTEM_PROMPT = `You are a highly empathetic, expert accessibility assistant. Take a deep breath and think step-by-step. Your primary task is to thoroughly analyze images and documents and explain them in extreme detail, breaking down complex information into digestible, actionable insights. Make the user feel like you are saving them immense amounts of time by acting as a proactive assistant. When analyzing places, act as a local expert providing weather, layout, and safety tips. When analyzing documents or posters, extract all critical information and provide a comprehensive summary along with actionable takeaways. Always respond in valid JSON format ONLY. Do not include markdown formatting like \`\`\`json in the output. NO PREAMBLE. NO CONVERSATION. ONLY JSON.`;

const PROMPT_TEMPLATE = `Analyze the attached image meticulously. Determine if it is a 'place', 'poster', 'document', or 'general' image. Provide a highly detailed, elaborate explanation. Based on the category, provide the following in your JSON response:
{
  "category": "place | poster | document | general",
  "simplified_description": "A very easy to understand, comprehensive paragraph describing the main visual elements and overall context.",
  "detailed_breakdown": "An elaborate, multi-paragraph analysis detailing all text, structure, colors, and important elements found in the image. Make it feel like a professional assistant is breaking it down to save the user time.",
  "actionable_insights": ["Insight 1", "Insight 2", "Insight 3"],
  "place_details": {
    "places_to_cover": ["list of nearby attractions or points of interest"],
    "climatic_changes": "Expected weather/climate info for different times of day",
    "directions_and_tips": "General navigational advice and safety tips"
  },
  "poster_details": {
    "main_subject": "What is the poster about?",
    "brief_summary": "Comprehensive summary of the event/info",
    "target_audience": "Who is this for?"
  },
  "document_details": {
    "key_points": ["Point 1", "Point 2", "Point 3", "Point 4"],
    "simplified_explanation": "What does this document mean in plain language? What should the user do next?"
  }
}
Note: Only populate the specific details object (place_details, poster_details, or document_details) corresponding to the detected category. You MUST include detailed_breakdown and actionable_insights for ALL categories.`;

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

        let responseText;
        let lastError;
        let triedModels = [];

        try {
            // Fetch exactly which models this specific API key is allowed to use
            const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
            if (modelsRes.ok) {
                const data = await modelsRes.json();
                
                // Filter for models that support generating content
                const availableModels = data.models
                    .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
                    .map(m => m.name.replace('models/', ''));
                
                // Try every single valid model Google allows us to use!
                for (const modelName of availableModels) {
                    try {
                        triedModels.push(modelName);
                        const model = genAI.getGenerativeModel({ 
                            model: modelName,
                            systemInstruction: customSystemPrompt,
                            generationConfig: { responseMimeType: "application/json" }
                        });
                        
                        const result = await model.generateContent([finalPrompt, imagePart]);
                        responseText = result.response.text();
                        break; // If successful, break out of the loop!
                    } catch (err) {
                        lastError = err;
                        console.warn(`Model ${modelName} failed:`, err.message);
                    }
                }
            } else {
                throw new Error("Failed to authenticate API key with ModelService");
            }
        } catch (err) {
            console.error("Failed to dynamically fetch models:", err);
            lastError = err;
        }

        if (!responseText) {
            const modelList = triedModels.join(', ');
            throw new Error(`Google rejected the request for all tried models (${modelList || 'none available'}). Last error: ${lastError?.message || 'Unknown'}`);
        }
        
        let structuredData;
        try {
            // Aggressively strip any markdown code blocks the AI might have added
            let cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
            
            // Extract the JSON object
            const startIndex = cleanedText.indexOf('{');
            const endIndex = cleanedText.lastIndexOf('}');
            if (startIndex !== -1 && endIndex !== -1) {
                cleanedText = cleanedText.substring(startIndex, endIndex + 1);
            }
            structuredData = JSON.parse(cleanedText);
        } catch (e) {
            console.error('Failed to parse Gemini response as JSON', responseText);
            
            // Send exactly what the AI said back to the frontend so the user can read it!
            const rawOutput = responseText.length > 200 ? responseText.substring(0, 200) + '...' : responseText;
            return res.status(500).json({ error: `The AI responded, but not in the requested format. AI said: "${rawOutput}"` });
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
