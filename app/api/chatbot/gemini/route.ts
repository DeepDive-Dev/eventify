import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Use a suitable model

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    const result = await model.generateContent(message);
    const response = await result.response.text();
    return NextResponse.json({ reply: response });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}