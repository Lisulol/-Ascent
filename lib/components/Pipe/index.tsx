interface PipeProps {
  length?: number; // Length in pixels
}

export default function Pipe({ length = 200 }: PipeProps) {
  return (
    <div className="flex flex-row items-center">
      <div className="w-8 h-16 bg-[#5a5a5a] border-4 border-[#3a3a3a] rounded-l">
        <div className="w-1/2 h-full bg-[#6a6a6a] rounded-t-sm"></div>
      </div>

      <div
        className="h-12 bg-[#5a5a5a] border-y-4 border-r-4 border-[#3a3a3a]"
        style={{ width: `${length}px` }}
      ></div>
    </div>
  );
}
