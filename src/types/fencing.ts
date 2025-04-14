export type AttackSide = 'left' | 'right' | null;

export type ScoreType = 'attack' | 'defense' | 'counter' | null;

export type ScoreColor = 'green' | 'red' | 'white' | null;

export type PlayerSide = 'left' | 'right';

export type SoundType = 'kakin' | 'buon' | 'kyut' | 'kashu';

export interface FencingState {
  attackIndicator: AttackSide;
  leftScore: {
    type: ScoreType;
    color: ScoreColor;
    active: boolean;
  };
  rightScore: {
    type: ScoreType;
    color: ScoreColor;
    active: boolean;
  };
}

export interface PlayerInfo {
  name: string;
  side: PlayerSide;
}
