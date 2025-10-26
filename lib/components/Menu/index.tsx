import { Button } from "@/components/ui/button";

interface MenuPageProps {
  setBasePipeGap: (value: number) => void;
  setIsPlaying: (value: boolean) => void;
  setMenuOpen: (value: boolean) => void;
}

export default function MenuPage({
  setBasePipeGap,
  setIsPlaying,
  setMenuOpen,
}: MenuPageProps) {
  function handleStartGame() {
    setIsPlaying(true);
    setMenuOpen(false);
  }
  function handleEasy() {
    setBasePipeGap(150);
    handleStartGame();
  }
  function handleNormal() {
    setBasePipeGap(100);
    handleStartGame();
  }
  function handleHard() {
    setBasePipeGap(80);
    handleStartGame();
  }

  return (
    <div className="z-999 h-screen w-full flex justify-center items-center ">
      <div className="animate-[fadeIn_0.15s_ease-in] h-3/4 w-3/4 bg-white border-4 border-[#e67104] rounded-4xl">
        <div className="h-full w-full flex items-center flex-col">
          <div className=" text-[#ff7b00] flex-col border-b-2 border-[#e67104] flex items-center justify-center h-1/4 w-full font-bold font-mono">
            <h1 className="text-6xl text-center pt-10">!Ascent</h1>
            <h1 className="text-2xl text-center pt-4"> Falling Game</h1>
          </div>
          <div className=" text-[#ff7b00] h-1/4 w-full border-b-2 border-[#e67104] font-bold font-mono">
            <h1 className="text-xl text-center pt-4">
              Quick falling game made with next.js for week 4 of{" "}
              <a
                className="font-black cursor-pointer"
                href="https://siege.hackclub.com"
                target="_blank"
              >
                siege
              </a>
            </h1>
            <h1 className="text-2xl text-center pt-4">Controls:</h1>
            <div className="flex flex-row items-center justify-center">
              <h1 className="text-xl text-center pt-2 pr-5 border-r-2 border-[#e67104]">
                A - Move Left
              </h1>
              <h1 className="text-xl text-center pt-2 pl-5 border-l-2 border-[#e67104]">
                D - Move Right
              </h1>
            </div>
            <h1 className="text-2xl text-center pt-4">Powerups:</h1>
            <div className="flex flex-row items-center justify-center ">
              <h1 className=" border-r-2 px-5 border-[#e67104] text-xl text-center pt-2">
                Hole - Widens gap between pipes
              </h1>
              <h1 className=" border-r-2 px-5 border-l-2 border-[#e67104] text-xl text-center pt-2">
                Turtle - Slow down
              </h1>
              <h1 className="text-xl px-5 border-r-2 border-l-2 border-[#e67104] text-center pt-2">
                {" "}
                Shield - 1up!
              </h1>
              <h1 className="text-xl px-5 border-l-2 border-[#e67104] text-center pt-2">
                Star - +10 points
              </h1>
            </div>
          </div>
          <div className="items-center flex flex-col justfy-center text-mono font-bold gap-30 text-[#ff7b00]">
            <h1 className="text-2xl text-center pt-10">Choose Difficulty:</h1>
            <div className="flex-row gap-30 flex justify-center items-center">
              <Button size="lg" variant="outline" onClick={handleEasy}>
                Easy
              </Button>
              <Button size="lg" variant="outline" onClick={handleNormal}>
                Normal
              </Button>
              <Button size="lg" variant="outline" onClick={handleHard}>
                Hard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
