type AppIconProps = {
  label: string;
  icon: string;
  onClick: () => void;
};

export default function AppIcon({ label, icon, onClick }: AppIconProps) {
  return (
    <button
      className="flex flex-col items-center w-16 text-white text-xs hover:opacity-80"
      onClick={onClick}
    >
      <img src={icon} alt={label} className="w-10 h-10" />
      <span className="mt-1 text-shadow text-center">{label}</span>
    </button>
  );
}
