import React from "react";
import Image from "next/image";

interface AppIconProps {
  label: string;
  icon: string;
  onClick: () => void;
}

export default function AppIcon({ label, icon, onClick }: AppIconProps) {
  return (
    <button
      className="flex flex-col items-center w-16 text-white text-xs hover:opacity-80"
      onClick={onClick}
    >
      <div className="w-10 h-10 relative">
        <Image
          src={icon}
          alt={label}
          fill
          className="object-contain"
          sizes="40px"
          quality={75}
          loading="lazy"
        />
      </div>
      <span className="mt-1 text-shadow text-center">{label}</span>
    </button>
  );
}
