"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { PlayerInfo } from "@/types/fencing";

interface AnimatedPlayerNameProps {
  player: PlayerInfo;
  show: boolean;
}

export function AnimatedPlayerName({ player, show }: AnimatedPlayerNameProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsAnimating(true);
      
      // アニメーション終了後、表示を維持するが、アニメーション状態は解除
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 800); // スライドインアニメーションの時間
      
      return () => clearTimeout(timer);
    } else {
      // 非表示にする前に、アニメーション状態を設定してフェードアウト
      if (isVisible) {
        setIsAnimating(true);
        const timer = setTimeout(() => {
          setIsVisible(false);
          setIsAnimating(false);
        }, 500); // フェードアウトの時間
        return () => clearTimeout(timer);
      }
    }
  }, [show, isVisible]);

  if (!isVisible) return null;

  // アニメーションクラスの決定
  const animationClass = isAnimating
    ? player.side === 'left'
      ? 'animate-slide-in-left'
      : 'animate-slide-in-right'
    : '';

  return (
    <div 
      className={cn(
        "absolute top-1/2 transform -translate-y-1/2 py-4 px-8",
        "bg-black/70 text-white rounded-md shadow-lg",
        "transition-opacity duration-500",
        animationClass,
        player.side === 'left' ? 'left-1/4 -translate-x-1/2' : 'right-1/4 translate-x-1/2',
        !show && isAnimating ? 'opacity-0' : 'opacity-100'
      )}
    >
      <div className="text-3xl font-bold">{player.name}</div>
    </div>
  );
}
