"use client";

import React, { SVGProps, useState, useEffect } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "@/lib/utils";
import { X, Info, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

export interface BannerConfig {
  enabled: boolean;
  message: string;
  type?: "info" | "warning" | "success" | "error";
  dismissible?: boolean;
  hideOnScroll?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const bannerTypeStyles = {
  info: {
    bg: "bg-blue-500/20",
    border: "border-blue-500/30",
    text: "text-blue-200",
    icon: Info,
  },
  warning: {
    bg: "bg-yellow-500/20",
    border: "border-yellow-500/30",
    text: "text-yellow-200",
    icon: AlertTriangle,
  },
  success: {
    bg: "bg-green-500/20",
    border: "border-green-500/30",
    text: "text-green-200",
    icon: CheckCircle,
  },
  error: {
    bg: "bg-red-500/20",
    border: "border-red-500/30",
    text: "text-red-200",
    icon: AlertCircle,
  },
};

export const StickyBanner = ({
  className,
  children,
  hideOnScroll = false,
  config,
}: {
  className?: string;
  children?: React.ReactNode;
  hideOnScroll?: boolean;
  config?: BannerConfig;
}) => {
  const [open, setOpen] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const { scrollY } = useScroll();

  // Check localStorage for dismissed state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissedKey = `banner-${config?.message?.substring(0, 20)}`;
      const wasDismissed = localStorage.getItem(dismissedKey);
      if (wasDismissed === "true") {
        setDismissed(true);
      }
    }
  }, [config?.message]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (hideOnScroll && latest > 40) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  });

  const handleDismiss = () => {
    setDismissed(true);
    if (config && typeof window !== "undefined") {
      const dismissedKey = `banner-${config.message.substring(0, 20)}`;
      localStorage.setItem(dismissedKey, "true");
    }
  };

  // Use config if provided
  if (config && !dismissed) {
    if (!config.enabled) return null;

    const styles = bannerTypeStyles[config.type || "info"];
    const Icon = styles.icon;

    return (
      <motion.div
        className={cn(
          "sticky inset-x-0 top-0 z-50 flex min-h-14 w-full items-center justify-between px-4 py-3 backdrop-blur-lg border-b",
          styles.bg,
          styles.border,
          className,
        )}
        initial={{
          y: -100,
          opacity: 0,
        }}
        animate={{
          y: open ? 0 : -100,
          opacity: open ? 1 : 0,
        }}
        exit={{
          y: -100,
          opacity: 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        <div className="flex items-center gap-2 flex-1 justify-center">
          <Icon className={cn("h-5 w-5", styles.text)} />
          <p className={cn("text-sm font-medium", styles.text)}>
            {config.message}
          </p>
          {config.action && (
            <button
              onClick={config.action.onClick}
              className={cn(
                "ml-2 text-sm font-semibold underline hover:opacity-80 transition-opacity",
                styles.text,
              )}
            >
              {config.action.label}
            </button>
          )}
        </div>

        {config.dismissible !== false && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="cursor-pointer p-1 hover:opacity-70 transition-opacity"
            onClick={handleDismiss}
            aria-label="Fechar banner"
          >
            <X className={cn("h-5 w-5", styles.text)} />
          </motion.button>
        )}
      </motion.div>
    );
  }

  // Fallback for custom children
  if (dismissed || !children) return null;

  return (
    <motion.div
      className={cn(
        "sticky inset-x-0 top-0 z-40 flex min-h-14 w-full items-center justify-center bg-transparent px-4 py-1",
        className,
      )}
      initial={{
        y: -100,
        opacity: 0,
      }}
      animate={{
        y: open ? 0 : -100,
        opacity: open ? 1 : 0,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      {children}

      <motion.button
        initial={{
          scale: 0,
        }}
        animate={{
          scale: 1,
        }}
        className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <CloseIcon className="h-5 w-5 text-white" />
      </motion.button>
    </motion.div>
  );
};

const CloseIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </svg>
  );
};
