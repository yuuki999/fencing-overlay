"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  AttackSide, 
  FencingState, 
  PlayerSide, 
  ScoreColor, 
  ScoreType, 
  SoundType 
} from "@/types/fencing";

interface FencingControllerProps {
  onStateChange: (state: FencingState) => void;
  onPlaySound: (sound: SoundType) => void;
  actionMode: boolean; // アクションモードの状態を受け取る
  setActionMode: React.Dispatch<React.SetStateAction<boolean>>; // アクションモードを設定する関数
}

export function FencingController({ 
  onStateChange, 
  onPlaySound,
  actionMode,
  setActionMode
}: FencingControllerProps) {
  // フェンシングの状態
  const [state, setState] = useState<FencingState>({
    attackIndicator: null,
    leftScore: {
      type: null,
      color: null,
      active: false,
    },
    rightScore: {
      type: null,
      color: null,
      active: false,
    },
  });

  // スコア表示のタイムアウトID
  const [scoreTimeouts, setScoreTimeouts] = useState<{
    left: NodeJS.Timeout | null;
    right: NodeJS.Timeout | null;
  }>({
    left: null,
    right: null,
  });

  // スコア表示を更新する関数
  const updateScore = useCallback((
    side: PlayerSide, 
    type: ScoreType, 
    color: ScoreColor
  ) => {
    setState(prev => {
      const newState = { ...prev };
      newState[`${side}Score`] = {
        type,
        color,
        active: true,
      };
      return newState;
    });

    // 既存のタイムアウトをクリア
    if (scoreTimeouts[side]) {
      clearTimeout(scoreTimeouts[side]!);
    }

    // 3秒後にスコア表示を非アクティブにするタイマーを設定
    const timeoutId = setTimeout(() => {
      setState(prev => {
        const newState = { ...prev };
        newState[`${side}Score`] = {
          ...newState[`${side}Score`],
          active: false,
        };
        return newState;
      });

      // タイムアウトIDをクリア
      setScoreTimeouts(prev => ({
        ...prev,
        [side]: null,
      }));
    }, 3000);

    // タイムアウトIDを保存
    setScoreTimeouts(prev => ({
      ...prev,
      [side]: timeoutId,
    }));
  }, [scoreTimeouts]);

  // 攻撃インジケータを更新する関数
  const updateAttackIndicator = useCallback((side: AttackSide) => {
    setState(prev => ({
      ...prev,
      attackIndicator: side,
    }));
  }, []);

  // キーボードイベントのハンドラ
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // アクションモードの切り替え（Alt+A）
    if (event.altKey && event.code === "KeyA") {
      setActionMode(prev => !prev);
      return;
    }
    
    // アクションモードが無効の場合は何もしない
    if (!actionMode) {
      return;
    }
    
    // イベントが既に処理されている場合は何もしない
    if (event.defaultPrevented) {
      return;
    }

    // フォーム要素にフォーカスがある場合は何もしない
    if (
      document.activeElement instanceof HTMLInputElement ||
      document.activeElement instanceof HTMLTextAreaElement ||
      document.activeElement instanceof HTMLSelectElement
    ) {
      return;
    }

    switch (event.code) {
      // 攻撃インジケータの制御
      case "ArrowLeft":
        updateAttackIndicator("left");
        break;
      case "ArrowRight":
        updateAttackIndicator("right");
        break;
      case "Escape":
        updateAttackIndicator(null);
        break;

      // 左側の選手のスコア
      case "KeyQ": // 左側選手の攻撃得点（赤）
        updateScore("left", "attack", "red");
        break;
      case "KeyW": // 左側選手の無効攻撃（白）
        updateScore("left", "attack", "white");
        break;

      // 右側の選手のスコア
      case "KeyU": // 右側選手の攻撃得点（緑）
        updateScore("right", "attack", "green");
        break;
      case "KeyI": // 右側選手の無効攻撃（白）
        updateScore("right", "attack", "white");
        break;

      // 効果音のみ再生
      case "Digit1": // 剣をはらう音
        onPlaySound("kakin");
        break;
      case "Digit2": // 空振り音
        onPlaySound("buon");
        break;
      case "Digit3": // 止まる足音
        onPlaySound("kyut");
        break;
      case "Digit4": // 剣がこすれる音
        onPlaySound("kashu");
        break;

      default:
        return;
    }

    // イベントが処理されたことをマーク
    event.preventDefault();
  }, [updateScore, updateAttackIndicator, onPlaySound, actionMode, setActionMode]);

  // キーボードイベントの登録と解除
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // 状態が変更されたときにコールバックを呼び出す
  useEffect(() => {
    onStateChange(state);
  }, [state, onStateChange]);

  // このコンポーネントは何も表示しない
  return null;
}
