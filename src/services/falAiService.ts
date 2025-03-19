
import { toast } from "@/hooks/use-toast";

const getApiKey = (): string => {
  const apiKey = localStorage.getItem("FAL_AI_API_KEY");
  return apiKey || "";
};

interface FalAiOptions {
  prompt: string;
}

export const generateSignLanguageVideo = async ({ prompt }: FalAiOptions) => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    toast({
      title: "API Key Missing",
      description: "Please set your fal.ai API key in the settings first.",
      variant: "destructive",
    });
    return null;
  }
  
  try {
    const response = await fetch("https://api.fal.ai/v2/video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Key ${apiKey}`,
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
