"use client";

import { AttackSide } from "@/types/fencing";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface AttackIndicatorProps {
  side: AttackSide;
  visible: boolean;
  // 移動の進行状況を表す新しいプロパティ（0=端、1=中央）
  transitionState?: number;
}

export function AttackIndicator({ 
  side, 
  visible, 
  transitionState = 0 
}: AttackIndicatorProps) {
  // 透明度を計算・管理するための状態
  const [currentOpacity, setCurrentOpacity] = useState(1);
  
  // 左右の位置を計算
  const getPositionX = () => {
    // 移動中の位置を計算
    if (side === "left") {
      // 左端(15%)から中央(50%)に向かって移動
      return `calc(${15 + (transitionState * 10)}%)`;
    } else if (side === "right") {
      // 右端(85%)から中央(50%)に向かって移動
      return `calc(${85 - (transitionState * 10)}%)`;
    } else {
      return "50%";
    }
  };
  
  // transitionStateが変化したときに透明度を更新
  useEffect(() => {
    // 端に近いほど不透明(1)、中央に近いほど透明(0)
    const newOpacity = Math.max(0, 1 - transitionState);
    setCurrentOpacity(newOpacity);
  }, [transitionState]);

  return (
    <div
      className={cn(
        "absolute top-4 h-24 w-48 bg-yellow-400 rounded-md z-10 flex flex-col items-center justify-center",
        !visible && "pointer-events-none",
        "transition-all duration-500 ease-in-out"
      )}
      style={{
        left: getPositionX(),
        opacity: visible ? currentOpacity : 0,
        transform: "translateX(-50%)",
        transitionProperty: "opacity, left",
        transitionDuration: "500ms",
        transitionTimingFunction: "ease-in-out"
      }}
    >
      <span className="text-black font-bold text-lg">priorité</span>
      <span 
        className="text-black font-bold text-4xl" 
        style={{ fontFamily: "\"Hiragino Mincho ProN\", \"Yu Mincho\", \"MS PMincho\", serif" }}
      >優先権</span>
    </div>
  );
}