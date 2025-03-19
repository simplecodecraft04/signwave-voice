
import { fal } from "@fal-ai/client";
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
    // Configure fal client with the API key from localStorage
    fal.config({
      credentials: apiKey,
    });
    
    // Use the fal.subscribe method to generate the video
    const result = await fal.subscribe("fal-ai/veo2", {
      input: {
        prompt: `A person making the sign language gesture for: "${prompt}"`,
        output_format: "mp4",
      },
    });
    
    // Return the video URL from the result
    return result.output?.video_url;
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
