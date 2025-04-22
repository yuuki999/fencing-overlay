"use client";

import { useEffect, useRef } from "react";
import { SoundType } from "@/types/fencing";

interface SoundPlayerProps {
  soundToPlay: SoundType | null;
  onSoundPlayed: () => void;
}

export function SoundPlayer({ soundToPlay, onSoundPlayed }: SoundPlayerProps) {
  // 各効果音のオーディオ要素への参照
  const soundRefs = useRef<Record<SoundType, HTMLAudioElement | null>>({
    kakin: null,
    buon: null,
    kyut: null,
    kashu: null,
    score: null,
  });

  // コンポーネントのマウント時に効果音をプリロード
  useEffect(() => {
    // ブラウザ環境でのみ実行
    if (typeof window === "undefined") return;

    // 各効果音のAudioオブジェクトを作成
    const sounds: Record<SoundType, HTMLAudioElement> = {
      kakin: new Audio("/sounds/kakin.mp3"), // 剣をはらう音
      buon: new Audio("/sounds/buon.mp3"),   // 空振り音
      kyut: new Audio("/sounds/kyut.mp3"),   // 止まる足音
      kashu: new Audio("/sounds/kashu.mp3"), // 刀を鞘にしまう2チャイン
      score: new Audio("/sounds/文字表示の衝撃音3.mp3"), // スコアランプ表示時の効果音
    };

    // プリロード設定
    Object.entries(sounds).forEach(([key, audio]) => {
      audio.preload = "auto";
      soundRefs.current[key as SoundType] = audio;
    });

    // クリーンアップ関数
    return () => {
      Object.values(soundRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.src = "";
        }
      });
    };
  }, []);

  // 効果音を再生
  useEffect(() => {
    if (!soundToPlay) return;

    const audio = soundRefs.current[soundToPlay];
    if (audio) {
      // 再生中なら一度停止してから再生
      audio.pause();
      audio.currentTime = 0;
      
      // 再生
      const playPromise = audio.play();
      
      // 再生が完了したらコールバックを呼び出す
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // 再生成功
            audio.addEventListener("ended", onSoundPlayed, { once: true });
          })
          .catch((error) => {
            // 再生失敗（ユーザーインタラクションが必要な場合など）
            console.error("効果音の再生に失敗しました:", error);
            onSoundPlayed();
          });
      }
    } else {
      // オーディオ要素が見つからない場合はコールバックを呼び出す
      onSoundPlayed();
    }
  }, [soundToPlay, onSoundPlayed]);

  // このコンポーネントは何も表示しない
  return null;
}
