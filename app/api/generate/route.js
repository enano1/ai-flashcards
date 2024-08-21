import { NextResponse } from "next/server"
import OpenAI from 'openai'

const systemPrompt = `
You are a flash card creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guidelines:
1. Keep the flashcard concise and focused on a single piece of information.
2. Use a clear and concise title for the flashcard.
3. Use a conversational tone in the description.
4. Use formatting to make the content more engaging and scannable.
5. Use examples and anecdotes to make the content more relatable and memorable.
6. Use a consistent structure for each flashcard.
7. Keep the flashcard short and to the point.
8. This is important. Do not exceed 15 words on the backside.
9. Only generates 10 flashcards.

Return in the following JSON format
{
    "flashcards": [
        {
            "front": str,
            "back": str
        }
    ]
}
`

export async function POST(request) {
    const openai = new OpenAI()
    const data = await request.text()
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: data },
        ],
        response_format: {type: "json_object"},
    });
    
       
    const flashcards = JSON.parse(completion.choices[0].message.content)

    return NextResponse.json(flashcards.flashcards) //we do this because we want to return a list of flashcards in a json object
}
