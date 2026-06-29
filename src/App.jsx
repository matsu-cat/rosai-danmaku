import { useState, useCallback } from 'react';
import Game from './Game';

export default function App() {
  const [phase, setPhase] = useState('title'); // 'title' | 'playing' | 'gameover'
  const [score, setScore] = useState(0);
  const [gameKey, setGameKey] = useState(0);

  const handleStart = useCallback(() => {
    setScore(0);
    setPhase('playing');
  }, []);

  const handleGameOver = useCallback((seconds) => {
    setScore(seconds);
    setPhase('gameover');
  }, []);

  const handleRestart = useCallback(() => {
    setGameKey((k) => k + 1);
    setScore(0);
    setPhase('playing');
  }, []);

  return (
    <div style={styles.root}>
      <div style={styles.canvasWrapper}>
        {phase === 'playing' && (
          <Game key={gameKey} onGameOver={handleGameOver} />
        )}
        {phase !== 'playing' && (
          <div style={styles.placeholder} />
        )}

        {phase === 'title' && (
          <div style={styles.overlay}>
            <h1 style={styles.title}>労災用語<br />弾幕避けゲーム</h1>
            <p style={styles.subtitle}>マウスで自機を操作して弾を避けろ！</p>
            <button style={styles.btn} onClick={handleStart}>ゲームスタート</button>
          </div>
        )}

        {phase === 'gameover' && (
          <div style={styles.overlay}>
            <h2 style={styles.gameoverText}>GAME OVER</h2>
            <p style={styles.scoreText}>生存時間: <span style={styles.scoreNum}>{score}</span> 秒</p>
            {score >= 30 && <p style={styles.praise}>素晴らしい！労働者の鑑！</p>}
            {score >= 10 && score < 30 && <p style={styles.praise}>なかなかやるな！</p>}
            {score < 10 && <p style={styles.praise}>まだまだ修行が足りぬ…</p>}
            <button style={styles.btn} onClick={handleRestart}>リスタート</button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#050510',
  },
  canvasWrapper: {
    position: 'relative',
    width: 800,
    height: 600,
    border: '2px solid #334',
    borderRadius: 4,
    overflow: 'hidden',
    background: '#0a0a1a',
  },
  placeholder: {
    width: 800,
    height: 600,
    background: '#0a0a1a',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(0,0,0,0.82)',
    gap: 16,
  },
  title: {
    color: '#00ccff',
    fontSize: 42,
    textAlign: 'center',
    lineHeight: 1.3,
    textShadow: '0 0 20px #0088ff',
    margin: 0,
  },
  subtitle: {
    color: '#aabbcc',
    fontSize: 16,
    margin: 0,
  },
  gameoverText: {
    color: '#ff4444',
    fontSize: 56,
    textShadow: '0 0 24px #ff0000',
    margin: 0,
  },
  scoreText: {
    color: '#ffffff',
    fontSize: 22,
    margin: 0,
  },
  scoreNum: {
    color: '#ffdd00',
    fontWeight: 'bold',
    fontSize: 32,
  },
  praise: {
    color: '#aabbcc',
    fontSize: 15,
    margin: 0,
  },
  btn: {
    marginTop: 12,
    padding: '12px 36px',
    fontSize: 18,
    background: '#00aadd',
    color: '#ffffff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
};
