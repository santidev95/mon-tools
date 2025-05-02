import Link from "next/link";
import Image from "next/image";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
}

export default function ToolCard({ title, description, href }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="bg-zinc-900 border border-zinc-800 hover:border-purple-400 rounded-xl p-4 transition duration-200 shadow group"
    >
      <div className="flex items-center gap-4 mb-2">
        <h3 className="text-purple-400 text-lg font-bold">{title}</h3>
      </div>
      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition">
        {description}
      </p>
    </Link>
  );
}
