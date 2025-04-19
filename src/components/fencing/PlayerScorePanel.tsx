"use client";

import { useRef, useState, useEffect } from "react";
import { PlayerInfo } from "@/types/fencing";
import { cn } from "@/lib/utils";

interface PlayerScorePanelProps {
  player: PlayerInfo;
  onPlayerNameChange?: (name: string) => void;
  editable?: boolean;
  showName?: boolean; 
}

export function PlayerScorePanel({
  player,
  onPlayerNameChange,
  editable = false,
  showName = true, 
}: PlayerScorePanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableName, setEditableName] = useState(player.name);
  const inputRef = useRef<HTMLInputElement>(null);

  // 選手名が変更されたときに状態を更新
  useEffect(() => {
    setEditableName(player.name);
  }, [player.name]);

  // 編集モードが有効になったときに入力フィールドにフォーカス
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

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
      className={cn(
        "p-3 rounded-md backdrop-blur-sm bg-black/50",
        "border border-gray-600 transition-colors duration-300",
        player.side === "left" ? "text-left" : "text-right"
      )}
    >
      {showName && (
        isEditing ? (
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
        )
      )}
    </div>
  );
}
