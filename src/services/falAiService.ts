
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
    // The key format needs to be "fal_key_..." without additional text
    fal.config({
      credentials: apiKey,
    });
    
    // Use the fal.subscribe method to generate the video
    const result = await fal.subscribe("fal-ai/veo2", {
      input: {
        prompt: `A person making the sign language gesture for: "${prompt}"`,
      },
    });
    
    // The response from fal.ai doesn't match the TypeScript definition perfectly
    // We need to safely extract the video URL from wherever it might be in the response
    const resultAny = result as any;
    
    // Try to find the video URL in various possible locations based on the API response structure
    const videoUrl = resultAny.video_url || resultAny.url || resultAny.output?.video_url;
    
    if (!videoUrl) {
      console.error("No video URL found in response:", resultAny);
      throw new Error("No video URL found in API response");
    }
    
    return videoUrl;
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
