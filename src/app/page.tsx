"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChatInput } from "@/components/chat-input";
import { ChatContainer } from "@/components/chat-container";
import { StyleButtons } from "@/components/style-buttons";
import { ImageDisplay } from "@/components/image-display";
import {
  generateImage,
  editImage,
  generateStyleSuggestions,
  generateAnimationPrompt,
} from "@/lib/gemini";
import { generateVideo } from "@/lib/fal-ai";
import { fileToBase64, base64ToDataURL } from "@/lib/image-utils";
import { Toaster } from "sonner";
import { toast } from "sonner";

// Message type definition
interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  imageData?: string | null;
  videoUrl?: string | null;
}

// Style suggestion type
interface StyleSuggestion {
  name: string;
  style: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUserPrompt, setLastUserPrompt] = useState<string>("");
  const [styleSuggestions, setStyleSuggestions] = useState<
    StyleSuggestion[] | null
  >(null);
  const [isSuggestionsLoading, setIsSuggestionsLoading] =
    useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);
  const [showPrompts, setShowPrompts] = useState<boolean>(false);

  // Initialize with welcome messages
  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true);

      // Hide prompt suggestions initially
      setShowPrompts(false);

      // Initial welcome message
      const welcomeMessage: Message = {
        role: "assistant",
        content:
          "Hey, welcome to the Gemini Native image generation playground!",
        timestamp: new Date(),
      };

      setMessages([welcomeMessage]);

      // Simulate thinking after 1 second
      setTimeout(() => {
        setIsInitializing(true);

        // Add feature message after 1.5 seconds
        setTimeout(() => {
          setIsInitializing(false);

          const featureMessage: Message = {
            role: "assistant",
            content:
              "You can generate images, edit them, and even animate them with Veo!",
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, featureMessage]);

          // Add suggestion message after a short delay
          setTimeout(() => {
            const suggestionMessage: Message = {
              role: "assistant",
              content: "Get started with the prompts below or write your own",
              timestamp: new Date(),
            };

            setMessages((prev) => [...prev, suggestionMessage]);

            // Only show prompt suggestions after all messages are displayed
            setTimeout(() => {
              setShowPrompts(true);
            }, 1000);
          }, 800);
        }, 1500);
      }, 1000);
    }
  }, [hasInitialized]);

  // Handle the generation of images from text prompts
  const handleSubmit = async (prompt: string) => {
    try {
      // Add user message to chat
      const userMessage: Message = {
        role: "user",
        content: prompt,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setLastUserPrompt(prompt);
      setIsLoading(true);

      // Text-to-image generation
      const result = await generateImage(prompt);

      if (result) {
        setImageBase64(result);

        // Add assistant response with image data
        const assistantMessage: Message = {
          role: "assistant",
          content: "Here's what I created:",
          timestamp: new Date(),
          imageData: result,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        toast.success("Image generated successfully!");

        // Generate style suggestions based on the prompt
        generateDynamicSuggestions(prompt);
      } else {
        toast.error("Failed to generate image");

        // Add error response from assistant
        const errorMessage: Message = {
          role: "assistant",
          content:
            "Sorry, I was unable to generate an image. Please try a different prompt.",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");

      // Add error message
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate dynamic style suggestions based on the prompt
  const generateDynamicSuggestions = async (prompt: string) => {
    try {
      setIsSuggestionsLoading(true);
      const suggestions = await generateStyleSuggestions(prompt);
      if (suggestions) {
        console.log("Generated style suggestions:", suggestions);
        setStyleSuggestions(suggestions);
      } else {
        console.log("No style suggestions generated, using defaults");
        setStyleSuggestions(null);
      }
    } catch (error) {
      console.error("Error generating style suggestions:", error);
      setStyleSuggestions(null);
    } finally {
      setIsSuggestionsLoading(false);
    }
  };

  // Handle applying style to the last generated image
  const handleApplyStyle = async (stylePrompt: string) => {
    if (!imageBase64 || !lastUserPrompt) return;

    try {
      setIsLoading(true);

      // Add user message about the style change
      const userMessage: Message = {
        role: "user",
        content: `${stylePrompt}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Make sure the imageBase64 doesn't include the "data:image/..." prefix
      let cleanedImageBase64 = imageBase64;
      if (imageBase64.includes("base64,")) {
        cleanedImageBase64 = imageBase64.split("base64,")[1];
        console.log("Cleaned base64 data");
      }

      // Edit the current image with the style instead of generating new
      const result = await editImage(stylePrompt, cleanedImageBase64);

      if (result) {
        setImageBase64(result);

        // Add assistant response with image data
        const assistantMessage: Message = {
          role: "assistant",
          content: "Here's the image with the style applied:",
          timestamp: new Date(),
          imageData: result,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        toast.success("Style applied successfully!");

        // Generate new style suggestions based on the updated image and prompt
        const combinedPrompt = `${lastUserPrompt} with ${stylePrompt.toLowerCase()}`;
        generateDynamicSuggestions(combinedPrompt);
      } else {
        toast.error("Failed to apply style");

        // Add error response
        const errorMessage: Message = {
          role: "assistant",
          content:
            "Sorry, I was unable to apply that style. Please try a different one.",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error applying style:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle editing of previously generated images
  const handleEditImage = async (editPrompt: string, imageToEdit: string) => {
    try {
      // Add user edit request message
      const userMessage: Message = {
        role: "user",
        content: editPrompt,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      // Make sure the imageToEdit doesn't include the "data:image/..." prefix
      let cleanedImageBase64 = imageToEdit;
      if (imageToEdit.includes("base64,")) {
        cleanedImageBase64 = imageToEdit.split("base64,")[1];
        console.log("Cleaned edit image base64 data");
      }

      const result = await editImage(editPrompt, cleanedImageBase64);

      if (result) {
        setImageBase64(result);
        // Save the edit prompt for future style suggestions
        setLastUserPrompt(editPrompt);

        // Add assistant response with edited image
        const assistantMessage: Message = {
          role: "assistant",
          content: "Here's your edited image:",
          timestamp: new Date(),
          imageData: result,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        toast.success("Image edited successfully!");

        // Generate new style suggestions based on the edit prompt
        generateDynamicSuggestions(editPrompt);
      } else {
        toast.error("Failed to edit image");

        // Add error response
        const errorMessage: Message = {
          role: "assistant",
          content:
            "Sorry, I was unable to edit the image. Please try a different prompt.",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error editing image:", error);
      toast.error("An error occurred while editing. Please try again.");

      // Add error message
      const errorMessage: Message = {
        role: "assistant",
        content:
          "Sorry, something went wrong with the image edit. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle generating a video from an image
  const handleGenerateVideo = async (
    videoPrompt: string,
    imageData: string
  ) => {
    try {
      // Add user video request message
      const userMessage: Message = {
        role: "user",
        content: `Animate this image: ${videoPrompt}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsGeneratingVideo(true);

      // Generate a loading message
      const loadingMessage: Message = {
        role: "assistant",
        content: "Generating video from your image... This may take a minute.",
        timestamp: new Date(),
        imageData: imageData,
      };

      setMessages((prev) => [...prev, loadingMessage]);

      // Make sure the imageData doesn't include the "data:image/..." prefix
      let cleanedImageBase64 = imageData;
      if (imageData.includes("base64,")) {
        cleanedImageBase64 = imageData.split("base64,")[1];
        console.log("Cleaned video image base64 data");
      }

      // Convert to data URL for the API
      const imageUrl = base64ToDataURL(cleanedImageBase64);

      // Call the fal.ai API to generate the video
      console.log("Generating video with prompt:", videoPrompt);
      console.log("Using image URL format:", imageUrl.substring(0, 30) + "...");

      const videoResult = await generateVideo({
        prompt: videoPrompt,
        image_url: imageUrl,
        aspect_ratio: "auto",
        duration: "5s",
      });

      // Remove the loading message
      setMessages((prev) => prev.filter((msg) => msg !== loadingMessage));

      if (videoResult) {
        setVideoUrl(videoResult);

        // Add assistant response with video
        const assistantMessage: Message = {
          role: "assistant",
          content: "Here's your animated video:",
          timestamp: new Date(),
          imageData: imageData,
          videoUrl: videoResult,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        toast.success("Video generated successfully!");
      } else {
        toast.error("Failed to generate video");

        // Add error response
        const errorMessage: Message = {
          role: "assistant",
          content:
            "Sorry, I was unable to generate a video. Please try a different prompt.",
          timestamp: new Date(),
          imageData: imageData,
        };

        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error generating video:", error);
      toast.error(
        "An error occurred while generating the video. Please try again."
      );

      // Add error message
      const errorMessage: Message = {
        role: "assistant",
        content:
          "Sorry, something went wrong with the video generation. Please try again.",
        timestamp: new Date(),
        imageData: imageData,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  // Handle instant animation with Gemini-generated prompt
  const handleInstantAnimate = async (imageBase64: string) => {
    try {
      setIsGeneratingVideo(true);

      // Create a single loading message that will be updated
      const loadingMessage: Message = {
        role: "assistant",
        content: "Creating animation for your image...",
        timestamp: new Date(),
        imageData: imageBase64,
      };

      setMessages((prev) => [...prev, loadingMessage]);

      // Generate animation prompt using Gemini
      const animationPrompt = await generateAnimationPrompt(
        lastUserPrompt || "an image"
      );

      if (animationPrompt) {
        // Update loading message with the generated prompt
        const updatedLoadingMessage: Message = {
          ...loadingMessage,
          content: `Creating animation: "${animationPrompt}"...`,
        };

        setMessages((prev) =>
          prev.map((msg) =>
            msg === loadingMessage ? updatedLoadingMessage : msg
          )
        );

        // Use the generated prompt to create the animation
        // We'll skip adding more user or assistant messages here
        // Just call the video generation directly

        // Make sure the imageData doesn't include the "data:image/..." prefix
        let cleanedImageBase64 = imageBase64;
        if (imageBase64.includes("base64,")) {
          cleanedImageBase64 = imageBase64.split("base64,")[1];
        }

        // Convert to data URL for the API
        const imageUrl = base64ToDataURL(cleanedImageBase64);

        // Call the fal.ai API to generate the video
        const videoResult = await generateVideo({
          prompt: animationPrompt,
          image_url: imageUrl,
          aspect_ratio: "auto",
          duration: "5s",
        });

        // Remove the loading message
        setMessages((prev) =>
          prev.filter((msg) => msg !== updatedLoadingMessage)
        );

        if (videoResult) {
          setVideoUrl(videoResult);

          // Add assistant response with video - this is the only message we'll show
          const assistantMessage: Message = {
            role: "assistant",
            content: "Here's your animated video:",
            timestamp: new Date(),
            imageData: imageBase64,
            videoUrl: videoResult,
          };

          setMessages((prev) => [...prev, assistantMessage]);
          toast.success("Video generated successfully!");
        } else {
          toast.error("Failed to generate video");

          // Add error response
          const errorMessage: Message = {
            role: "assistant",
            content:
              "Sorry, I was unable to generate a video. Please try again.",
            timestamp: new Date(),
            imageData: imageBase64,
          };

          setMessages((prev) => [...prev, errorMessage]);
        }
      } else {
        // If prompt generation fails, use a default prompt
        const defaultPrompt =
          "Gentle camera zoom and subtle movement in the scene";

        // Update loading message with the default prompt
        const updatedLoadingMessage: Message = {
          ...loadingMessage,
          content: `Creating animation with default settings...`,
        };

        setMessages((prev) =>
          prev.map((msg) =>
            msg === loadingMessage ? updatedLoadingMessage : msg
          )
        );

        // Use same approach as above for the default prompt
        // Make sure the imageData doesn't include the "data:image/..." prefix
        let cleanedImageBase64 = imageBase64;
        if (imageBase64.includes("base64,")) {
          cleanedImageBase64 = imageBase64.split("base64,")[1];
        }

        // Convert to data URL for the API
        const imageUrl = base64ToDataURL(cleanedImageBase64);

        // Call the fal.ai API to generate the video
        const videoResult = await generateVideo({
          prompt: defaultPrompt,
          image_url: imageUrl,
          aspect_ratio: "auto",
          duration: "5s",
        });

        // Remove the loading message
        setMessages((prev) =>
          prev.filter((msg) => msg !== updatedLoadingMessage)
        );

        if (videoResult) {
          setVideoUrl(videoResult);

          // Add assistant response with video
          const assistantMessage: Message = {
            role: "assistant",
            content: "Here's your animated video:",
            timestamp: new Date(),
            imageData: imageBase64,
            videoUrl: videoResult,
          };

          setMessages((prev) => [...prev, assistantMessage]);
          toast.success("Video generated successfully!");
        } else {
          toast.error("Failed to generate video");

          // Add error response
          const errorMessage: Message = {
            role: "assistant",
            content:
              "Sorry, I was unable to generate a video. Please try again.",
            timestamp: new Date(),
            imageData: imageBase64,
          };

          setMessages((prev) => [...prev, errorMessage]);
        }
      }
    } catch (error) {
      console.error("Error in instant animation:", error);
      toast.error("Failed to generate animation. Please try again.");
      setIsGeneratingVideo(false);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: string) => {
    // Hide prompt suggestions immediately when a suggestion is clicked
    setShowPrompts(false);

    // Handle the submission
    handleSubmit(suggestion);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between relative">
      <div className="flex flex-col items-center justify-center w-full px-4 py-2 relative">
        <ChatContainer
          messages={messages}
          imageBase64={imageBase64}
          onEditImage={handleEditImage}
          onGenerateVideo={handleGenerateVideo}
          onInstantAnimate={handleInstantAnimate}
          isLoading={isLoading || isGeneratingVideo || isInitializing}
          onSelectSuggestion={handleSelectSuggestion}
          showPromptSuggestions={showPrompts}
        />
      </div>

      {/* Footer with style buttons and input */}
      <div className="fixed bottom-0 left-0 right-0 z-10 backdrop-blur-2xl bg-background/30 border-0 pt-4">
        <div className="flex flex-col items-center justify-center w-full max-w-4xl px-6 mx-auto pb-6">
          {imageBase64 && (
            <div className="w-full mb-4">
              <StyleButtons
                onApplyStyle={handleApplyStyle}
                disabled={isLoading || isGeneratingVideo}
                dynamicSuggestions={styleSuggestions}
                isLoadingSuggestions={isSuggestionsLoading}
              />
            </div>
          )}
          <ChatInput
            onSubmit={handleSubmit}
            isLoading={isLoading || isGeneratingVideo}
          />
        </div>
      </div>

      <Toaster position="top-center" />
    </main>
  );
}
