import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 画像最適化を無効化（本番環境で画像を高速に表示するため）
    unoptimized: true,
    // 外部ドメインからの画像読み込み許可リスト
    remotePatterns: [],
  },
  // 本番環境でconsole文を自動削除する設定です。
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },
};

export default nextConfig;
