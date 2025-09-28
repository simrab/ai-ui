import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function convertToBase64(blob: Blob, mimeType?: "jpg"): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(",")[1];
      return resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// TODO: Improve typing
export default async function sendImage(contents: {
  blob: Blob;
  height: number;
  width: number;
}) {
  const imageBase64 = await convertToBase64(contents.blob);
  const contentsFormatted = [
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64,
      },
    },
    { text: "convert this image to html" },
  ];
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contentsFormatted,
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking
        },
      },
    });
    console.log(response);
  } catch (err: any) {
    return {
      success: false,
      message: "Error while sending data to AI",
      error: err,
    };
  }
}
