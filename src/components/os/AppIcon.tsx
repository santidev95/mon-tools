import React from "react";
import Image from "next/image";

interface AppIconProps {
  src: string;
  alt: string;
  size?: number;
  onClick?: () => void;
}

export default function AppIcon({ src, alt, size = 64, onClick }: AppIconProps) {
  return (
    <div 
      className={`w-${size} h-${size} cursor-pointer flex items-center justify-center`}
      onClick={onClick}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="hover:scale-105 transition-transform duration-200"
        priority={false}
        loading="lazy"
        quality={75}
      />
    </div>
  );
}
