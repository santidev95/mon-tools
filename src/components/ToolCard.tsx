import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  blank?: boolean;
  active?: boolean;
}

export default function ToolCard({
  title,
  description,
  href,
  active = true,
  blank = false,
}: ToolCardProps) {
  const baseClasses = clsx(
    "border rounded-xl p-4 transition duration-200 shadow group",
    {
      "bg-zinc-900 border-zinc-800 hover:border-purple-400": active,
      "bg-zinc-800 border-zinc-700 cursor-not-allowed opacity-50": !active,
    }
  );

  const content = (
    <>
      <div className="flex items-center gap-4 mb-2">
        <h3 className={clsx("text-lg font-bold", active ? "text-violet-400" : "text-gray-500")}>
          {title}
        </h3>
      </div>
      <p
        className={clsx(
          "text-sm transition",
          active ? "text-violet-300 group-hover:text-violet-200" : "text-gray-500"
        )}
      >
        {description}
      </p>
    </>
  );
  return active ? (
    <Link target={blank ? "_blank" : "_self"} href={href} className={baseClasses}>
      {content}
    </Link>
  ) : (
    <div className={baseClasses} aria-disabled="true">
      {content}
    </div>
  );
}
