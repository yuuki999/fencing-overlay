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
  const [playbackSpeed, setPlaybackSpeed] = useState<'normal' | 'slow' | 'verySlow'>('normal');
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

  // 再生速度の切り替え（3段階: 通常 → 0.5倍 → 0.25倍 → 通常）
  const cyclePlaybackSpeed = useCallback(() => {    
    if (videoRef.current) {
      let newSpeed: 'normal' | 'slow' | 'verySlow';
      let playbackRate: number;
      
      // 速度を循環
      switch (playbackSpeed) {
        case 'normal':
          newSpeed = 'slow';
          playbackRate = 0.5;
          break;
        case 'slow':
          newSpeed = 'verySlow';
          playbackRate = 0.25;
          break;
        case 'verySlow':
          newSpeed = 'normal';
          playbackRate = 1.0;
          break;
        default:
          newSpeed = 'normal';
          playbackRate = 1.0;
      }
      
      // ステート更新
      setPlaybackSpeed(newSpeed);
      setIsMuted(newSpeed !== 'normal');
      
      // DOM要素を直接操作
      try {
        videoRef.current.playbackRate = playbackRate;
        videoRef.current.muted = newSpeed !== 'normal';
        videoRef.current.volume = newSpeed !== 'normal' ? 0 : 1;
      } catch (error) {
        console.error('ビデオ設定エラー:', error);
      }
    } else {
      console.warn('videoRef.currentがnullです');
    }
  }, [playbackSpeed]);

  // 通常速度に即座に戻す
  const resetToNormalSpeed = useCallback(() => {
    if (videoRef.current) {
      setPlaybackSpeed('normal');
      setIsMuted(false);
      
      try {
        videoRef.current.playbackRate = 1.0;
        videoRef.current.muted = false;
        videoRef.current.volume = 1;
      } catch (error) {
        console.error('ビデオ設定エラー:', error);
      }
    }
  }, []);

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

    // Shift+Mで再生速度を循環切り替え
    if (e.key.toLowerCase() === 'm' && e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      cyclePlaybackSpeed();
    }
    // Shift+Nで通常速度に即座に戻す
    if (e.key.toLowerCase() === 'n' && e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      resetToNormalSpeed();
    }
  }, [cyclePlaybackSpeed, resetToNormalSpeed]);

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
            controls={playbackSpeed === 'normal'}
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
        
        {/* 再生速度インジケーター */}
        {playbackSpeed !== 'normal' && videoSrc && (
          <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-2 rounded-md text-sm font-bold opacity-90">
            {playbackSpeed === 'slow' ? '0.5倍速' : '0.25倍速'}
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
              onClick={cyclePlaybackSpeed}
              disabled={!videoSrc}
              variant={playbackSpeed !== 'normal' ? "destructive" : "secondary"}
              className={!videoSrc ? "opacity-50 cursor-not-allowed" : ""}
            >
              {playbackSpeed === 'normal' ? 'スロー再生' : 
               playbackSpeed === 'slow' ? '0.5倍速 → 0.25倍速' : 
               '0.25倍速 → 通常再生'}
            </Button>
            {playbackSpeed !== 'normal' && (
              <Button
                onClick={resetToNormalSpeed}
                disabled={!videoSrc}
                variant="outline"
                className={!videoSrc ? "opacity-50 cursor-not-allowed" : ""}
              >
                通常再生に戻す
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
