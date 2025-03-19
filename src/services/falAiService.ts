
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
    
    // Use type assertion to avoid TypeScript errors
    const resultObj = result as any;
    
    if (resultObj && typeof resultObj === 'object') {
      // Check data.video.url path
      if (resultObj.data?.video?.url) {
        videoUrl = resultObj.data.video.url;
      } 
      // Check if data.video is a string (direct URL)
      else if (typeof resultObj.data?.video === 'string') {
        videoUrl = resultObj.data.video;
      }
      // Check data.video_url path
      else if (resultObj.data?.video_url) {
        videoUrl = resultObj.data.video_url;
      }
      // Check possible paths if output is present
      else if (resultObj.output?.video?.url) {
        videoUrl = resultObj.output.video.url;
      }
      else if (typeof resultObj.output?.video === 'string') {
        videoUrl = resultObj.output.video;
      }
      else if (resultObj.output?.video_url) {
        videoUrl = resultObj.output.video_url;
      }
      // Check root level properties
      else if (resultObj.video_url) {
        videoUrl = resultObj.video_url;
      }
      else if (resultObj.url) {
        videoUrl = resultObj.url;
      }
      
      // Deep search for video URL if still not found
      if (!videoUrl && resultObj.data) {
        // Log the full data structure to help debug
        console.log("Inspecting data structure for video URL:", JSON.stringify(resultObj.data, null, 2));
        
        const searchForVideoUrl = (obj: any): string | null => {
          if (!obj || typeof obj !== 'object') return null;
          
          // Look for properties directly
          for (const key in obj) {
            const value = obj[key];
            
            // Check if the value is a string that looks like a video URL
            if (typeof value === 'string' && 
                (value.endsWith('.mp4') || 
                 value.includes('video') || 
                 value.includes('mp4'))) {
              return value;
            }
            
            // Recursively check nested objects (but not too deep)
            if (value && typeof value === 'object') {
              const nestedUrl = searchForVideoUrl(value);
              if (nestedUrl) return nestedUrl;
            }
          }
          
          return null;
        };
        
        videoUrl = searchForVideoUrl(resultObj.data);
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
