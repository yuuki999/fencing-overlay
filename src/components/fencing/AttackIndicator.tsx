"use client";

import { AttackSide } from "@/types/fencing";
import { cn } from "@/lib/utils";

interface AttackIndicatorProps {
  side: AttackSide;
  visible: boolean;
}

export function AttackIndicator({ side, visible }: AttackIndicatorProps) {
  // 左右の位置を計算
  const getPositionStyles = () => {
    if (side === "left") {
      return {
        left: "4rem",
        right: "auto",
        transform: "translateX(0)"
      };
    } else if (side === "right") {
      return {
        left: "auto",
        right: "4rem",
        transform: "translateX(0)"
      };
    } else {
      return {
        left: "50%",
        right: "auto",
        transform: "translateX(-50%)"
      };
    }
  };

  return (
    <div
      className={cn(
        "absolute top-4 h-24 w-48 bg-yellow-400 rounded-md z-10 flex flex-col items-center justify-center",
        visible ? "opacity-100" : "opacity-0 pointer-events-none",
        "transition-all duration-500 ease-in-out"
      )}
      style={{
        ...getPositionStyles(),
        transitionProperty: "opacity, left, right, transform"
      }}
    >
      <span className="text-black font-bold text-lg">priorite</span>
      <span 
        className="text-black font-bold text-4xl" 
        style={{ fontFamily: "\"Hiragino Mincho ProN\", \"Yu Mincho\", \"MS PMincho\", serif" }}
      >優先権</span>
    </div>
  );
}
