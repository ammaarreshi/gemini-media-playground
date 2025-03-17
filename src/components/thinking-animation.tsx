import { motion } from "framer-motion";

export function ThinkingAnimation() {
  return (
    <div className="flex items-center p-4 max-w-fit bg-muted/30 rounded-xl">
      <div className="flex space-x-2 items-center">
        <span className="text-base font-medium font-sans">Thinking</span>
        <div className="flex space-x-1">
          <motion.span
            className="w-1.5 h-1.5 bg-primary rounded-full"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0 }}
          />
          <motion.span
            className="w-1.5 h-1.5 bg-primary rounded-full"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
          />
          <motion.span
            className="w-1.5 h-1.5 bg-primary rounded-full"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
    </div>
  );
}
