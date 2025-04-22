"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { ScoreLampType, ScoreLampText, PlayerSide, ScoreColor } from "@/types/fencing";

// キラキラエフェクト用のスタイル
const sparkleKeyframes = `
  @keyframes sparkle {
    0%, 100% { opacity: 0; transform: scale(0); }
    50% { opacity: 1; transform: scale(1); }
  }
  
  @keyframes slideInLeft {
    0% {
      transform: translateX(-180px);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
    }
    40%,100% {
      opacity: 1;
    }
  }
  
  @keyframes slideInRight {
    0% {
      transform: translateX(180px);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
    }
    40%,100% {
      opacity: 1;
    }
  }
`;

// 三角形用のスタイル
const triangleStyles = {
  left: {
    borderStyle: 'solid',
    borderWidth: '0 0 0 0',
    clipPath: 'polygon(0% 0%, 0% 100%, 100% 50%)', // 左側は右向き三角形
  },
  right: {
    borderStyle: 'solid',
    borderWidth: '0 0 0 0',
    clipPath: 'polygon(0% 50%, 100% 0%, 100% 100%)', // 右側は左向き三角形
  }
};

interface ScoreLampProps {
  type: ScoreLampType;
  color: ScoreColor;
  side: PlayerSide;
  active: boolean;
}

export function ScoreLamp({ type, color, side, active }: ScoreLampProps) {
  // ランプの表示状態
  const [isVisible, setIsVisible] = useState(false);
  // アニメーション状態
  const [isAnimating, setIsAnimating] = useState(false);
  // 前回のアクティブ状態とタイプを保存
  const prevActiveRef = useRef(false);
  const prevTypeRef = useRef<ScoreLampType>(null);
  // タイマーID
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // アクティブ状態が変わったときの処理
  useEffect(() => {
    // アクティブになった時
    if (active && type) {
      // 表示状態とアニメーション状態を設定
      setIsVisible(true);
      setIsAnimating(true);
      
      // 前回のタイマーをクリア
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // アニメーション終了後、アニメーション状態を解除
      timerRef.current = setTimeout(() => {
        setIsAnimating(false);
        timerRef.current = null;
      }, 1000);
    } else {
      // 非アクティブになった時
      setIsVisible(false);
      setIsAnimating(false);
      
      // タイマーをクリア
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
    
    // 前回の状態を更新
    prevActiveRef.current = active;
    prevTypeRef.current = type;
    
    // クリーンアップ関数
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [active, type]);

  // 表示されない場合は何も表示しない
  if (!isVisible || !type) return null;

  // 背景色はスタイル属性で直接指定するため、ここでの定義は不要

  // アニメーションスタイルの決定
  const animationStyle = isAnimating
    ? {
        animation: side === 'left'
          ? 'slideInLeft 1s cubic-bezier(0.25, 1, 0.5, 1) forwards'
          : 'slideInRight 1s cubic-bezier(0.25, 1, 0.5, 1) forwards'
      }
    : {};

  // 一意のキーを生成（同じタイプでも毎回異なるキーになるようにタイムスタンプを使用）
  const uniqueKey = `${side}-${type}-${Date.now()}`;

  // キラキラエフェクト用のコンポーネント
  const Sparkles = () => {
    return (
      <>
        <style jsx global>{sparkleKeyframes}</style>
        {[...Array(10)].map((_, i) => {
          const size = Math.random() * 10 + 5;
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const delay = Math.random() * 2;
          const duration = Math.random() * 1 + 1;
          
          return (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${top}%`,
                left: `${left}%`,
                opacity: 0,
                boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.8)',
                animation: `sparkle ${duration}s ${delay}s infinite`,
                zIndex: 5
              }}
            />
          );
        })}
      </>
    );
  };

  return (
    <div 
      key={uniqueKey}
      className={cn(
        "absolute transform shadow-lg overflow-hidden",
        side === 'left' ? 'left-8' : 'right-8',
        "bottom-32" // 選手名の少し上に表示
      )}
      style={{
        ...triangleStyles[side],
        width: '280px',
        height: '180px',
        backgroundColor: color === 'red' ? '#dc2626' : color === 'green' ? '#16a34a' : '#ffffff',
        position: 'absolute',
        zIndex: 4,
        ...animationStyle
      }}
    >
      {/* キラキラエフェクト */}
      {isAnimating && <Sparkles />}
      
      {/* テキストコンテンツ */}
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center">
        <div className={cn(
          "text-2xl font-bold",
          color === 'white' ? 'text-black' : 'text-white'
        )}>
          {type && ScoreLampText[type]}
        </div>
        {/* 日本語テキスト */}
        <div className={cn(
          "text-3xl font-bold mt-2",
          color === 'white' ? 'text-black' : 'text-white'
        )}>
          {type && type.includes('attack') ? '攻撃' : 
           type && type.includes('defense') ? '防御' : 
           type && type.includes('counter') ? '反撃' : ''}
          {type && type.includes('valid') ? '成功' : 
           type && type.includes('invalid') ? '無効' : ''}
        </div>
      </div>
    </div>
  );
}
