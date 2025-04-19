export type AttackSide = 'left' | 'right' | null;

export type ScoreType = 'attack' | 'defense' | 'counter' | null;

export type ScoreColor = 'green' | 'red' | 'white' | null;

export type PlayerSide = 'left' | 'right';

export type SoundType = 'kakin' | 'buon' | 'kyut' | 'kashu';

// スコアランプの種類を定義
export type ScoreLampType = 
  | 'attack-valid'        // 攻撃成功
  | 'attack-invalid'      // 攻撃無効
  | 'defense-valid'       // 防御成功
  | 'defense-invalid'     // 防御無効
  | 'counter-valid'       // 反撃成功
  | 'counter-invalid'     // 反撃無効
  | null;

// スコアランプの表示テキスト
export const ScoreLampText: Record<Exclude<ScoreLampType, null>, string> = {
  'attack-valid': 'attaque',
  'attack-invalid': 'attaque-non valable',
  'defense-valid': 'riposte',
  'defense-invalid': 'riposte-non valable',
  'counter-valid': 'contre attaque',
  'counter-invalid': 'contre attaque-non valable',
};

export interface FencingState {
  attackIndicator: AttackSide;
  leftScore: {
    type: ScoreLampType;
    color: ScoreColor;
    active: boolean;
  };
  rightScore: {
    type: ScoreLampType;
    color: ScoreColor;
    active: boolean;
  };
}

export interface PlayerInfo {
  name: string;
  side: PlayerSide;
  showName?: boolean; // 名前の表示/非表示を制御するフラグ
}

// 選手名アニメーション表示用の設定
export interface PlayerNameAnimation {
  show: boolean;       // 表示/非表示
  animating: boolean;  // アニメーション中かどうか
}
