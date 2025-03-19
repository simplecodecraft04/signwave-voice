
import { fal } from "@fal-ai/client";
import { toast } from "@/hooks/use-toast";

// Configure fal.ai client
fal.config({
  credentials: "a414c158-199a-43b0-8b10-3f19e1d49fb6:9b9421ea5deb305c",
});

interface FalAiOptions {
  prompt: string;
}

export const generateSignLanguageVideo = async ({ prompt }: FalAiOptions) => {
  try {
    console.log("Generating sign language video for prompt:", prompt);
    
    const result = await fal.subscribe("fal-ai/veo2", {
      input: {
        prompt: `A person making the sign language gesture for: "${prompt}"`,
      },
      pollInterval: 1000, // poll every 1s
      onQueueUpdate: (update) => {
        console.log("Queue update:", update);
      },
    });

    console.log("Fal.ai result:", result);
    
    // Extract video URL from response
    // The structure might be in result.video_url, result.url, or result.output.video_url
    let videoUrl = null;
    if (result) {
      if ('video_url' in result) {
        videoUrl = (result as any).video_url;
      } else if ('url' in result) {
        videoUrl = (result as any).url;
      } else if ('output' in result && 'video_url' in (result as any).output) {
        videoUrl = (result as any).output.video_url;
      }
    }

    if (!videoUrl) {
      console.error("No video URL found in response:", result);
      throw new Error("Failed to extract video URL from response");
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
