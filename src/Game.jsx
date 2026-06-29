import { useEffect, useRef, useCallback } from 'react';
import {
  BULLET_TEXTS,
  INITIAL_BULLET_SPEED,
  INITIAL_SPAWN_INTERVAL,
  DIFFICULTY_INTERVAL,
  SPEED_INCREMENT,
  SPAWN_DECREMENT,
  MIN_SPAWN_INTERVAL,
  PLAYER_RADIUS,
  PLAYER_LERP,
  BULLET_FONT_SIZE,
  BULLET_PADDING,
} from './constants';

export default function Game({ onGameOver }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    player: { x: 0, y: 0, targetX: 0, targetY: 0 },
    bullets: [],
    startTime: null,
    lastSpawn: 0,
    spawnInterval: INITIAL_SPAWN_INTERVAL,
    bulletSpeed: INITIAL_BULLET_SPEED,
    lastDifficultyStep: 0,
    animId: null,
    running: true,
  });

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const s = stateRef.current;
    s.player.targetX = e.clientX - rect.left;
    s.player.targetY = e.clientY - rect.top;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const s = stateRef.current;

    // Initialize player to canvas center
    s.player.x = canvas.width / 2;
    s.player.y = canvas.height / 2;
    s.player.targetX = canvas.width / 2;
    s.player.targetY = canvas.height / 2;
    s.startTime = performance.now();
    s.lastSpawn = performance.now();
    s.lastDifficultyStep = performance.now();
    s.running = true;

    function spawnBullet(now) {
      const w = canvas.width;
      const h = canvas.height;
      const text = BULLET_TEXTS[Math.floor(Math.random() * BULLET_TEXTS.length)];

      // Pick a random edge: 0=top,1=right,2=bottom,3=left
      const edge = Math.floor(Math.random() * 4);
      let x, y;
      if (edge === 0) { x = Math.random() * w; y = -20; }
      else if (edge === 1) { x = w + 20; y = Math.random() * h; }
      else if (edge === 2) { x = Math.random() * w; y = h + 20; }
      else { x = -20; y = Math.random() * h; }

      // Aim roughly toward canvas center with some spread
      const targetX = w / 2 + (Math.random() - 0.5) * w * 0.6;
      const targetY = h / 2 + (Math.random() - 0.5) * h * 0.6;
      const dx = targetX - x;
      const dy = targetY - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = s.bulletSpeed * (0.8 + Math.random() * 0.4);

      s.bullets.push({
        x,
        y,
        vx: (dx / dist) * speed,
        vy: (dy / dist) * speed,
        text,
      });
    }

    function checkCollision(bullet) {
      const p = s.player;
      ctx.font = `bold ${BULLET_FONT_SIZE}px sans-serif`;
      const tw = ctx.measureText(bullet.text).width;
      const bx = bullet.x - tw / 2 - BULLET_PADDING;
      const by = bullet.y - BULLET_FONT_SIZE / 2 - BULLET_PADDING;
      const bw = tw + BULLET_PADDING * 2;
      const bh = BULLET_FONT_SIZE + BULLET_PADDING * 2;

      // AABB vs circle
      const nearX = Math.max(bx, Math.min(p.x, bx + bw));
      const nearY = Math.max(by, Math.min(p.y, by + bh));
      const distX = p.x - nearX;
      const distY = p.y - nearY;
      return distX * distX + distY * distY <= PLAYER_RADIUS * PLAYER_RADIUS;
    }

    function loop(now) {
      if (!s.running) return;

      const elapsed = (now - s.startTime) / 1000;

      // Difficulty ramp
      if (now - s.lastDifficultyStep >= DIFFICULTY_INTERVAL) {
        s.bulletSpeed += SPEED_INCREMENT;
        s.spawnInterval = Math.max(MIN_SPAWN_INTERVAL, s.spawnInterval - SPAWN_DECREMENT);
        s.lastDifficultyStep = now;
      }

      // Spawn
      if (now - s.lastSpawn >= s.spawnInterval) {
        spawnBullet(now);
        s.lastSpawn = now;
      }

      // Update player (lerp toward mouse)
      s.player.x += (s.player.targetX - s.player.x) * PLAYER_LERP;
      s.player.y += (s.player.targetY - s.player.y) * PLAYER_LERP;

      // Update bullets
      s.bullets = s.bullets.filter((b) => {
        b.x += b.vx;
        b.y += b.vy;
        const w = canvas.width;
        const h = canvas.height;
        return b.x > -200 && b.x < w + 200 && b.y > -200 && b.y < h + 200;
      });

      // Collision check
      for (const bullet of s.bullets) {
        if (checkCollision(bullet)) {
          s.running = false;
          cancelAnimationFrame(s.animId);
          onGameOver(Math.floor(elapsed));
          return;
        }
      }

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Bullets
      ctx.font = `bold ${BULLET_FONT_SIZE}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (const b of s.bullets) {
        ctx.fillStyle = '#ff4444';
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 8;
        ctx.fillText(b.text, b.x, b.y);
      }
      ctx.shadowBlur = 0;

      // Player
      ctx.beginPath();
      ctx.arc(s.player.x, s.player.y, PLAYER_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = '#00ccff';
      ctx.shadowColor = '#00aaff';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Score
      ctx.font = 'bold 20px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(`生存時間: ${Math.floor(elapsed)}秒`, 12, 12);

      s.animId = requestAnimationFrame(loop);
    }

    s.animId = requestAnimationFrame(loop);

    return () => {
      s.running = false;
      cancelAnimationFrame(s.animId);
    };
  }, [onGameOver]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      onMouseMove={handleMouseMove}
      style={{ display: 'block', cursor: 'none' }}
    />
  );
}
