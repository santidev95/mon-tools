import { Rnd } from "react-rnd";

type OSWindowProps = {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    defaultSize?: { width: number; height: number }; // 💡 Novo
  };

export default function OSWindow({ title, children, onClose, defaultSize = { width: 400, height: 300 } }: OSWindowProps) {
  return (
    <Rnd
        default={{
            x: 100,
            y: 100,
            width: defaultSize?.width || 400,
            height: defaultSize?.height || 300,
        }}
        minWidth={300}
        minHeight={200}
        bounds="parent"
    >
      <div className="border-2 border-black bg-black shadow-md flex flex-col h-full">
        <div className="bg-purple-600 text-white px-2 py-1 flex justify-between items-center text-xs">
          <span>{title}</span>
          <button onClick={onClose} className="hover:bg-red-600 px-2">✖</button>
        </div>
        <div className="p-2 overflow-auto text-sm">{children}</div>
      </div>
    </Rnd>
  );
}
