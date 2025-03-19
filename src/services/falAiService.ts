
import { toast } from "@/hooks/use-toast";

interface FalAiOptions {
  prompt: string;
}

export const generateSignLanguageVideo = async ({ prompt }: FalAiOptions) => {
  try {
    const apiKey = localStorage.getItem('falAiApiKey');
    
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please provide your fal.ai API key in the settings",
        variant: "destructive",
      });
      return null;
    }

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
