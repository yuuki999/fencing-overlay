"use client";

import { useEffect, useRef, useState } from "react";
import { PlayerInfo, ScoreColor } from "@/types/fencing";
import { cn } from "@/lib/utils";

interface PlayerScorePanelProps {
  player: PlayerInfo;
  scoreColor: ScoreColor;
  active: boolean;
  onPlayerNameChange?: (name: string) => void;
  editable?: boolean;
}

export function PlayerScorePanel({
  player,
  scoreColor,
  active,
  onPlayerNameChange,
  editable = false,
}: PlayerScorePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableName, setEditableName] = useState(player.name);
  const inputRef = useRef<HTMLInputElement>(null);

  // 選手名が変更されたときに状態を更新
  useEffect(() => {
    setEditableName(player.name);
  }, [player.name]);

  // スコアパネルの状態が変わったときにアニメーションをリセット
  useEffect(() => {
    const element = panelRef.current;
    if (!element) return;

    if (active) {
      // アニメーションのリセット
      element.style.animation = "none";
      // レイアウトの強制再計算（void演算子を使って式の結果を明示的に無視）
      void element.offsetHeight;
      element.style.animation = "";
    }
  }, [active, scoreColor]);

  // 編集モードが有効になったときに入力フィールドにフォーカス
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // スコアの色に基づいたボーダーカラーを取得
  const getBorderColor = (color: ScoreColor): string => {
    if (!active) return "border-gray-400";
    
    switch (color) {
      case "green":
        return "border-green-500";
      case "red":
        return "border-red-500";
      case "white":
        return "border-white";
      default:
        return "border-gray-400";
    }
  };

  // 編集を開始
  const startEditing = () => {
    if (editable) {
      setIsEditing(true);
    }
  };

  // 編集を完了
  const finishEditing = () => {
    setIsEditing(false);
    if (onPlayerNameChange && editableName !== player.name) {
      onPlayerNameChange(editableName);
    }
  };

  // キー入力ハンドラ
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // IME変換中の場合は処理をスキップ
    if (e.nativeEvent.isComposing) {
      return;
    }
    
    if (e.key === 'Enter') {
      finishEditing();
    } else if (e.key === 'Escape') {
      setEditableName(player.name);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={panelRef}
      className={cn(
        "p-3 rounded-md bg-black/50 backdrop-blur-sm",
        "border-4 transition-colors duration-300",
        getBorderColor(scoreColor),
        player.side === "left" ? "text-left" : "text-right"
      )}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editableName}
          onChange={(e) => setEditableName(e.target.value)}
          onBlur={finishEditing}
          onKeyDown={handleKeyDown}
          className={cn(
            "text-xl font-bold bg-transparent text-white w-full outline-none border-b border-white/30",
            player.side === "left" ? "text-left" : "text-right"
          )}
        />
      ) : (
        <div 
          className={cn(
            "text-xl font-bold text-white", 
            editable && "cursor-pointer hover:text-white/80"
          )}
          onClick={startEditing}
        >
          {player.name}
        </div>
      )}
    </div>
  );
}
