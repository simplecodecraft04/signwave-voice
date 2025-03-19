
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
    
    // Check the result structure and access the video URL using the correct path
    // Since 'output' doesn't exist directly, we need to access the appropriate property
    return result.video_url || result.url || (result as any).output?.video_url;
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
