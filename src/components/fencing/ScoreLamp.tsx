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
      transform: translateX(-100%); /* 要素の幅分左に移動 */
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
      transform: translateX(100%); /* 要素の幅分右に移動 */
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
const triangleStyles: Record<PlayerSide, React.CSSProperties> = {
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
  // 動画プレイヤーの要素を参照するためのref
  const videoPlayerRef = useRef<HTMLDivElement | null>(null);

  // 動画プレイヤー要素を取得
  useEffect(() => {
    // 動画プレイヤーの要素を取得
    videoPlayerRef.current = document.querySelector('.aspect-video');
  }, []);

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
  const animationStyle: React.CSSProperties = isAnimating
    ? {
        animation: side === 'left'
          ? 'slideInLeft 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards'
          : 'slideInRight 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        animationFillMode: 'forwards' // アニメーション終了後も最終状態を維持
      }
    : {};

  // 一意のキーを生成（同じタイプでも毎回異なるキーになるようにタイムスタンプを使用）
  const uniqueKey = `${side}-${type}-${Date.now()}`;

  // キラキラエフェクト用のコンポーネント
  const Sparkles = () => {
    return (
      <>
        <style jsx global>{sparkleKeyframes}</style>
        {[...Array(20)].map((_, i) => { // エフェクト数を増やす
          const size = Math.random() * 15 + 8; // サイズを大きく
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
                boxShadow: '0 0 15px 3px rgba(255, 255, 255, 0.8)', // シャドウを強く
                animation: `sparkle ${duration}s ${delay}s infinite`,
                zIndex: 5
              }}
            />
          );
        })}
      </>
    );
  };

  // 動画プレイヤーのサイズに基づいたスコアランプのサイズと位置を計算
  const getScoreLampStyle = () => {
    // 動画プレイヤー要素が存在する場合
    if (videoPlayerRef.current) {
      const playerRect = videoPlayerRef.current.getBoundingClientRect();
      const playerWidth = playerRect.width;
      const playerHeight = playerRect.height;
      
      // 動画プレイヤーのサイズに対するスコアランプのサイズ比率
      const lampWidthRatio = 0.75; // 動画幅の75%に拡大
      const lampHeightRatio = 0.75; // 動画高さの75%に拡大
      
      // スコアランプのサイズを計算
      const lampWidth = playerWidth * lampWidthRatio;
      const lampHeight = playerHeight * lampHeightRatio;
      
      // スコアランプの位置を計算 - 名前表示に被らないように上方に配置
      const bottomOffset = playerHeight * 0.20; // 動画の下から20%の位置（名前表示はtop-1/3なので、それより上に配置）
      
      // 左右の位置を計算
      const sideOffset = playerWidth * 0.02; // 左右の余白を少し増やして動画幅の2%に
      
      // 動的にプロパティを生成するためのオブジェクト
      const styleObj: React.CSSProperties = {
        ...triangleStyles[side],
        width: `${lampWidth}px`,
        height: `${lampHeight}px`,
        backgroundColor: color === 'red' ? '#dc2626' : color === 'green' ? '#16a34a' : '#ffffff',
        position: 'absolute',
        bottom: `${bottomOffset}px`,
        zIndex: 4,
        ...animationStyle
      };
      
      // 左右の位置を動的に設定
      if (side === 'left') {
        styleObj.left = `${sideOffset}px`;
      } else {
        styleObj.right = `${sideOffset}px`;
      }
      
      return styleObj;
    }
    
    // 動画プレイヤー要素が存在しない場合はフォールバックとして固定サイズを使用
    const styleObj: React.CSSProperties = {
      ...triangleStyles[side],
      width: '300px',
      height: '200px',
      backgroundColor: color === 'red' ? '#dc2626' : color === 'green' ? '#16a34a' : '#ffffff',
      position: 'absolute',
      bottom: '80px',
      zIndex: 4,
      ...animationStyle
    };
    
    // 左右の位置を動的に設定
    if (side === 'left') {
      styleObj.left = '10px';
    } else {
      styleObj.right = '10px';
    }
    
    return styleObj;
  };

  return (
    <div 
      key={uniqueKey}
      className="absolute transform shadow-lg overflow-hidden"
      style={getScoreLampStyle()}
    >
      {/* キラキラエフェクト */}
      {isAnimating && <Sparkles />}
      
      {/* テキストコンテンツ */}
      <div className={cn(
        "relative z-10 h-full w-full flex flex-col justify-center",
        // 左側の場合は左寄せ、右側の場合は右寄せにする
        side === 'left' ? 'items-start pl-8' : 'items-end pr-8'
      )}>
        <div className={cn(
          "text-4xl font-bold", // フォントサイズを小さくしてルビの役割を明確に
          color === 'white' ? 'text-black' : 'text-white',
          side === 'left' ? 'text-left' : 'text-right' // 左右に合わせてテキストの配置を調整
        )}>
          {type && ScoreLampText[type]}
        </div>
        {/* 日本語テキスト - 明朝体 */}
        <div className={cn(
          "text-8xl font-bold mt-6", // フォントサイズをさらに大きく、マージンも調整
          color === 'white' ? 'text-black' : 'text-white',
          side === 'left' ? 'text-left' : 'text-right' // 左右に合わせてテキストの配置を調整
        )}
        style={{ fontFamily: "\"Hiragino Mincho ProN\", \"Yu Mincho\", \"MS PMincho\", serif" }}
        >
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
