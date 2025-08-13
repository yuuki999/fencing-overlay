"use client";

import { AttackSide } from "@/types/fencing";
import { cn } from "@/lib/utils";

interface AttackIndicatorProps {
  side: AttackSide;
  visible: boolean;
}

export function AttackIndicator({ side, visible }: AttackIndicatorProps) {
  // 左右の位置を計算
  const getPositionX = () => {
    switch (side) {
      case "left":
        return "calc(15%)";
      case "right":
        return "calc(85%)";
      default:
        return "50%";
    }
  };

  return (
    <div
      className={cn(
        "absolute top-4 h-24 w-56 bg-yellow-400 rounded-md z-10 flex flex-col items-center justify-center",
        visible ? "opacity-100" : "opacity-0 pointer-events-none",
        "transition-all duration-500 ease-in-out"
      )}
      style={{
        left: getPositionX(),
        transform: "translateX(-50%)",
        transitionProperty: "opacity, left",
        transitionDuration: "500ms",
        transitionTimingFunction: "ease-in-out"
      }}
    >
      {/* 影なしバージョン */}
      <span className="text-white font-bold text-lg">PRIORITÉ</span>
      <span 
        className="text-white font-bold text-4xl" 
        style={{ fontFamily: "\"Hiragino Mincho ProN\", \"Yu Mincho\", \"MS PMincho\", serif" }}
      >優先権</span>
      
      {/* 影ありバージョン
      <span className="text-white font-bold text-lg" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}>PRIORITÉ</span>
      <span 
        className="text-white font-bold text-4xl" 
        style={{ 
          fontFamily: "\"Hiragino Mincho ProN\", \"Yu Mincho\", \"MS PMincho\", serif",
          textShadow: "2px 2px 3px rgba(0,0,0,0.8)"
        }}
      >優先権</span>
      */}
    </div>
  );
}
