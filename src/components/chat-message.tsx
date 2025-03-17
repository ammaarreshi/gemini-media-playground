import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageDisplay } from "./image-display";
import { VideoPlayer } from "./video-player";

export interface ChatMessageProps {
  message: {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    imageData?: string | null;
    videoUrl?: string | null;
  };
  imageBase64?: string | null;
  onEditImage?: (prompt: string, imageBase64: string) => void;
  onGenerateVideo?: (prompt: string, imageBase64: string) => void;
  onInstantAnimate?: (imageBase64: string) => void;
  isLoading?: boolean;
}

export function ChatMessage({
  message,
  imageBase64,
  onEditImage,
  onGenerateVideo,
  onInstantAnimate,
  isLoading = false,
}: ChatMessageProps) {
  const isUser = message.role === "user";
  const [formattedTime, setFormattedTime] = useState<string>("");

  // Determine which image data to use - prioritize the message's imageData
  const imageToDisplay = message.imageData || imageBase64;

  // Check if this is a loading message for video generation
  const isVideoLoading =
    isLoading &&
    !isUser &&
    (message.content.includes("Creating animation") ||
      message.content.includes("Generating video"));

  // Format the timestamp on the client side to avoid hydration errors
  useEffect(() => {
    setFormattedTime(
      message.timestamp.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, [message.timestamp]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
      layout // Add layout animation for smooth height changes
      key={`${message.content}-${message.timestamp.getTime()}`} // Key helps with animation when content changes
    >
      <motion.div
        layout // Add layout animation for smooth content changes
        className={`max-w-2xl ${
          isUser
            ? "bg-primary/90 text-primary-foreground backdrop-blur-md"
            : "bg-primary/5 backdrop-blur-md"
        } 
          rounded-2xl px-4 py-3 ${isUser ? "rounded-tr-sm" : "rounded-tl-sm"}`}
        style={{
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="flex items-center mb-1 self-start w-full">
          <div
            className={`text-xs ${
              isUser ? "text-primary-foreground/70" : "text-muted-foreground"
            } font-sans`}
          >
            {isUser ? "You" : "Gemini"} · {formattedTime}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={message.content}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm whitespace-pre-wrap self-start w-full font-sans"
          >
            {message.content}
          </motion.div>
        </AnimatePresence>

        {/* Show video if available */}
        <AnimatePresence mode="wait">
          {message.videoUrl && !isUser && (
            <motion.div
              key={`video-${message.videoUrl}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 w-full"
              style={{
                maxWidth: "95%",
                overflow: "visible",
              }}
            >
              <VideoPlayer
                videoUrl={message.videoUrl}
                isLoading={isVideoLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show image if available and no video */}
        <AnimatePresence mode="wait">
          {!message.videoUrl && imageToDisplay && !isUser && onEditImage && (
            <motion.div
              key={`image-${imageToDisplay.substring(0, 20)}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 w-full"
              style={{
                maxWidth: "95%",
                overflow: "visible",
              }}
            >
              <ImageDisplay
                imageBase64={imageToDisplay}
                onEdit={onEditImage}
                onGenerateVideo={onGenerateVideo}
                onInstantAnimate={onInstantAnimate}
                isLoading={isLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
