
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
    
    // Extract video URL from response based on the actual structure
    let videoUrl = null;
    
    if (result && typeof result === 'object') {
      // First check if there's a data.video object structure
      if (result.data?.video?.url) {
        videoUrl = result.data.video.url;
      } 
      // Then check for data.video direct URL
      else if (result.data?.video) {
        videoUrl = result.data.video;
      }
      // Then check for data.video_url
      else if (result.data?.video_url) {
        videoUrl = result.data.video_url;
      }
      // Check various possible nested structures
      else if (result.output?.video?.url) {
        videoUrl = result.output.video.url;
      }
      else if (result.output?.video) {
        videoUrl = result.output.video;
      }
      else if (result.output?.video_url) {
        videoUrl = result.output.video_url;
      }
      // Direct video_url at root level
      else if (result.video_url) {
        videoUrl = result.video_url;
      }
      // Direct url at root level
      else if (result.url) {
        videoUrl = result.url;
      }
      
      // Try to look for video inside nested data structure
      const data = result.data;
      if (data && typeof data === 'object' && !videoUrl) {
        // Log the full data structure to help debug
        console.log("Inspecting data structure for video URL:", JSON.stringify(data, null, 2));
        
        // Look for any property that might contain a video URL
        for (const key in data) {
          const value = data[key];
          if (typeof value === 'string' && 
              (value.endsWith('.mp4') || 
               value.includes('video') || 
               value.includes('mp4'))) {
            videoUrl = value;
            break;
          } else if (value && typeof value === 'object') {
            // Check one level deeper
            for (const nestedKey in value) {
              const nestedValue = value[nestedKey];
              if (typeof nestedValue === 'string' && 
                  (nestedValue.endsWith('.mp4') || 
                   nestedValue.includes('video') || 
                   nestedValue.includes('mp4'))) {
                videoUrl = nestedValue;
                break;
              }
            }
          }
        }
      }
    }

    if (!videoUrl) {
      console.error("No video URL found in response:", result);
      
      // Log the entire response structure to help debug
      if (result && typeof result === 'object') {
        console.log("Full response structure:", JSON.stringify(result, null, 2));
      }
      
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
