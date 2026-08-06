import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function test() {
    try {
        console.log("Key:", process.env.GEMINI_API_KEY ? "EXISTS" : "MISSING");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("hello");
        console.log("Success:", result.response.text());
    } catch (e) {
        console.error("Caught error:", e.message);
    }
}
test();
