"use client";
import { Button } from "@/components/ui/button";
import Pipe from "@/lib/components/Pipe/pipe";
import { useEffect, useRef, useState } from "react";

type Pickup = {
  id: number;
  x: number;
  y: number;
  type: string;
};

export default function Main() {
  const [speed, setSpeed] = useState(3);
  const [velocity, setVelocity] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [position, setPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [PassedPipes, setPassedPipes] = useState(new Set());
  const [activeShield, setActiveShield] = useState(false);
  const [collectedPickups, setCollectedPickups] = useState(new Set());
  const shieldUsedRef = useRef(false);
  const shieldTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const passingPipeIdRef = useRef<number | null>(null);
  const types = ["shield", "slowdown", "gap", "+10score"];
  const [isSlowedDown, setIsSlowedDown] = useState<boolean>(false);
  const [isGapActive, setIsGapActive] = useState<boolean>(false);
  const [gamerandomness, setgamerandomness] = useState(() =>
    Math.floor(Math.random() * 10000),
  );
  const [coin] = useState(() =>
    typeof window !== "undefined" ? new Audio("/sounds/coin.mp3") : null,
  );

  const actualSpeed = isSlowedDown ? speed * 0.33 : speed;
  const pipegap = isGapActive ? 50 : 0;

  const playerSize = 28;
  const playerCenterY = 50;

  useEffect(() => {
    if (!isPlaying) {
      setSpeed(0);
    }
  }, [isPlaying]);

  function handleRestart() {
    setVelocity(0);
    setPosition(0);
    setSpeed(4);
    setScore(0);
    setPassedPipes(new Set());
    setCollectedPickups(new Set());
    setActiveShield(false);
    shieldUsedRef.current = false;
    passingPipeIdRef.current = null;
    setgamerandomness(Math.floor(Math.random() * 10000));
    if (shieldTimeoutRef.current) {
      clearTimeout(shieldTimeoutRef.current);
      shieldTimeoutRef.current = null;
    }
    setIsPlaying(true);
  }
  function checkScore() {
    const playerTop = playerCenterY - playerSize / 2;

    for (const pipe of pipes) {
      const pipeBottom = pipe.y + 48;
      if (pipeBottom < playerTop && !PassedPipes.has(pipe.id)) {
        setScore((prev) => prev + 1);
        setPassedPipes((prev) => new Set(prev).add(pipe.id));
      }
    }
  }

  function generatePipes(pipegap: number) {
    const pipes = [];
    const gap = 300;
    const cycleOffset = Math.floor(velocity / gap);

    for (let i = -2; i < 15; i++) {
      const absolutePipeNumber = cycleOffset + i;

      if (absolutePipeNumber < 1) {
        continue;
      }
      const Y = absolutePipeNumber * gap - velocity;

      const gapPosition = 100 + ((absolutePipeNumber * 97) % 150);
      const gapWidth = 100 + pipegap;
      const leftLength = gapPosition - 32;
      const rightLength = 300 + ((absolutePipeNumber * 131) % 150);

      pipes.push({
        id: absolutePipeNumber,
        y: Y,
        leftLength: leftLength,
        rightLength: rightLength,
        gapPosition: gapPosition,
        gapWidth: gapWidth,
      });
    }
    return pipes;
  }
  const pipes = generatePipes(pipegap);

  function generatePickups() {
    const pickuplist = [];
    const gap = 1200;
    const cycleOffset = Math.floor(velocity / gap);

    for (let i = 0; i < 10; i++) {
      const absolutePickupNumber = cycleOffset + i;
      const randomtype =
        types[(absolutePickupNumber * 7 + gamerandomness) % types.length];

      if (absolutePickupNumber < 1) {
        continue;
      }
      const Y = absolutePickupNumber * gap - velocity;

      const nearbyPipe = pipes.find((pipe) => Math.abs(pipe.y - Y) < 100);

      let X;
      if (nearbyPipe) {
        const gapCenter = nearbyPipe.gapPosition + 50;
        X =
          gapCenter + ((absolutePickupNumber * 113 + gamerandomness) % 60) - 30;
      } else {
        X = 150 + ((absolutePickupNumber * 113 + gamerandomness) % 200);
      }

      pickuplist.push({
        id: absolutePickupNumber,
        y: Y,
        x: X,
        type: randomtype,
      });
    }
    return pickuplist;
  }
  const pickupsGenerated = generatePickups();

  function checkPickupCollision() {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const containerCenter = containerWidth / 2;
    const playerCenterX = containerCenter + position;
    const playerTop = playerCenterY;

    for (const pickup of pickupsGenerated) {
      if (collectedPickups.has(pickup.id)) continue;

      const distance = Math.sqrt(
        Math.pow(playerCenterX - pickup.x, 2) +
          Math.pow(playerTop - pickup.y, 2),
      );

      const collisionDistance = playerSize / 2 + 15;

      if (distance < collisionDistance) {
        if (shieldTimeoutRef.current) {
          clearTimeout(shieldTimeoutRef.current);
        }

        setCollectedPickups((prev) => new Set(prev).add(pickup.id));
        coin?.play();
        if (pickup.type === "shield") {
          setActiveShield(true);
          shieldUsedRef.current = false;

          shieldTimeoutRef.current = setTimeout(() => {
            setActiveShield(false);
            shieldUsedRef.current = false;
            shieldTimeoutRef.current = null;
          }, 5000);
        } else if (pickup.type === "slowdown") {
          setIsSlowedDown(true);
          setTimeout(() => {
            setIsSlowedDown(false);
          }, 3500);
        } else if (pickup.type === "gap") {
          setIsGapActive(true);
          setTimeout(() => {
            setIsGapActive(false);
          }, 3500);
        } else if (pickup.type === "+10score") {
          setScore((prev) => prev + 10);
        }
      }
    }
  }

  //Scrolling uppppppp
  useEffect(() => {
    const id = setInterval(() => {
      setVelocity((prev) => prev + actualSpeed);
    }, 16);
    return () => clearInterval(id);
  }, [actualSpeed]);

  function handleKeyPress(event: globalThis.KeyboardEvent) {
    if (event.key === "ArrowLeft" || event.key === "a") {
      event.preventDefault();
      setPosition((prev) => Math.max(-300, prev - 3 * actualSpeed));
    } else if (event.key === "ArrowRight" || event.key === "d") {
      event.preventDefault();
      setPosition((prev) => Math.min(300, prev + 3 * actualSpeed));
    }
  }
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  });

  function CheckCollision() {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const containerCenter = containerWidth / 2;

    const playerCenterX = containerCenter + position;
    const playerLeft = playerCenterX - playerSize / 2;
    const playerRight = playerCenterX + playerSize / 2;
    const playerTop = playerCenterY - playerSize / 2;
    const playerBottom = playerCenterY + playerSize / 2;

    for (const pipe of pipes) {
      const pipeTop = pipe.y;
      const pipeBottom = pipe.y + 48;

      if (pipeTop <= playerBottom && pipeBottom >= playerTop) {
        const gapLeft = pipe.gapPosition;
        const gapRight = pipe.gapPosition + pipe.gapWidth;

        if (playerLeft < gapLeft || playerRight > gapRight) {
          if (activeShield && !shieldUsedRef.current) {
            shieldUsedRef.current = true;
            passingPipeIdRef.current = pipe.id;

            if (shieldTimeoutRef.current) {
              clearTimeout(shieldTimeoutRef.current);
            }

            shieldTimeoutRef.current = setTimeout(() => {
              setActiveShield(false);
              shieldUsedRef.current = false;
              shieldTimeoutRef.current = null;
            }, 500);
            return;
          }

          if (passingPipeIdRef.current === pipe.id) {
            return;
          }

          setIsPlaying(false);
          return;
        } else {
          if (passingPipeIdRef.current === pipe.id) {
            passingPipeIdRef.current = null;
          }
        }
      }
    }
  }
  useEffect(() => {
    if (isPlaying) {
      CheckCollision();
      checkScore();
      checkPickupCollision();
    }
  }, [velocity, position]);
  useEffect(() => {
    if (score >= 15) {
      setSpeed((prev) => prev + 0.1);
    }
  }, [score]);

  return (
    <div className="overflow-hidden min-h-screen min-w-full flex items-center justify-center gap-x-15">
      <div className="fixed inset-0 z-9999 flex items-center justify-center pointer-events-none">
        {!isPlaying && (
          <div className="animate-[fadeIn_0.15s_ease-in] pointer-events-auto flex items-center justify-center bg-cyan-200 border-4 border-[#ff7b00] rounded-xl p-6 max-w-md w-full mx-4">
            <p className="font-mono text-[#ff7b00] text-4xl md:text-6xl text-center">
              U died <br />
              <Button
                variant="outline"
                onClick={handleRestart}
                className="bg-cyan-200 mt-4"
              >
                Restart
              </Button>
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-row gap-x-15 relative left-35">
        <div className="flex-col min-h-screen p-2 w-160 border-6 gap-y-1 rounded-2xl border-[#e67104] bg-[#ff7b00]  flex justify-center">
          <div className="flex justify-center items-center text-3xl">
            <span className="font-mono font-bold text-white text-xl capitalize">
              !Ascent
            </span>
          </div>
          <div
            ref={containerRef}
            className="bg-cyan-200 flex-1 rounded-2xl overflow-hidden relative"
            style={{ height: "calc(100% - 50px)" }}
          >
            <div
              className={`absolute h-7 w-7 rounded-full flex items-center justify-center ${
                activeShield
                  ? "bg-blue-400 ring-4 ring-blue-300 animate-pulse-ring"
                  : "bg-[#ff7b00]"
              }`}
              style={{
                left: `calc(50% + ${position}px)`,
                top: `${playerCenterY}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              ^.^
            </div>
            {pickupsGenerated
              .filter((pickup) => !collectedPickups.has(pickup.id))
              .map((pickup) => {
                let emoji = "";
                if (pickup.type === "shield") {
                  emoji = "🛡️";
                } else if (pickup.type === "slowdown") {
                  emoji = "🐢";
                } else if (pickup.type === "gap") {
                  emoji = "🕳️";
                } else if (pickup.type === "+10score") {
                  emoji = "⭐";
                }

                return (
                  <div
                    key={pickup.id}
                    className="absolute bg-yellow-400 h-6 w-6 rounded-full border-2 border-yellow-600"
                    style={{
                      left: `${pickup.x}px`,
                      top: `${pickup.y}px`,
                    }}
                  >
                    {emoji}
                  </div>
                );
              })}
            {pipes.map((pipe) => (
              <div
                key={pipe.id}
                className="absolute w-full"
                style={{ top: `${pipe.y}px` }}
              >
                <div
                  className="absolute"
                  style={{
                    right: `calc(100% - ${pipe.gapPosition}px)`,
                    transformOrigin: "right center",
                  }}
                >
                  <div className="rotate-180">
                    <Pipe length={pipe.leftLength} />
                  </div>
                </div>

                <div
                  className="absolute"
                  style={{
                    left: `${pipe.gapPosition + pipe.gapWidth}px`,
                  }}
                >
                  <Pipe length={pipe.rightLength} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="font-mono flex flex-col h-50 w-50 justify-center items-center bg-cyan-200 border-4 border-[#ff7b00] rounded-xl p-4">
          <span className="text-2xl font-bold text-[#ff7b00]">Score:</span>
          <span className="text-4xl font-bold text-[#ff7b00]">{score}</span>
        </div>
      </div>
    </div>
  );
}
