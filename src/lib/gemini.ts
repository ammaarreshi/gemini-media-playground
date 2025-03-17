import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with API key
const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

// Type for the chat message
export type ChatMessage = {
  role: "user" | "model";
  parts: Array<{
    text?: string;
    imageUrl?: string;
    inlineData?: {
      mimeType: string;
      data: string;
    };
  }>;
};

// Generate image using Gemini API
export async function generateImage(prompt: string): Promise<string | null> {
  try {
    // Set responseModalities to include "Image" so the model can generate an image
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ["Text", "Image"],
      },
    });

    const response = await model.generateContent(prompt);

    // Extract the image from the response
    for (const part of response.response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}

// Edit an image using Gemini API
export async function editImage(
  prompt: string,
  imageBase64: string,
  mimeType: string = "image/png"
): Promise<string | null> {
  try {
    console.log("Editing image with prompt:", prompt);
    console.log("Image base64 string length:", imageBase64.length);
    console.log("MIME type:", mimeType);

    // Set responseModalities to include "Image" for image generation
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ["Text", "Image"],
      },
    });

    // Prepare the content parts with text and image
    const contents = [
      { text: prompt },
      {
        inlineData: {
          mimeType,
          data: imageBase64,
        },
      },
    ];

    console.log("Sending content to Gemini API...");
    const response = await model.generateContent(contents);
    console.log("Response received from Gemini API");

    // Extract the image from the response
    for (const part of response.response.candidates[0].content.parts) {
      if (part.text) {
        console.log("Text response:", part.text);
      } else if (part.inlineData) {
        console.log(
          "Image data received, length:",
          part.inlineData.data.length
        );
        return part.inlineData.data;
      }
    }

    console.log("No image found in response");
    return null;
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
}

// Generate style suggestions based on the original prompt
export async function generateStyleSuggestions(
  originalPrompt: string
): Promise<Array<{ name: string; style: string }> | null> {
  try {
    console.log("Generating style suggestions for prompt:", originalPrompt);

    // Create a model for generating suggestions - using the same model as image generation/editing
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ["Text"],
      },
    });

    // Create a prompt that asks for style suggestions
    const suggestionsPrompt = `
      Based on this image description: "${originalPrompt}", 
      generate 6 creative style modification suggestions that would look good for this image.
      
      Return the result as a JSON array of objects, where each object has:
      - 'name': a short, catchy name for the button (2-3 words max)
      - 'style': a detailed instruction for how to edit the image (start with an action verb)
      
      For example:
      [
        { "name": "Neon Glow", "style": "Add neon glow effects with bright blues and pinks" },
        { "name": "Vintage Film", "style": "Apply a vintage film grain and desaturated colors" }
      ]
      
      Be creative and varied with the suggestions. They should be different from each other.
      Output ONLY the JSON array, no other text.
    `;

    const response = await model.generateContent(suggestionsPrompt);
    const responseText = response.response.text();

    console.log("Raw suggestion response:", responseText);

    // Extract the JSON array from the response
    try {
      // Find the JSON array in the response text
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);

      if (jsonMatch) {
        const suggestions = JSON.parse(jsonMatch[0]);
        console.log("Parsed suggestions:", suggestions);
        return suggestions;
      } else {
        // If no JSON array was found, try to parse the entire response as JSON
        const suggestions = JSON.parse(responseText);
        console.log("Parsed suggestions from full text:", suggestions);
        return suggestions;
      }
    } catch (parseError) {
      console.error("Error parsing suggestions:", parseError);
      // Fallback to default suggestions if parsing fails
      return null;
    }
  } catch (error) {
    console.error("Error generating style suggestions:", error);
    return null;
  }
}

// Generate an animation prompt for the image using Gemini
export async function generateAnimationPrompt(
  originalPrompt: string
): Promise<string | null> {
  try {
    console.log("Generating animation prompt for:", originalPrompt);

    // Create a model for generating the animation prompt
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ["Text"],
        temperature: 0.8,
        maxOutputTokens: 200,
      },
    });

    // Create a prompt that asks for a creative animation suggestion
    const animationPromptTemplate = `
      Based on this image description: "${originalPrompt}", 
      generate a creative, detailed prompt for animating this image into a short video.
      
      The prompt should:
      1. Describe subtle, natural movements that would make the image come alive
      2. Suggest camera movements or zooms if appropriate
      3. Add atmosphere elements like wind, light changes, or particle effects if fitting
      4. Be specific but concise (under 100 words)
      
      Focus on creating a prompt that would work well with AI video generation from a still image.
      
      Output ONLY the prompt itself, no explanations or additional text.
    `;

    const response = await model.generateContent(animationPromptTemplate);
    const responseText = response.response.text().trim();

    console.log("Generated animation prompt:", responseText);

    if (responseText) {
      return responseText;
    }

    return null;
  } catch (error) {
    console.error("Error generating animation prompt:", error);
    return null;
  }
}
