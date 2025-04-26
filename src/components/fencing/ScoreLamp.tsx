"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { ScoreLampType, ScoreLampText, PlayerSide, ScoreColor } from "@/types/fencing";

// アニメーション用のスタイル
const animationKeyframes = `
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
  
  @keyframes shine {
    0% {
      background-position-x: 400%;
    }
    50% {
      background-position-x: 0%;
    }
    100% {
      background-position-x: -400%;
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

  // 安定したキーを生成（タイムスタンプを使用しない）
  const stableKey = `${side}-${type}`;

  // シャイニーエフェクトのみを使用するため、Sparklesコンポーネントは削除

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
      const sideOffset = playerWidth * 0.00; // スコアランプの余白が欲しい場合は数値をつける。
      
      // シャイニーエフェクトのグラデーションを設定
      const getShinyBackground = () => {
        if (color === 'red') {
          return `linear-gradient(-45deg, #dc2626 50%, #ef4444 60%, #dc2626 70%)`; // 赤系
        } else if (color === 'green') {
          return `linear-gradient(-45deg, #16a34a 50%, #22c55e 60%, #16a34a 70%)`; // 緑系
        } else {
          return `linear-gradient(-45deg, #ffffff 50%, #f3f4f6 60%, #ffffff 70%)`; // 白系
        }
      };
      
      // 動的にプロパティを生成するためのオブジェクト
      const styleObj: React.CSSProperties = {
        ...triangleStyles[side],
        width: `${lampWidth}px`,
        height: `${lampHeight}px`,
        backgroundColor: color === 'red' ? '#dc2626' : color === 'green' ? '#16a34a' : '#ffffff',
        background: getShinyBackground(),
        backgroundSize: '800% 100%', // 背景サイズを大きくしてグラデーションの動きを強調
        position: 'absolute',
        bottom: `${bottomOffset}px`,
        zIndex: 4,
        boxShadow: color === 'red' 
          ? '0 0 15px 5px rgba(239, 68, 68, 0.6)' // 赤い光
          : color === 'green' 
            ? '0 0 15px 5px rgba(34, 197, 94, 0.6)' // 緑の光
            : '0 0 15px 5px rgba(255, 255, 255, 0.6)', // 白い光
      };
      
      // アニメーションを個別に設定
      if (isAnimating) {
        styleObj.animation = side === 'left' 
          ? 'slideInLeft 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards' 
          : 'slideInRight 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards';
        styleObj.animationFillMode = 'forwards';
      } else {
        styleObj.animation = 'shine 10s infinite linear';
      }
      
      // 左右の位置を動的に設定
      if (side === 'left') {
        styleObj.left = `${sideOffset}px`;
      } else {
        styleObj.right = `${sideOffset}px`;
      }
      
      return styleObj;
    }
    
    // シャイニーエフェクトのグラデーションを設定 - より強調したグラデーション
    const getShinyBackground = () => {
      if (color === 'red') {
        return `linear-gradient(-45deg, #b91c1c 30%, #ef4444 50%, #f87171 60%, #ef4444 70%, #b91c1c 90%)`; // 赤系強調
      } else if (color === 'green') {
        return `linear-gradient(-45deg, #15803d 30%, #22c55e 50%, #4ade80 60%, #22c55e 70%, #15803d 90%)`; // 緑系強調
      } else {
        return `linear-gradient(-45deg, #e5e7eb 30%, #ffffff 50%, #f8fafc 60%, #ffffff 70%, #e5e7eb 90%)`; // 白系強調
      }
    };
    
    // 動画プレイヤー要素が存在しない場合はフォールバックとして固定サイズを使用
    const styleObj: React.CSSProperties = {
      ...triangleStyles[side],
      width: '300px',
      height: '200px',
      backgroundColor: color === 'red' ? '#dc2626' : color === 'green' ? '#16a34a' : '#ffffff',
      background: getShinyBackground(),
      backgroundSize: '800% 100%', // 背景サイズを大きくしてグラデーションの動きを強調
      position: 'absolute',
      bottom: '80px',
      zIndex: 4,
      boxShadow: color === 'red' 
        ? '0 0 15px 5px rgba(239, 68, 68, 0.6)' // 赤い光
        : color === 'green' 
          ? '0 0 15px 5px rgba(34, 197, 94, 0.6)' // 緑の光
          : '0 0 15px 5px rgba(255, 255, 255, 0.6)', // 白い光
      filter: 'blur(0.5px)', // 全体に微妙なぼかし効果
      borderRadius: '4px' // 角を少し丸める
    };
    
    // アニメーションを個別に設定
    if (isAnimating) {
      styleObj.animation = side === 'left' 
        ? 'slideInLeft 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards' 
        : 'slideInRight 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards';
      styleObj.animationFillMode = 'forwards';
    } else {
      styleObj.animation = 'shine 10s infinite linear';
    }
    
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
      key={stableKey}
      className="absolute transform overflow-hidden"
      style={getScoreLampStyle()}
    >
      {/* シャイニーエフェクトはスタイルで適用されるため、ここでは何も表示しない */}
      <style jsx global>{animationKeyframes}</style>
      
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
