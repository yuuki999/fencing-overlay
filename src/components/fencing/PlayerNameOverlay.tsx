"use client";

import { useEffect, useRef, useState } from "react";
import { PlayerInfo } from "@/types/fencing";
import { cn } from "@/lib/utils";

interface PlayerNameOverlayProps {
  player: PlayerInfo;
  show: boolean;
}

export function PlayerNameOverlay({ player, show }: PlayerNameOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // showプロパティが変更されたときにアニメーションを制御
  useEffect(() => {
    if (show) {
      // 表示アニメーションを開始
      setIsVisible(true);
    } else {
      // 非表示アニメーションを開始
      setIsVisible(false);
    }
  }, [show]);

  // 選手の位置に基づいたスタイルを取得
  const getPositionStyles = () => {
    if (player.side === "left") {
      return {
        left: 0,
        transform: isVisible ? "translateX(0)" : "translateX(-100%)",
      };
    } else {
      return {
        right: 0,
        transform: isVisible ? "translateX(0)" : "translateX(100%)",
      };
    }
  };

  // アニメーションクラスを取得
  const getAnimationClasses = () => {
    const baseClasses = "absolute top-1/3 py-4 px-8 bg-black/70 backdrop-blur-md transition-transform duration-700 ease-in-out";
    
    if (player.side === "left") {
      return cn(
        baseClasses,
        "rounded-r-lg border-r-4 border-t-4 border-b-4 border-white/70",
        "text-left"
      );
    } else {
      return cn(
        baseClasses,
        "rounded-l-lg border-l-4 border-t-4 border-b-4 border-white/70",
        "text-right"
      );
    }
  };

  if (!player.showName) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={getAnimationClasses()}
      style={getPositionStyles()}
    >
      <h2 className="text-3xl font-bold text-white tracking-wider">
        {player.name}
      </h2>
    </div>
  );
}
