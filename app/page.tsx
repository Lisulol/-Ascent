"use client";
import Pipe from "@/lib/components/Pipe/pipe";
import { use, useEffect, useState } from "react";

export default function Main() {
  const [speed] = useState(1);
  const [length, setLength] = useState(300);
  const [length1, setLength1] = useState(100);
  const [velocity, setVelocity] = useState(0);

  //Scrolling uppppppp
  useEffect(() => {
    const id = setInterval(() => {
      setVelocity((prev) => prev + speed * -1);
    }, 16);
    return () => clearInterval(id);
  });
  const generatePipes = () => {
    const pipes = [];
    const gap = 300;
    const start = -500;
  };

  return (
    <div className="overflow-hidden h-screen w-full flex items-center justify-center">
      <div className="flex-col h-screen p-2 w-3/6 border-6 gap-y-1 rounded-2xl border-green-600 bg-green-500 z-999 flex justify-center">
        <div className="flex justify-center items-center text-3xl ">
          <span className="font-bold text-white text-xl capitalize">
            !Ascent
          </span>
        </div>
        <div className=" bg-white border-[#dadada] border-7 rounded-2xl h-11/12 w-full flex">
          <div
            className="rotate-180 relative flex justify-end h-full w-full"
            style={{ top: `${velocity}px` }}
          >
            <Pipe length={length1}></Pipe>
          </div>
          <div>
            <div
              className="relative flex h-full w-full"
              style={{ top: `${velocity}px` }}
            >
              <Pipe length={length}></Pipe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
