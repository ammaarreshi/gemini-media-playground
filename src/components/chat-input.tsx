import React, { useState, FormEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSubmit: (prompt: string, file?: File | null) => void;
  isLoading: boolean;
}

export function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  const [prompt, setPrompt] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
      setPrompt("");
    }
  };

  // Auto resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setPrompt(textarea.value);

    // Auto-resize logic if needed for multi-line text
    if (textarea.value === "") {
      textarea.style.height = "56px";
    } else {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center w-full max-w-[900px] mx-auto"
    >
      <div className="relative w-full flex items-center">
        <div
          className={`
            absolute inset-0 rounded-full 
            transition-all duration-300 ease-out
            ${
              isFocused
                ? "bg-primary/5 shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.05)]"
                : "bg-background/90 shadow-none"
            }
          `}
        />

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Describe an image to generate..."
          className="h-[56px] w-full px-6 pr-14 border border-border/70 bg-transparent rounded-full text-sm font-sans relative z-10
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-0 focus:border-primary/20 focus:shadow-none"
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />

        <Button
          type="submit"
          size="icon"
          variant="ghost"
          className="absolute right-4 top-[50%] -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground z-10
            transition-all duration-200"
          disabled={!prompt.trim() || isLoading}
        >
          <Send size={18} />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </form>
  );
}
