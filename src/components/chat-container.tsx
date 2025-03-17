import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessage, ChatMessageProps } from "./chat-message";
import { ThinkingAnimation } from "./thinking-animation";
import {
  Sparkles,
  Palette,
  Camera,
  Mountain,
  Coffee,
  HeartHandshake,
  Bone,
  Building2,
  Sunset,
} from "lucide-react";

interface ChatContainerProps {
  messages: ChatMessageProps["message"][];
  imageBase64: string | null;
  onEditImage: (prompt: string, imageBase64: string) => void;
  onGenerateVideo?: (prompt: string, imageBase64: string) => void;
  onInstantAnimate?: (imageBase64: string) => void;
  isLoading: boolean;
  onSelectSuggestion?: (prompt: string) => void;
  showPromptSuggestions?: boolean;
}

// Sample prompt suggestions
const promptSuggestions = [
  {
    icon: <Sparkles size={16} />,
    text: "Magical floating islands with waterfalls and rainbows",
  },
  {
    icon: <Building2 size={16} />,
    text: "Futuristic cyberpunk city at night with neon lights",
  },
  {
    icon: <Mountain size={16} />,
    text: "Majestic mountains with a lake reflecting the sunset",
  },
  {
    icon: <HeartHandshake size={16} />,
    text: "Cute cat astronaut floating in space",
  },
  {
    icon: <Coffee size={16} />,
    text: "Cozy coffee shop with rain falling outside the window",
  },
  {
    icon: <Sunset size={16} />,
    text: "Tropical beach at sunset with palm trees",
  },
];

export function ChatContainer({
  messages,
  imageBase64,
  onEditImage,
  onGenerateVideo,
  onInstantAnimate,
  isLoading,
  onSelectSuggestion,
  showPromptSuggestions = false,
}: ChatContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change or loading state changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSuggestionClick = (suggestion: string) => {
    if (onSelectSuggestion) {
      onSelectSuggestion(suggestion);
    }
  };

  // Render prompt suggestions
  const renderPromptSuggestions = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto mt-6 mb-6"
    >
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-md font-medium mb-3 font-sans"
      >
        Try these ideas:
      </motion.h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {promptSuggestions.map((suggestion, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.1 + index * 0.1, duration: 0.5 },
            }}
            whileHover={{
              scale: 1.02,
              backgroundColor: "rgba(0,0,0,0.05)",
            }}
            className="p-3 bg-background/70 rounded-lg backdrop-blur-sm border border-border/30 cursor-pointer flex items-center gap-2"
            onClick={() => handleSuggestionClick(suggestion.text)}
          >
            <div className="text-primary/90">{suggestion.icon}</div>
            <p className="text-sm text-left font-sans">{suggestion.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col p-4 h-[calc(100vh-140px)] overflow-y-auto pb-36 w-full max-w-4xl mx-auto"
    >
      {messages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center h-full text-center"
        >
          <h2 className="text-2xl font-medium mb-2 font-sans">
            Gemini Playground
          </h2>
          <p className="text-muted-foreground max-w-md mb-6 font-sans">
            Enter a prompt to generate images using Google's Gemini AI.
          </p>
          <div className="flex flex-col gap-2 max-w-md text-sm">
            <div className="p-3 bg-muted/30 rounded-lg backdrop-blur-sm">
              <p className="font-medium mb-1 font-sans">✨ Generate images</p>
              <p className="text-muted-foreground font-sans">
                "Create a futuristic city with flying cars and neon lights"
              </p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg backdrop-blur-sm">
              <p className="font-medium mb-1 font-sans">
                🖌️ Edit with style buttons
              </p>
              <p className="text-muted-foreground font-sans">
                After an image is generated, use the style buttons to transform
                it
              </p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg backdrop-blur-sm">
              <p className="font-medium mb-1 font-sans">
                🎬 Animate your images
              </p>
              <p className="text-muted-foreground font-sans">
                Turn any generated image into a video with the instant animate
                feature or customize your own animation
              </p>
            </div>
          </div>

          {/* Prompt Suggestions for empty state */}
          <div className="mt-8 w-full max-w-md">
            {renderPromptSuggestions()}
          </div>
        </motion.div>
      ) : (
        <>
          <AnimatePresence>
            {messages.map((message, index) => (
              <ChatMessage
                key={`${message.role}-${index}`}
                message={message}
                imageBase64={
                  index === messages.length - 1 &&
                  message.role === "assistant" &&
                  !message.imageData
                    ? imageBase64
                    : null
                }
                onEditImage={onEditImage}
                onGenerateVideo={onGenerateVideo}
                onInstantAnimate={onInstantAnimate}
                isLoading={isLoading}
              />
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="ml-2 mb-4"
              >
                <ThinkingAnimation />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Show prompt suggestions if showPromptSuggestions is true */}
          {showPromptSuggestions && !imageBase64 && renderPromptSuggestions()}
        </>
      )}
    </div>
  );
}
