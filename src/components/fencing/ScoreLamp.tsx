"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { ScoreLampType, ScoreLampText, PlayerSide, ScoreColor } from "@/types/fencing";

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

  // 背景色の決定
  const bgColorClass = color === 'red' 
    ? 'bg-red-600' 
    : color === 'green' 
      ? 'bg-green-600' 
      : 'bg-white text-black';

  // アニメーションクラスの決定
  const animationClass = isAnimating
    ? side === 'left'
      ? 'animate-slide-in-left'
      : 'animate-slide-in-right'
    : '';

  // ルビテキスト（キーボードショートカット）の決定
  let rubyText = '';
  if (side === 'left') {
    if (type === 'attack-valid') rubyText = 'Q';
    else if (type === 'attack-invalid') rubyText = 'A';
    else if (type === 'defense-valid') rubyText = 'W';
    else if (type === 'defense-invalid') rubyText = 'S';
    else if (type === 'counter-valid') rubyText = 'E';
    else if (type === 'counter-invalid') rubyText = 'D';
  } else {
    if (type === 'attack-valid') rubyText = 'U';
    else if (type === 'attack-invalid') rubyText = 'J';
    else if (type === 'defense-valid') rubyText = 'I';
    else if (type === 'defense-invalid') rubyText = 'K';
    else if (type === 'counter-valid') rubyText = 'O';
    else if (type === 'counter-invalid') rubyText = 'L';
  }

  // 一意のキーを生成（同じタイプでも毎回異なるキーになるようにタイムスタンプを使用）
  const uniqueKey = `${side}-${type}-${Date.now()}`;

  return (
    <div 
      key={uniqueKey}
      className={cn(
        "absolute top-1/3 transform -translate-y-1/2 py-3 px-6 rounded-md shadow-lg",
        bgColorClass,
        animationClass,
        side === 'left' ? 'left-8' : 'right-8'
      )}
    >
      <div className="text-center">
        <div className="text-xs font-mono mb-1">{rubyText}</div>
        <div className="text-xl font-semibold">{ScoreLampText[type]}</div>
      </div>
    </div>
  );
}
