import { fal } from "@fal-ai/client";

// Configure the fal.ai client with the API key from environment
// The API key should be set in your .env.local file as FAL_KEY
if (process.env.NEXT_PUBLIC_FAL_KEY) {
  fal.config({
    credentials: process.env.NEXT_PUBLIC_FAL_KEY,
  });
}

// Define types for the fal.ai video generation API
interface VideoGenerationInput {
  prompt: string;
  image_url: string;
  aspect_ratio?: "auto" | "16:9" | "9:16";
  duration?: "5s" | "6s" | "7s" | "8s";
}

interface VideoGenerationOutput {
  video: {
    url: string;
    content_type?: string;
    file_name?: string;
    file_size?: number;
  };
}

interface VideoGenerationQueueUpdate {
  status: string;
  logs: { message: string }[];
}

/**
 * Generate a video from an image using fal.ai's Veo 2 model
 * @param input The input parameters for video generation
 * @returns A promise that resolves to the video URL
 */
export async function generateVideo(
  input: VideoGenerationInput
): Promise<string | null> {
  try {
    console.log("Generating video from image with prompt:", input.prompt);

    // Subscribe to the fal.ai video generation service
    const result = await fal.subscribe("fal-ai/veo2/image-to-video", {
      input,
      logs: true,
      onQueueUpdate: (update: VideoGenerationQueueUpdate) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    console.log("Video generation completed:", result.data);

    if (result.data && (result.data as VideoGenerationOutput).video) {
      return (result.data as VideoGenerationOutput).video.url;
    }

    return null;
  } catch (error) {
    console.error("Error generating video:", error);
    return null;
  }
}

/**
 * Submit a video generation job to the queue and return the request ID
 * @param input The input parameters for video generation
 * @returns A promise that resolves to the request ID
 */
export async function queueVideoGeneration(
  input: VideoGenerationInput
): Promise<string | null> {
  try {
    console.log("Queuing video generation with prompt:", input.prompt);

    const { request_id } = await fal.queue.submit(
      "fal-ai/veo2/image-to-video",
      {
        input,
      }
    );

    console.log("Video generation queued with ID:", request_id);
    return request_id;
  } catch (error) {
    console.error("Error queuing video generation:", error);
    return null;
  }
}

/**
 * Check the status of a video generation job
 * @param requestId The request ID of the video generation job
 * @returns A promise that resolves to the job status
 */
export async function checkVideoGenerationStatus(
  requestId: string
): Promise<any> {
  try {
    const status = await fal.queue.status("fal-ai/veo2/image-to-video", {
      requestId,
      logs: true,
    });

    return status;
  } catch (error) {
    console.error("Error checking video generation status:", error);
    return null;
  }
}

/**
 * Get the result of a video generation job
 * @param requestId The request ID of the video generation job
 * @returns A promise that resolves to the video URL
 */
export async function getVideoGenerationResult(
  requestId: string
): Promise<string | null> {
  try {
    const result = await fal.queue.result("fal-ai/veo2/image-to-video", {
      requestId,
    });

    if (result.data && (result.data as VideoGenerationOutput).video) {
      return (result.data as VideoGenerationOutput).video.url;
    }

    return null;
  } catch (error) {
    console.error("Error getting video generation result:", error);
    return null;
  }
}
