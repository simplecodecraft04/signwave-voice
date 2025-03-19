
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
    // According to the fal.ai documentation, we need to use the correct properties for the input
    const result = await fal.subscribe("fal-ai/veo2", {
      input: {
        prompt: `A person making the sign language gesture for: "${prompt}"`,
        // We'll use the properties that are allowed by the Veo2Input type
        // No output_format here since it's not in the type definition
      },
    });
    
    // The response from fal.ai doesn't match the TypeScript definition perfectly
    // We need to safely extract the video URL from wherever it might be in the response
    // Using type assertion to access possible properties
    const resultAny = result as any;
    
    // Try to find the video URL in various possible locations based on the API response structure
    return resultAny.video_url || resultAny.url || resultAny.output?.video_url;
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
