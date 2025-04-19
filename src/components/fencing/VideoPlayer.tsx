"use client";

import { useRef, useState, useEffect, useCallback, ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
  onVideoLoaded: () => void;
  overlayContent?: ReactNode; // オーバーレイコンテンツ用のスロット
}

export function VideoPlayer({ onVideoLoaded, overlayContent }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isSlowMotion, setIsSlowMotion] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  };

  // ファイル選択ダイアログを開く
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // スロー再生モードの切り替え
  const toggleSlowMotion = useCallback(() => {    
    if (videoRef.current) {
      const newSlowMotion = !isSlowMotion;
      
      // まずステート更新
      setIsSlowMotion(newSlowMotion);
      setIsMuted(newSlowMotion);
      
      // 次にDOM要素を直接操作
      try {
        // 再生速度の設定
        videoRef.current.playbackRate = newSlowMotion ? 0.25 : 1.0;
        
        // ミュート設定
        videoRef.current.muted = newSlowMotion;
        
        // ボリューム設定
        videoRef.current.volume = newSlowMotion ? 0 : 1;
      } catch (error) {
        console.error('ビデオ設定エラー:', error);
      }
    } else {
      console.warn('videoRef.currentがnullです');
    }
  }, [isSlowMotion]);

  // キーボードイベントのハンドラ
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // フォーム要素にフォーカスがある場合は何もしない
    if (
      document.activeElement instanceof HTMLInputElement ||
      document.activeElement instanceof HTMLTextAreaElement ||
      document.activeElement instanceof HTMLSelectElement
    ) {
      return;
    }

    // 'M'キーでスロー再生モードを切り替え
    if (e.key.toLowerCase() === 'm' && e.shiftKey) {
      e.preventDefault(); // 先にpreventDefaultを実行
      e.stopPropagation(); // イベントの伝播を停止
      toggleSlowMotion();
    }
  }, [toggleSlowMotion]);

  // キーボードイベントリスナーの設定
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    // ビデオ要素が存在する場合はミュート状態を設定
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      // 強制的にミュート状態を適用
      if (isMuted) {
        videoRef.current.volume = 0;
      } else {
        videoRef.current.volume = 1;
      }
    }
  }, [isMuted, videoSrc]);

  useEffect(() => {
    // クリーンアップ関数
    return () => {
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [videoSrc]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* 動画プレーヤー部分 - オーバーレイが配置される */}
      <div className="relative aspect-video bg-black overflow-hidden rounded-t-lg">
        {videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            className="w-full h-full object-contain"
            onLoadedData={() => {
              // ビデオ読み込み時にスローモード状態に応じてミュートを設定
              if (videoRef.current) {
                videoRef.current.muted = isMuted;
                // 強制的にミュート状態を適用
                if (isMuted) {
                  videoRef.current.volume = 0;
                } else {
                  videoRef.current.volume = 1;
                }
              }
              onVideoLoaded();
            }}
            muted={isMuted}
            controls={!isSlowMotion}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            動画ファイルを選択してください
          </div>
        )}
        
        {/* オーバーレイコンテンツ */}
        {overlayContent && (
          <div className="absolute inset-0 pointer-events-none">
            {overlayContent}
          </div>
        )}
        
        {/* スロー再生モードインジケーター */}
        {isSlowMotion && videoSrc && (
          <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded-md text-sm font-bold opacity-80">
            スロー再生
          </div>
        )}
      </div>
      
      {/* コントロール部分 - ファイル選択ボタン */}
      <Card className="rounded-t-none border-t-0">
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button 
              onClick={openFileDialog}
              className="flex-1"
              variant="outline"
            >
              動画ファイルを選択
            </Button>
            <Button
              onClick={toggleSlowMotion}
              disabled={!videoSrc}
              variant={isSlowMotion ? "destructive" : "secondary"}
              className={!videoSrc ? "opacity-50 cursor-not-allowed" : ""}
            >
              {isSlowMotion ? "通常再生に戻す" : "スロー再生"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
