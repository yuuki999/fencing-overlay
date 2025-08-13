"use client";

import { useEffect, useState, useRef } from "react";
import { ScoreLampType, PlayerSide, ScoreColor } from "@/types/fencing";
import Image from "next/image";

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

  @keyframes simpleGlow {
    0%, 100% {
      filter: drop-shadow(0 0 0px rgba(255, 255, 255, 0));
    }
    50% {
      filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.7));
    }
  }
`;

interface ScoreLampProps {
  type: ScoreLampType;
  color: ScoreColor; // colorは画像パスの生成には使用しないが、インターフェースの一貫性のために残す
  side: PlayerSide;
  active: boolean;
}

export function ScoreLamp({ type, side, active }: ScoreLampProps) {
  // ランプの表示状態
  const [isVisible, setIsVisible] = useState(false);
  // アニメーション状態
  const [isAnimating, setIsAnimating] = useState(false);
  // キラキラエフェクト状態
  const [isGlowActive, setIsGlowActive] = useState(false);
  // 前回のアクティブ状態とタイプを保存
  const prevActiveRef = useRef(false);
  const prevTypeRef = useRef<ScoreLampType>(null);
  // タイマーID
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const glowTimerRef = useRef<NodeJS.Timeout | null>(null);
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
      setIsGlowActive(true);
      
      // 前回のタイマーをクリア
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (glowTimerRef.current) {
        clearTimeout(glowTimerRef.current);
      }
      
      // アニメーション終了後、アニメーション状態を解除
      timerRef.current = setTimeout(() => {
        setIsAnimating(false);
        timerRef.current = null;
      }, 1000);

      // 光るエフェクトは少し長く表示
      glowTimerRef.current = setTimeout(() => {
        setIsGlowActive(false);
        glowTimerRef.current = null;
      }, 2000);
    } else {
      // 非アクティブになった時
      setIsVisible(false);
      setIsAnimating(false);
      setIsGlowActive(false);
      
      // タイマーをクリア
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (glowTimerRef.current) {
        clearTimeout(glowTimerRef.current);
        glowTimerRef.current = null;
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
      if (glowTimerRef.current) {
        clearTimeout(glowTimerRef.current);
        glowTimerRef.current = null;
      }
    };
  }, [active, type]);

  // 表示されない場合は何も表示しない
  if (!isVisible || !type) return null;

  // 安定したキーを生成
  const stableKey = `${side}-${type}`;

  // スコアランプの画像パスを取得する関数
  const getScoreLampImagePath = () => {
    // typeに基づいて画像のプレフィックスを決定
    let prefix = '';
    if (type.includes('attack')) {
      prefix = 'attaque';
    } else if (type.includes('defense')) {
      prefix = 'riposte';
    } else if (type.includes('counter')) {
      prefix = 'contre-attaque';
    }

    // 有効/無効の状態を決定
    const validity = type.includes('invalid') ? 'non-valable' : '';
    
    // パスを構築
    let imagePath = `/score_images/${prefix}`;
    if (validity) {
      imagePath += `-${validity}`;
    }
    imagePath += `-${side}.png`;
    
    return imagePath;
  };

  // 左側のQWEキー（攻撃、防御、反撃の成功）かどうかを判定
  const isLeftValidKey = () => {
    return side === 'left' && !type.includes('invalid');
  };

  // 動画プレイヤーのサイズに基づいたスコアランプのサイズと位置を計算
  const getScoreLampStyle = () => {
    // 動画プレイヤー要素が存在する場合
    if (videoPlayerRef.current) {
      const playerRect = videoPlayerRef.current.getBoundingClientRect();
      const playerWidth = playerRect.width;
      const playerHeight = playerRect.height;
      
      // 動画プレイヤーのサイズに対するスコアランプのサイズ比率
      // QWE以外のキー（ASD、JKL、UIO）は大きく表示
      const lampWidthRatio = isLeftValidKey() ? 0.75 : 1.05; // 左側の成功キー以外は85%に拡大
      
      // スコアランプのサイズを計算
      const lampWidth = playerWidth * lampWidthRatio;
      
      // スコアランプの位置を計算 - 名前表示に被らないように上方に配置
      const bottomOffset = isLeftValidKey() ? playerHeight * -0.15 : playerHeight * -0.60; // 左側の成功キーは高く、それ以外は少し低めに
      
      // 左右の位置を計算
      const sideOffset = isLeftValidKey() ? 0 : -playerWidth * 0.1; // 左側の成功キー以外は少し外側にはみ出すように
      
      // 動的にプロパティを生成するためのオブジェクト
      const styleObj: React.CSSProperties = {
        position: 'absolute',
        bottom: `${bottomOffset}px`,
        zIndex: 4,
        width: `${lampWidth}px`,
        height: 'auto', // 画像の縦横比を維持
      };
      
      // アニメーションを個別に設定
      if (isAnimating) {
        styleObj.animation = side === 'left' 
          ? 'slideInLeft 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards' 
          : 'slideInRight 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards';
        styleObj.animationFillMode = 'forwards';
      }
      
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
      position: 'absolute',
      bottom: '40px',
      zIndex: 4,
      // QWE以外のキー（ASD、JKL、UIO）は大きく表示
      width: isLeftValidKey() ? '300px' : '350px',
      height: 'auto', // 画像の縦横比を維持
    };
    
    // アニメーションを個別に設定
    if (isAnimating) {
      styleObj.animation = side === 'left' 
        ? 'slideInLeft 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards' 
        : 'slideInRight 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards';
      styleObj.animationFillMode = 'forwards';
    }
    
    // 左右の位置を動的に設定
    if (side === 'left') {
      styleObj.left = '10px';
    } else {
      styleObj.right = '10px';
    }
    
    return styleObj;
  };

  // 光るエフェクト用のスタイル
  const getGlowStyle = (): React.CSSProperties => {
    return {
      animation: isGlowActive ? 'simpleGlow 1s ease-in-out 2' : 'none',
      filter: isGlowActive ? 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))' : 'none',
    };
  };

  // 画像のパスを取得
  const imagePath = getScoreLampImagePath();

  return (
    <div 
      key={stableKey}
      className="absolute transform overflow-hidden"
      style={getScoreLampStyle()}
    >
      {/* アニメーションのスタイル */}
      <style jsx global>{animationKeyframes}</style>
      
      {/* 画像を表示 */}
      <div style={getGlowStyle()}>
        <Image
          src={imagePath}
          alt={`${side} ${type} score lamp`}
          width={1000}
          height={600}
          className="w-full h-auto"
          priority
          unoptimized
        />
      </div>
    </div>
  );
}
