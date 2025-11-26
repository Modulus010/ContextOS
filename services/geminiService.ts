import { GoogleGenAI, Type } from "@google/genai";
import { GlobalState } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a Cognitive Psychology Expert and Productivity Coach built into a "Life Context OS" called Nexus. 
Your goal is to help the user understand the connections between their tasks, focus levels, spending habits, and mood.
You should provide brief, actionable, and empathetic insights.
Avoid generic advice. Look for patterns in the provided JSON data.
For example:
- If spending is high and mood is low -> Suggest "Retail Therapy" check.
- If focus is low and tasks are high -> Suggest prioritizing or taking a break.
- If journaling is positive but tasks are unfinished -> Validate the good mood but gently nudge towards one small task.

Keep the tone professional yet warm. Max 3 sentences.
`;

export const generateContextualInsight = async (state: GlobalState): Promise<string> => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

    // Filter for today's data to give immediate context
    const dailyContext = {
      tasksCompletedToday: state.tasks.filter(t => t.status === 'done' && t.createdAt >= startOfDay).length,
      pendingTasks: state.tasks.filter(t => t.status !== 'done').length,
      focusMinutesToday: Math.floor(state.focusSessions.filter(s => s.timestamp >= startOfDay).reduce((acc, curr) => acc + curr.durationSeconds, 0) / 60),
      moneySpentToday: state.transactions.filter(t => t.type === 'expense' && t.timestamp >= startOfDay).reduce((acc, curr) => acc + curr.amount, 0),
      latestMood: state.journalEntries.length > 0 ? state.journalEntries[0].mood : 'unknown',
      lastJournalEntry: state.journalEntries.length > 0 ? state.journalEntries[0].content.substring(0, 100) : 'none'
    };

    const prompt = `
      Current User Context (Today):
      ${JSON.stringify(dailyContext, null, 2)}
      
      Based on this snapshot, provide a specific cognitive insight or recommendation.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "Keep tracking your day to unlock insights.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Nexus AI is currently recalibrating. Continue your flow.";
  }
};

export const analyzeJournalEntry = async (entry: string, mood: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `The user wrote this journal entry with a mood of '${mood}': "${entry}". \n\n Provide a single sentence of psychological validation or a gentle question to deepen their reflection.`,
        });
        return response.text || "Thank you for sharing.";
    } catch (error) {
        return "Reflection saved.";
    }
}

export const generateSubtasks = async (taskTitle: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Break down the task "${taskTitle}" into 3-5 smaller, actionable subtasks to reduce cognitive load.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });
    
    // Parse the JSON array from the response text
    if (response.text) {
      return JSON.parse(response.text) as string[];
    }
    return [];
  } catch (error) {
    console.error("Gemini Subtask Error:", error);
    return ["Identify the first small step", "Set a 5 minute timer", "Execute step one"];
  }
}