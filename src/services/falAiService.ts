
import { toast } from "@/hooks/use-toast";

const FAL_AI_API_KEY = "your-fal-ai-api-key-here"; // Replace with your actual fal.ai API key

interface FalAiOptions {
  prompt: string;
}

export const generateSignLanguageVideo = async ({ prompt }: FalAiOptions) => {
  try {
    const response = await fetch("https://api.fal.ai/v2/video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Key ${FAL_AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "fal.ai/veo2",
        prompt: `A person making the sign language gesture for: "${prompt}"`,
        output_format: "mp4",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to generate video");
    }

    const data = await response.json();
    return data.video_url;
  } catch (error) {
    console.error("Error generating sign language video:", error);
    toast({
      title: "Generation Failed",
      description: error instanceof Error ? error.message : "Failed to generate video",
      variant: "destructive",
    });
    return null;
  }
};
