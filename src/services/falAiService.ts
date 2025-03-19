
import { toast } from "sonner";

// fal.ai API endpoints
const FAL_API_URL = "https://fal.run/fal-ai/veo2";

// Response type for the video generation
export interface VeoVideoResponse {
  video_url: string;
  task_id: string;
  status: string;
}

export interface GenerateVideoParams {
  text: string;
  reference_image?: string; // Optional reference image URL
}

/**
 * Generates a video from text using fal.ai veo2 model
 */
export const generateVideo = async (
  apiKey: string,
  params: GenerateVideoParams
): Promise<VeoVideoResponse> => {
  if (!apiKey) {
    toast.error("Please enter your fal.ai API key");
    throw new Error("Missing API key");
  }

  try {
    const response = await fetch(FAL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Key ${apiKey}`,
      },
      body: JSON.stringify({
        text: params.text,
        // Include optional reference image if provided
        ...(params.reference_image && { reference_image: params.reference_image }),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Video generation failed:", errorData);
      toast.error("Failed to generate video. Please check your API key and try again.");
      throw new Error(`Video generation failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating video:", error);
    toast.error("An error occurred while generating the video");
    throw error;
  }
};

/**
 * Checks the status of a video generation task
 */
export const checkVideoStatus = async (
  apiKey: string,
  taskId: string
): Promise<VeoVideoResponse> => {
  try {
    const response = await fetch(`${FAL_API_URL}/status/${taskId}`, {
      headers: {
        "Authorization": `Key ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to check video status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking video status:", error);
    throw error;
  }
};
