"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// 画像ギャラリーページ
export default function ScoreImagesPage() {
  const [images, setImages] = useState<string[]>([]);

  // 画像一覧を取得
  useEffect(() => {
    // 画像ファイル名のパターンを定義
    const imagePatterns = [
      // 攻撃系
      'attaque-left.png',
      'attaque-right.png',
      'attaque-non-valable-left.png',
      'attaque-non-valable-right.png',
      // 防御系
      'riposte-left.png',
      'riposte-right.png',
      'riposte-non-valable-left.png',
      'riposte-non-valable-right.png',
      // 反撃系
      'contre-attaque-left.png',
      'contre-attaque-right.png',
      'contre-attaque-non-valable-left.png',
      'contre-attaque-non-valable-right.png',
    ];

    // 画像パスの配列を作成
    const imagePaths = imagePatterns.map(pattern => `/score_images/${pattern}`);
    setImages(imagePaths);
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">スコア画像ギャラリー</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((imagePath, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-md">
            <h2 className="text-lg font-semibold mb-2">{getImageTitle(imagePath)}</h2>
            <div className="relative w-full h-64">
              <Image
                src={`${imagePath}?v=${Date.now()}`}
                alt={getImageTitle(imagePath)}
                fill
                style={{ objectFit: 'contain' }}
                unoptimized
              />
            </div>
            <p className="mt-2 text-sm text-gray-600">{imagePath}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 画像タイトルを取得する関数
function getImageTitle(imagePath: string): string {
  const filename = imagePath.split('/').pop() || '';
  
  // ファイル名からタイプと側を抽出
  let title = '';
  
  if (filename.includes('attaque')) {
    title += '攻撃';
  } else if (filename.includes('riposte')) {
    title += '防御';
  } else if (filename.includes('contre-attaque')) {
    title += '反撃';
  }
  
  if (filename.includes('non-valable')) {
    title += '無効';
  } else {
    title += '成功';
  }
  
  if (filename.includes('-left')) {
    title += ' (左側)';
  } else if (filename.includes('-right')) {
    title += ' (右側)';
  }
  
  return title;
}
