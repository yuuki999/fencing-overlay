"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface VideoPlayerProps {
  onVideoLoaded: () => void;
  overlayContent?: ReactNode; // オーバーレイコンテンツ用のスロット
}

export function VideoPlayer({ onVideoLoaded, overlayContent }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  };

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
            onLoadedData={() => onVideoLoaded()}
            controls
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
      </div>
      
      {/* コントロール部分 - ファイル選択のみ */}
      <Card className="rounded-t-none border-t-0">
        <div className="p-4">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="w-full"
          />
        </div>
      </Card>
    </div>
  );
}
