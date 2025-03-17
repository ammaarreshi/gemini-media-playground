import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  isLoading?: boolean;
}

export function VideoPlayer({ videoUrl, isLoading = false }: VideoPlayerProps) {
  // Function to download the video
  const handleDownload = () => {
    if (videoUrl) {
      const link = document.createElement("a");
      link.href = videoUrl;
      link.download = `animated-video-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 300,
        duration: 0.6,
      }}
      className="flex flex-col gap-4 w-full mx-auto"
      style={{ maxWidth: "100%" }}
    >
      <motion.div
        className="relative w-full overflow-hidden bg-muted/20"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        style={{
          maxHeight: "350px",
          borderRadius: "1rem",
          padding: "0.25rem",
          maxWidth: "100%",
          margin: "0 auto",
        }}
      >
        {isLoading ? (
          <div
            className="w-full h-[250px] flex items-center justify-center bg-muted/10"
            style={{
              borderRadius: "0.75rem",
              maxWidth: "100%",
            }}
          >
            <div className="flex flex-col items-center gap-4">
              <RefreshCw size={32} className="text-primary/60 animate-spin" />
              <p className="text-sm text-muted-foreground">
                Generating video... This may take a minute.
              </p>
            </div>
          </div>
        ) : (
          <video
            src={videoUrl}
            controls
            autoPlay
            loop
            className="w-full h-auto max-h-[350px] object-contain"
            style={{
              maxHeight: "350px",
              borderRadius: "0.75rem",
              display: "block",
              margin: "0 auto",
            }}
          />
        )}
      </motion.div>

      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full gap-1.5"
          onClick={handleDownload}
          disabled={isLoading}
        >
          <Download size={15} />
          <span>Download Video</span>
        </Button>
      </div>
    </motion.div>
  );
}
