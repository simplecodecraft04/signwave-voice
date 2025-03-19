
import { fal } from "@fal-ai/client";
import { toast } from "@/hooks/use-toast";

// Default configuration will be set based on user-provided API key
let isConfigured = false;

interface FalAiOptions {
  prompt: string;
  apiKey?: string;
}

/**
 * Configure the fal.ai client with the provided API key
 */
export const configureFalClient = (apiKey: string): boolean => {
  try {
    if (!apiKey) return false;
    
    // API key must be in the correct format (key_id:key_secret)
    if (!apiKey.includes(':')) {
      toast({
        title: "Invalid API Key Format",
        description: "The API key should be in the format 'key_id:key_secret'",
        variant: "destructive",
      });
      return false;
    }

    fal.config({
      credentials: apiKey,
    });
    
    console.log("Fal.ai client configured successfully");
    isConfigured = true;
    return true;
  } catch (error) {
    console.error("Error configuring fal.ai client:", error);
    isConfigured = false;
    return false;
  }
};

export const generateSignLanguageVideo = async ({ prompt, apiKey }: FalAiOptions) => {
  try {
    // If an API key is provided, configure the client with it
    if (apiKey && !isConfigured) {
      const success = configureFalClient(apiKey);
      if (!success) {
        throw new Error("Failed to configure fal.ai client with the provided API key");
      }
    }

    // Check if client is configured
    if (!isConfigured) {
      throw new Error("Fal.ai client not configured. Please provide a valid API key.");
    }

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
    let videoUrl = null;
    if (result) {
      if (typeof result === 'object') {
        // Try different possible locations of the URL in the result object
        if ('video_url' in result) {
          videoUrl = (result as any).video_url;
        } else if ('url' in result) {
          videoUrl = (result as any).url;
        } else if ('output' in result) {
          const output = (result as any).output;
          if (output && typeof output === 'object') {
            if ('video_url' in output) {
              videoUrl = output.video_url;
            } else if ('url' in output) {
              videoUrl = output.url;
            }
          }
        }
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
