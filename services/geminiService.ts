
import { GoogleGenAI, Type } from "@google/genai";
import { Priority, Status, Task } from "../types";

// Always use the process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseTaskFromNaturalLanguage = async (text: string): Promise<Partial<Task>> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Parse the following task description into a structured JSON object: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          priority: { type: Type.STRING, enum: [Priority.LOW, Priority.MEDIUM, Priority.HIGH] },
          estimatedMinutes: { type: Type.NUMBER },
          category: { type: Type.STRING },
          dueDate: { type: Type.STRING, description: 'ISO Date string' }
        },
        required: ["title"]
      }
    }
  });

  try {
    // Accessing .text property directly as per guidelines
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return { title: text };
  }
};

export const getSmartSuggestions = async (tasks: Task[], habits: any[]): Promise<string> => {
  const context = JSON.stringify({ tasks, habits });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on the following tasks and habits, provide 3 brief, actionable productivity tips for today: ${context}`,
    config: {
      systemInstruction: "You are a world-class productivity coach. Be concise, encouraging, and specific."
    }
  });
  return response.text || '';
};

export const chatWithAI = async (message: string, currentContext: any) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `User message: ${message}\nContext: ${JSON.stringify(currentContext)}`,
    config: {
      systemInstruction: "You are MindFlow AI, an intelligent productivity assistant. Help the user organize their life. You can suggest reorganizing tasks, starting focus sessions, or reflecting on habits."
    }
  });
  return response.text || '';
};
