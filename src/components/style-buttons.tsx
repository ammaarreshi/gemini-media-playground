import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import {
  RefreshCw,
  Paintbrush,
  Wand2,
  Sparkles,
  Palette,
  Glasses,
  Stars,
  Zap,
  Camera,
  Layers,
  Brush,
  Sunset,
} from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface StyleSuggestion {
  name: string;
  style: string;
}

interface StyleButtonsProps {
  onApplyStyle: (style: string) => void;
  disabled?: boolean;
  dynamicSuggestions?: StyleSuggestion[] | null;
  isLoadingSuggestions?: boolean;
}

export function StyleButtons({
  onApplyStyle,
  disabled = false,
  dynamicSuggestions = null,
  isLoadingSuggestions = false,
}: StyleButtonsProps) {
  // Map of icons that we can use based on keywords in the suggestion names
  const iconMap: Record<string, React.ReactNode> = {
    refresh: <RefreshCw size={14} />,
    more: <RefreshCw size={14} />,
    style: <Paintbrush size={14} />,
    art: <Palette size={14} />,
    paint: <Brush size={14} />,
    cinematic: <Camera size={14} />,
    night: <Stars size={14} />,
    black: <Sunset size={14} />,
    white: <Sunset size={14} />,
    "9:16": <Layers size={14} />,
    animal: <Sparkles size={14} />,
    watercolor: <Brush size={14} />,
    add: <Sparkles size={14} />,
    text: <Layers size={14} />,
    pop: <Zap size={14} />,
    dream: <Stars size={14} />,
    neon: <Zap size={14} />,
    vintage: <Camera size={14} />,
    retro: <Camera size={14} />,
    default: <Stars size={14} />,
  };

  // Get an appropriate icon based on the suggestion name
  const getIconForSuggestion = (name: string): React.ReactNode => {
    const lowerName = name.toLowerCase();

    for (const [keyword, icon] of Object.entries(iconMap)) {
      if (lowerName.includes(keyword)) {
        return icon;
      }
    }

    return iconMap.default;
  };

  // Use dynamic suggestions if available, otherwise fall back to defaults
  const styles = dynamicSuggestions || [
    {
      name: "More",
      style:
        "Create more variations of this image keeping the same style and subject",
    },
    {
      name: "Add text",
      style:
        "Add a beautiful, elegant text caption or title to this image that describes the scene",
    },
    {
      name: "Watercolor",
      style:
        "Transform this image into a soft, dreamy watercolor painting style",
    },
    {
      name: "Cinematic",
      style:
        "Make this image look like a scene from a high-budget film with dramatic lighting",
    },
    {
      name: "Pop Art",
      style:
        "Transform this image into a vibrant, colorful pop art style with bold outlines",
    },
    {
      name: "Dreamy Haze",
      style:
        "Add a soft dreamy haze effect with gentle light leaks and pastel tones",
    },
  ];

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.07,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
      },
    },
  };

  // Animation variants for individual buttons
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Animation variants for skeleton loading
  const skeletonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: [0.5, 0.8, 0.5],
      scale: 1,
      transition: {
        opacity: {
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
          delay: i * 0.05,
        },
        scale: {
          duration: 0.3,
          ease: "easeOut",
        },
      },
    }),
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="w-full overflow-x-auto">
      <AnimatePresence mode="wait">
        {isLoadingSuggestions ? (
          <motion.div
            key="loading"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex gap-4 overflow-x-auto pb-1 justify-center"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                custom={index}
                variants={skeletonVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="h-9 rounded-full overflow-hidden flex-shrink-0"
              >
                <Skeleton className="w-40 h-9 rounded-full" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="buttons"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex gap-4 overflow-x-auto pb-1 justify-center"
          >
            {styles.map((item, index) => (
              <motion.div
                key={`${item.name}-${index}`}
                variants={buttonVariants}
                custom={index}
                className="flex-shrink-0"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 rounded-full text-xs h-9 whitespace-nowrap border border-border/30 bg-background/70 backdrop-blur-sm hover:bg-background/90 hover:shadow-md hover:translate-y-[-2px] transition-all cursor-pointer font-sans"
                  onClick={() => onApplyStyle(item.style)}
                  disabled={disabled}
                >
                  {item.name === "More" ? (
                    <RefreshCw size={14} />
                  ) : item.name === "Add text" ? (
                    <Layers size={14} />
                  ) : item.name === "Watercolor" ? (
                    <Brush size={14} />
                  ) : item.name === "Cinematic" ? (
                    <Camera size={14} />
                  ) : item.name === "Pop Art" ? (
                    <Zap size={14} />
                  ) : item.name === "Dreamy Haze" ? (
                    <Stars size={14} />
                  ) : dynamicSuggestions ? (
                    getIconForSuggestion(item.name)
                  ) : (
                    <Stars size={14} />
                  )}
                  <span className="font-sans">{item.name}</span>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
