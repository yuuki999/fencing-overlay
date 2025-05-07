"use client";

import { useState, useCallback, useEffect } from "react";
import { VideoPlayer } from "./VideoPlayer";
import { AttackIndicator } from "./AttackIndicator";
import { PlayerScorePanel } from "./PlayerScorePanel";
import { SoundPlayer } from "./SoundPlayer";
import { FencingController } from "./FencingController";
import { ScoreLamp } from "./ScoreLamp";
import { FencingState, PlayerInfo, SoundType, AttackSide } from "@/types/fencing";
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
  
  // 前回の優先権表示位置を記録
  const [prevAttackIndicator, setPrevAttackIndicator] = useState<AttackSide>(null);
  
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
  
  // 優先権表示が変更されたときに前回の状態を更新
  useEffect(() => {
    // attackIndicatorが変更され、かつnullでない場合に前回の状態を記録
    if (fencingState.attackIndicator !== null) {
      setPrevAttackIndicator(fencingState.attackIndicator);
    }
  }, [fencingState.attackIndicator]);

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

  // キーボードイベントハンドラ
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!actionMode) return;

    switch (e.key.toLowerCase()) {
      // 左側選手のスコアランプ
      case 'q': // 攻撃成功（赤）
        setFencingState(prev => ({
          ...prev,
          leftScore: {
            type: 'attack-valid',
            color: 'red',
            active: true
          },
          rightScore: {
            ...prev.rightScore,
            active: false,
            type: null
          }
        }));
        break;
      case 'a': // 攻撃無効（白）
        setFencingState(prev => ({
          ...prev,
          leftScore: {
            type: 'attack-invalid',
            color: 'white',
            active: true
          },
          rightScore: {
            ...prev.rightScore,
            active: false,
            type: null
          }
        }));
        break;
      case 'w': // 防御成功（赤）
        setFencingState(prev => ({
          ...prev,
          leftScore: {
            type: 'defense-valid',
            color: 'red',
            active: true
          },
          rightScore: {
            ...prev.rightScore,
            active: false,
            type: null
          }
        }));
        break;
      case 's': // 防御無効（白）
        setFencingState(prev => ({
          ...prev,
          leftScore: {
            type: 'defense-invalid',
            color: 'white',
            active: true
          },
          rightScore: {
            ...prev.rightScore,
            active: false,
            type: null
          }
        }));
        break;
      case 'e': // 反撃成功（赤）
        setFencingState(prev => ({
          ...prev,
          leftScore: {
            type: 'counter-valid',
            color: 'red',
            active: true
          },
          rightScore: {
            ...prev.rightScore,
            active: false,
            type: null
          }
        }));
        break;
      case 'd': // 反撃無効（白）
        setFencingState(prev => ({
          ...prev,
          leftScore: {
            type: 'counter-invalid',
            color: 'white',
            active: true
          },
          rightScore: {
            ...prev.rightScore,
            active: false,
            type: null
          }
        }));
        break;

      // 右側選手のスコアランプ
      case 'u': // 攻撃成功（緑）
        setFencingState(prev => ({
          ...prev,
          rightScore: {
            type: 'attack-valid',
            color: 'green',
            active: true
          },
          leftScore: {
            ...prev.leftScore,
            active: false,
            type: null
          }
        }));
        break;
      case 'j': // 攻撃無効（白）
        setFencingState(prev => ({
          ...prev,
          rightScore: {
            type: 'attack-invalid',
            color: 'white',
            active: true
          },
          leftScore: {
            ...prev.leftScore,
            active: false,
            type: null
          }
        }));
        break;
      case 'i': // 防御成功（緑）
        setFencingState(prev => ({
          ...prev,
          rightScore: {
            type: 'defense-valid',
            color: 'green',
            active: true
          },
          leftScore: {
            ...prev.leftScore,
            active: false,
            type: null
          }
        }));
        break;
      case 'k': // 防御無効（白）
        setFencingState(prev => ({
          ...prev,
          rightScore: {
            type: 'defense-invalid',
            color: 'white',
            active: true
          },
          leftScore: {
            ...prev.leftScore,
            active: false,
            type: null
          }
        }));
        break;
      case 'o': // 反撃成功（緑）
        setFencingState(prev => ({
          ...prev,
          rightScore: {
            type: 'counter-valid',
            color: 'green',
            active: true
          },
          leftScore: {
            ...prev.leftScore,
            active: false,
            type: null
          }
        }));
        break;
      case 'l': // 反撃無効（白）
        setFencingState(prev => ({
          ...prev,
          rightScore: {
            type: 'counter-invalid',
            color: 'white',
            active: true
          },
          leftScore: {
            ...prev.leftScore,
            active: false,
            type: null
          }
        }));
        break;

      // リセット
      case 'z':
        resetScoreLamps();
        break;
        
      // 選手名の表示/非表示切り替え
      case 'n': // 両方の選手名表示/非表示を同時に切り替え
        toggleBothPlayerNamesVisibility();
        break;
    }
  }, [actionMode, setFencingState, resetScoreLamps, toggleBothPlayerNamesVisibility]);

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
      
      {/* 操作説明 */}
      {showInstructions && (
        <Card className="p-4">
          <h2 className="text-lg font-bold mb-2">キーボードショートカット</h2>
          <div className="text-sm mb-4 text-yellow-600 dark:text-yellow-400 font-medium">
            ※ キーボード操作はアクションモードがONの時のみ有効です<br />
            ※ Alt+Aキーでアクションモードを切り替えることもできます
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">攻防表示</h3>
              <ul className="list-disc pl-5">
                <li>9キー: 左側に表示</li>
                <li>0キー: 右側に表示</li>
                <li>ESCキー: 非表示</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">効果音</h3>
              <ul className="list-disc pl-5">
                <li>1キー: 剣をはらう音(ｶｷｰﾝ)</li>
                <li>2キー: 空振り音(ﾌﾞｫﾝ)</li>
                <li>3キー: 止まる足音(ｷｭｯ)</li>
                <li>4キー: 剣がこすれる音(ｶｼｭ)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">左側選手のスコアランプ</h3>
              <ul className="list-disc pl-5">
                <li>Qキー: 攻撃成功（赤）</li>
                <li>Aキー: 攻撃無効（白）</li>
                <li>Wキー: 防御成功（赤）</li>
                <li>Sキー: 防御無効（白）</li>
                <li>Eキー: 反撃成功（赤）</li>
                <li>Dキー: 反撃無効（白）</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">右側選手のスコアランプ</h3>
              <ul className="list-disc pl-5">
                <li>Uキー: 攻撃成功（緑）</li>
                <li>Jキー: 攻撃無効（白）</li>
                <li>Iキー: 防御成功（緑）</li>
                <li>Kキー: 防御無効（白）</li>
                <li>Oキー: 反撃成功（緑）</li>
                <li>Lキー: 反撃無効（白）</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">再生コントロール</h3>
              <ul className="list-disc pl-5">
                <li>Shift+Mキー: スロー再生モード切替（0.25倍速）</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">選手名とスコアランプ</h3>
              <ul className="list-disc pl-5">
                <li>Nキー: 選手名表示切替</li>
                <li>Zキー: スコアランプをリセット</li>
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
              {/* 攻防表示 - 左右の優先権表示を個別に制御 */}
              {/* 左側の優先権表示 */}
              <AttackIndicator 
                side="left"
                visible={fencingState.attackIndicator === "left" || (fencingState.attackIndicator === "right" && prevAttackIndicator === "left")} 
                transitionState={fencingState.attackIndicator === "left" ? 0 : 1}
              />
              
              {/* 右側の優先権表示 */}
              <AttackIndicator 
                side="right"
                visible={fencingState.attackIndicator === "right" || (fencingState.attackIndicator === "left" && prevAttackIndicator === "right")} 
                transitionState={fencingState.attackIndicator === "right" ? 0 : 1}
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
