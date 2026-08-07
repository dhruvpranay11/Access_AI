import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const AI_SYSTEM_PROMPT = `You are a highly empathetic accessibility assistant. Your primary task is to analyze images and documents and explain them in a way that is understandable to users of all cognitive levels. When analyzing places, act as a helpful local guide providing weather and travel tips. When analyzing documents or posters, extract only the most important information and simplify it. CRITICAL: You MUST wrap your final JSON response in \`\`\`json ... \`\`\` markdown blocks. Do not output any JSON outside of this block.`;

const PROMPT_TEMPLATE = `Analyze the attached image. Determine if it is a 'place', 'poster', 'document', or 'general' image. Provide a highly simplified description. Based on the category, provide the following in your JSON response:
{
  "category": "place | poster | document | general",
  "simplified_description": "A very easy to understand paragraph describing the main visual elements."
}`;

async function test() {
    let triedModels = [];
    let lastError;
    let responseText;
    try {
        const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await modelsRes.json();
        const availableModels = data.models
            .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
            .map(m => m.name.replace('models/', ''));
        
        for (const modelName of availableModels) {
            try {
                triedModels.push(modelName);
                const model = genAI.getGenerativeModel({ 
                    model: modelName,
                    systemInstruction: AI_SYSTEM_PROMPT
                });
                
                // We'll just test with a simple text prompt instead of an image to see if it even accepts the systemInstruction
                const result = await model.generateContent([PROMPT_TEMPLATE, "Just testing text"]);
                responseText = result.response.text();
                console.log(`Success with model ${modelName}:`, responseText);
                break; 
            } catch (err) {
                lastError = err;
                console.warn(`Model ${modelName} failed:`, err.message);
            }
        }
    } catch (err) {
        console.error(err);
    }
    
    if (!responseText) {
        console.error("All models failed. Last error:", lastError);
    }
}

test();
