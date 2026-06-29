export const BULLET_TEXTS = [
  '時間外労働',
  'パワハラ',
  'サービス残業',
  '過労死',
  '長時間労働',
  'セクハラ',
  '未払い賃金',
  'ハラスメント',
  '休日出勤',
  '強制残業',
  'サービス早出',
  '精神的苦痛',
  '身体的苦痛',
  '退職強要',
  '不当解雇',
  'モラハラ',
  '職場いじめ',
  '賃金未払い',
  '過重労働',
  '労働基準法違反',
];

export const INITIAL_BULLET_SPEED = 2.5;
export const INITIAL_SPAWN_INTERVAL = 900; // ms
export const DIFFICULTY_INTERVAL = 5000; // ms per step
export const SPEED_INCREMENT = 0.4;
export const SPAWN_DECREMENT = 60; // ms
export const MIN_SPAWN_INTERVAL = 200; // ms

export const PLAYER_RADIUS = 8;
export const PLAYER_LERP = 0.09; // lower = smoother/slower follow
export const BULLET_FONT_SIZE = 15; // px
export const BULLET_PADDING = 6; // px around text for hitbox
