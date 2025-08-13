"use client";

import { useState, useCallback, useEffect } from "react";
import { VideoPlayer } from "./VideoPlayer";
import { AttackIndicator } from "./AttackIndicator";
import { PlayerScorePanel } from "./PlayerScorePanel";
import { SoundPlayer } from "./SoundPlayer";
import { FencingController } from "./FencingController";
import { ScoreLamp } from "./ScoreLamp";
import { FencingState, PlayerInfo, SoundType } from "@/types/fencing";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function FencingOverlay() {
  // 選手情報
  const [players, setPlayers] = useState<{
    left: PlayerInfo;
    right: PlayerInfo;
  }>({
    left: { name: "左側選手", side: "left", showName: false },
    right: { name: "右側選手", side: "right", showName: false },
  });
  
  // フェンシングの状態
  const [fencingState, setFencingState] = useState<FencingState>({
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
  
  // アクションモードの状態
  const [actionMode, setActionMode] = useState(false);
  
  // 再生する効果音
  const [soundToPlay, setSoundToPlay] = useState<SoundType | null>(null);
  
  // 操作説明の表示/非表示
  const [showInstructions, setShowInstructions] = useState(false);

  // 選手名を更新する関数
  const updatePlayerName = useCallback((side: "left" | "right", name: string) => {
    setPlayers(prev => ({
      ...prev,
      [side]: {
        ...prev[side],
        name,
      },
    }));
  }, []);

  // 両方の選手名の表示/非表示を同時に切り替える関数
  const toggleBothPlayerNamesVisibility = useCallback(() => {
    setPlayers(prev => {
      // 現在の表示状態を確認（両方表示されているかどうか）
      const bothVisible = prev.left.showName && prev.right.showName;
      
      // 両方表示されている場合は両方非表示に、それ以外は両方表示に
      return {
        left: {
          ...prev.left,
          showName: !bothVisible,
        },
        right: {
          ...prev.right,
          showName: !bothVisible,
        }
      };
    });
  }, []);

  // フェンシングの状態が変更されたときのハンドラ
  const handleStateChange = useCallback((newState: FencingState) => {
    setFencingState(newState);
  }, []);

  // 効果音を再生するハンドラ
  const handlePlaySound = useCallback((sound: SoundType) => {
    setSoundToPlay(sound);
  }, []);

  // 効果音の再生が完了したときのハンドラ
  const handleSoundPlayed = useCallback(() => {
    setSoundToPlay(null);
  }, []);

  // 動画が読み込まれたときのハンドラ
  const handleVideoLoaded = useCallback(() => {
  }, []);

  // スコアランプをリセットする関数
  const resetScoreLamps = useCallback(() => {
    setFencingState(prev => ({
      ...prev,
      leftScore: {
        ...prev.leftScore,
        active: false,
        type: null,
      },
      rightScore: {
        ...prev.rightScore,
        active: false,
        type: null,
      }
    }));
  }, []);

  // キーボードイベントハンドラ(リセット、選手名表示/非表示切り替えのみ)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!actionMode) return;

    switch (e.key.toLowerCase()) {
      // リセット
      case 'z':
        resetScoreLamps();
        break;
        
      // 選手名の表示/非表示切り替え
      case 'n': // 両方の選手名表示/非表示を同時に切り替え
        toggleBothPlayerNamesVisibility();
        break;
    }
  }, [actionMode, resetScoreLamps, toggleBothPlayerNamesVisibility]);

    // キーボードイベントリスナーの設定
    useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [handleKeyDown]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center">フェンシング動画オーバーレイシステム</h1>
      
      {/* 操作説明ボタン */}
      <div className="flex justify-end gap-4">
        <Button 
          variant={actionMode ? "destructive" : "default"}
          onClick={() => setActionMode(!actionMode)}
          className="flex items-center gap-2"
        >
          {actionMode ? (
            <>
              <span className="inline-block w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              アクションモード: ON
            </>
          ) : (
            <>
              <span className="inline-block w-3 h-3 bg-gray-400 rounded-full"></span>
              アクションモード: OFF
            </>
          )}
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setShowInstructions(!showInstructions)}
        >
          {showInstructions ? "操作説明を隠す" : "操作説明を表示"}
        </Button>
      </div>
      
      {/* Instructions */}
      {showInstructions && (
        <Card className="p-4">
          <h2 className="text-lg font-bold mb-2">Keyboard Shortcuts</h2>
          <div className="text-sm mb-4 text-yellow-600 dark:text-yellow-400 font-medium">
            ※ Keyboard controls are only active when Action Mode is ON<br />
            ※ You can also toggle Action Mode with Alt+A
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Priority Display</h3>
              <ul className="list-disc pl-5">
                <li>9 key: Display on left</li>
                <li>0 key: Display on right</li>
                <li>ESC key: Hide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Sound Effects</h3>
              <ul className="list-disc pl-5">
                <li>1 key: Blade clash sound</li>
                <li>2 key: Miss sound</li>
                <li>3 key: Stop footstep sound</li>
                <li>4 key: Blade scrape sound</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Left Fencer Score Lamps</h3>
              <ul className="list-disc pl-5">
                <li>Q key: Attack valid (Red)</li>
                <li>A key: Attack invalid (White)</li>
                <li>W key: Parry valid (Red)</li>
                <li>S key: Parry invalid (White)</li>
                <li>E key: Riposte valid (Red)</li>
                <li>D key: Riposte invalid (White)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Right Fencer Score Lamps</h3>
              <ul className="list-disc pl-5">
                <li>U key: Attack valid (Green)</li>
                <li>J key: Attack invalid (White)</li>
                <li>I key: Parry valid (Green)</li>
                <li>K key: Parry invalid (White)</li>
                <li>O key: Riposte valid (Green)</li>
                <li>L key: Riposte invalid (White)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Playback Control</h3>
              <ul className="list-disc pl-5">
                <li>Shift+M: Cycle speed (Normal→0.5x→0.25x)</li>
                <li>Shift+N: Reset to normal speed</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Names & Score Lamps</h3>
              <ul className="list-disc pl-5">
                <li>N key: Toggle fencer names</li>
                <li>Z key: Reset score lamps</li>
              </ul>
            </div>
          </div>
        </Card>
      )}
      
      {/* 動画プレーヤーとオーバーレイ */}
      <div className="relative">
        <VideoPlayer 
          onVideoLoaded={handleVideoLoaded}
          overlayContent={
            <>
              {/* 攻防表示 */}
              <AttackIndicator 
                side={fencingState.attackIndicator} 
                visible={fencingState.attackIndicator !== null} 
              />
              
              {/* スコアランプ表示 */}
              <ScoreLamp
                type={fencingState.leftScore.type}
                color={fencingState.leftScore.color}
                side="left"
                active={fencingState.leftScore.active}
              />
              <ScoreLamp
                type={fencingState.rightScore.type}
                color={fencingState.rightScore.color}
                side="right"
                active={fencingState.rightScore.active}
              />
              
              {/* 選手スコアパネル */}
              <div className="absolute bottom-16 left-4 right-4 flex justify-between pointer-events-auto">
                {players.left.showName && (
                  <div className="w-2/5">
                    <PlayerScorePanel 
                      player={players.left}
                      onPlayerNameChange={(name) => updatePlayerName("left", name)}
                      editable={true}
                      showName={true}
                    />
                  </div>
                )}
                {players.right.showName && (
                  <div className="w-2/5">
                    <PlayerScorePanel 
                      player={players.right}
                      onPlayerNameChange={(name) => updatePlayerName("right", name)}
                      editable={true}
                      showName={true}
                    />
                  </div>
                )}
              </div>
            </>
          }
        />
      </div>
      
      {/* 効果音プレーヤー（非表示） */}
      <SoundPlayer 
        soundToPlay={soundToPlay} 
        onSoundPlayed={handleSoundPlayed} 
      />
      
      {/* フェンシングコントローラー（非表示） */}
      <FencingController 
        onStateChange={handleStateChange}
        onPlaySound={handlePlaySound}
        actionMode={actionMode}
        setActionMode={setActionMode}
      />
    </div>
  );
}
