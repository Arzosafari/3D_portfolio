import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { PALETTE } from './tokens3d';

/**
 * Procedural canvas textures — the studio keeps the payload light by drawing
 * every surface (glow, grid, interface wireframes, project artwork, monograms)
 * at runtime instead of shipping image assets.
 */

function createCanvas(size: number, height?: number) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = height ?? size;
  return canvas;
}

function toTexture(canvas: HTMLCanvasElement, srgb = true) {
  const texture = new THREE.CanvasTexture(canvas);
  if (srgb) texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

/** Radial glow sprite used for light blooms and floor pools. */
export function drawGlow(colorInner = 'rgba(163, 199, 248, .85)', colorOuter = 'rgba(163, 199, 248, 0)') {
  const canvas = createCanvas(256);
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(128, 128, 4, 128, 128, 126);
  gradient.addColorStop(0, colorInner);
  gradient.addColorStop(0.45, 'rgba(140, 184, 245, .28)');
  gradient.addColorStop(1, colorOuter);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  return canvas;
}

/** Fine architectural grid for floors and computational surfaces. */
export function drawGrid(options?: { size?: number; divisions?: number; line?: string; glowLine?: string }) {
  const size = options?.size ?? 512;
  const divisions = options?.divisions ?? 16;
  const canvas = createCanvas(size);
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, size, size);
  const step = size / divisions;
  ctx.lineWidth = 1;
  ctx.strokeStyle = options?.line ?? 'rgba(220, 228, 239, .16)';
  ctx.beginPath();
  for (let i = 0; i <= divisions; i += 1) {
    ctx.moveTo(i * step + 0.5, 0);
    ctx.lineTo(i * step + 0.5, size);
    ctx.moveTo(0, i * step + 0.5);
    ctx.lineTo(size, i * step + 0.5);
  }
  ctx.stroke();
  // Accent every fourth line for a technical drawing feel.
  ctx.strokeStyle = options?.glowLine ?? 'rgba(140, 184, 245, .3)';
  ctx.beginPath();
  for (let i = 0; i <= divisions; i += 4) {
    ctx.moveTo(i * step + 0.5, 0);
    ctx.lineTo(i * step + 0.5, size);
    ctx.moveTo(0, i * step + 0.5);
    ctx.lineTo(size, i * step + 0.5);
  }
  ctx.stroke();
  return canvas;
}

type InterfaceVariant = 'editorial' | 'dashboard' | 'store' | 'system';

/**
 * Abstract website wireframes — the studio's signature motif for
 * "digital interfaces" floating in space. Never a real screenshot.
 */
export function drawInterface(variant: InterfaceVariant) {
  const canvas = createCanvas(512, 640);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = 'rgba(9, 24, 46, .92)';
  ctx.fillRect(0, 0, 512, 640);

  // Top bar
  ctx.fillStyle = 'rgba(220, 228, 239, .8)';
  ctx.fillRect(36, 34, 84, 9);
  ctx.fillStyle = 'rgba(220, 228, 239, .3)';
  [300, 344, 388, 432].forEach((x) => ctx.fillRect(x, 34, 32, 7));

  ctx.strokeStyle = 'rgba(220, 228, 239, .14)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(36, 62);
  ctx.lineTo(476, 62);
  ctx.stroke();

  const ice = 'rgba(140, 184, 245, .85)';
  const silverSoft = 'rgba(220, 228, 239, .22)';
  const silverLine = 'rgba(220, 228, 239, .5)';

  if (variant === 'editorial') {
    ctx.fillStyle = silverLine;
    ctx.fillRect(36, 100, 300, 26);
    ctx.fillRect(36, 138, 220, 26);
    ctx.fillStyle = ice;
    ctx.fillRect(36, 186, 90, 8);
    ctx.fillStyle = silverSoft;
    for (let i = 0; i < 5; i += 1) ctx.fillRect(36, 214 + i * 20, 420 - (i % 2) * 60, 7);
    ctx.strokeStyle = 'rgba(220, 228, 239, .3)';
    ctx.strokeRect(36, 348, 440, 210);
    ctx.fillStyle = 'rgba(140, 184, 245, .16)';
    ctx.fillRect(36, 348, 440, 210);
    ctx.fillStyle = silverSoft;
    ctx.fillRect(60, 590, 130, 10);
    ctx.fillRect(214, 590, 130, 10);
  } else if (variant === 'dashboard') {
    ctx.fillStyle = silverSoft;
    ctx.fillRect(36, 96, 130, 130);
    ctx.fillRect(190, 96, 130, 130);
    ctx.fillRect(344, 96, 130, 130);
    ctx.strokeStyle = ice;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(48, 190);
    ctx.lineTo(72, 150);
    ctx.lineTo(96, 168);
    ctx.lineTo(124, 120);
    ctx.lineTo(150, 138);
    ctx.stroke();
    ctx.fillStyle = 'rgba(140, 184, 245, .5)';
    [206, 230, 254, 278, 302].forEach((x, i) => ctx.fillRect(x, 200 - (i % 3) * 26 - 30, 14, (i % 3) * 26 + 40));
    ctx.beginPath();
    ctx.arc(409, 161, 44, 0, Math.PI * 2);
    ctx.strokeStyle = silverLine;
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(409, 161, 44, -Math.PI / 2, Math.PI * 0.9);
    ctx.strokeStyle = ice;
    ctx.stroke();
    ctx.fillStyle = silverSoft;
    for (let i = 0; i < 6; i += 1) ctx.fillRect(36, 268 + i * 42, 440, 26);
    ctx.fillStyle = ice;
    ctx.fillRect(36, 268, 6, 26);
    ctx.fillRect(36, 352, 6, 26);
    ctx.fillStyle = silverLine;
    ctx.fillRect(36, 546, 150, 12);
  } else if (variant === 'store') {
    ctx.fillStyle = silverLine;
    ctx.fillRect(36, 96, 200, 18);
    ctx.fillStyle = silverSoft;
    for (let row = 0; row < 2; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        const x = 36 + col * 152;
        const y = 140 + row * 224;
        ctx.fillRect(x, y, 128, 150);
        ctx.fillStyle = row === 0 && col === 1 ? 'rgba(140, 184, 245, .35)' : silverSoft;
        ctx.fillRect(x, y + 162, 92, 8);
        ctx.fillRect(x, y + 180, 54, 8);
        ctx.fillStyle = silverSoft;
      }
    }
    ctx.fillStyle = ice;
    ctx.fillRect(36, 596, 120, 12);
  } else {
    // system: nodes and connections
    const nodes: Array<[number, number]> = [
      [110, 170], [256, 120], [400, 190], [170, 330], [330, 320], [256, 470], [110, 520], [410, 500],
    ];
    ctx.strokeStyle = 'rgba(140, 184, 245, .4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    nodes.forEach(([x, y], i) => {
      const [nx, ny] = nodes[(i + 1) % nodes.length];
      ctx.moveTo(x, y);
      ctx.lineTo(nx, ny);
      if (i % 2 === 0) {
        const [mx, my] = nodes[(i + 3) % nodes.length];
        ctx.moveTo(x, y);
        ctx.lineTo(mx, my);
      }
    });
    ctx.stroke();
    nodes.forEach(([x, y], i) => {
      ctx.beginPath();
      ctx.arc(x, y, i % 3 === 0 ? 12 : 7, 0, Math.PI * 2);
      ctx.fillStyle = i % 3 === 0 ? ice : silverLine;
      ctx.fill();
    });
    ctx.fillStyle = silverSoft;
    ctx.fillRect(36, 590, 190, 10);
  }

  // Corner marks — architectural drawing signature
  ctx.strokeStyle = 'rgba(140, 184, 245, .55)';
  ctx.lineWidth = 2;
  const mark = 18;
  [[20, 20, 1, 1], [492, 20, -1, 1], [20, 620, 1, -1], [492, 620, -1, -1]].forEach(([x, y, dx, dy]) => {
    ctx.beginPath();
    ctx.moveTo(x + dx * mark, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + dy * mark);
    ctx.stroke();
  });
  return canvas;
}

type ProjectArt = 'fashion' | 'health' | 'commerce';

/** Spatial artwork for the Work exhibition — echoes each concept's own palette. */
export function drawProjectArt(art: ProjectArt) {
  const canvas = createCanvas(512, 384);
  const ctx = canvas.getContext('2d')!;
  if (art === 'fashion') {
    const bg = ctx.createLinearGradient(0, 0, 512, 384);
    bg.addColorStop(0, '#101F38');
    bg.addColorStop(1, '#1A2C4C');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 384);
    ctx.fillStyle = 'rgba(220, 228, 239, .88)';
    ctx.fillRect(48, 62, 190, 20);
    ctx.fillRect(48, 94, 120, 20);
    ctx.fillStyle = 'rgba(140, 184, 245, .8)';
    ctx.fillRect(48, 132, 66, 7);
    // Draped figure abstraction
    ctx.strokeStyle = 'rgba(245, 247, 251, .8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(356, 84);
    ctx.bezierCurveTo(322, 140, 398, 176, 350, 240);
    ctx.bezierCurveTo(322, 280, 372, 306, 356, 330);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(356, 62, 17, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(220, 228, 239, .2)';
    for (let i = 0; i < 4; i += 1) ctx.fillRect(48, 180 + i * 34, 210 - i * 34, 8);
    ctx.strokeStyle = 'rgba(140, 184, 245, .5)';
    ctx.strokeRect(48, 322, 416, 1);
  } else if (art === 'health') {
    const bg = ctx.createLinearGradient(0, 0, 512, 384);
    bg.addColorStop(0, '#0C2440');
    bg.addColorStop(1, '#123B5C');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 384);
    ctx.strokeStyle = 'rgba(220, 228, 239, .55)';
    ctx.lineWidth = 1.5;
    [120, 92, 64].forEach((r) => {
      ctx.beginPath();
      ctx.arc(330, 190, r, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.fillStyle = 'rgba(140, 184, 245, .9)';
    ctx.beginPath();
    ctx.arc(330, 190, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(245, 247, 251, .9)';
    ctx.fillRect(48, 120, 160, 16);
    ctx.fillRect(48, 148, 108, 16);
    ctx.fillStyle = 'rgba(220, 228, 239, .25)';
    for (let i = 0; i < 3; i += 1) ctx.fillRect(48, 196 + i * 26, 180 - i * 30, 7);
    ctx.fillStyle = 'rgba(140, 184, 245, .35)';
    ctx.fillRect(48, 292, 150, 34);
    ctx.strokeStyle = 'rgba(220, 228, 239, .3)';
    ctx.strokeRect(48.5, 292.5, 150, 34);
  } else {
    const bg = ctx.createLinearGradient(0, 0, 512, 384);
    bg.addColorStop(0, '#12233F');
    bg.addColorStop(1, '#1B3050');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 384);
    ctx.fillStyle = 'rgba(245, 247, 251, .85)';
    ctx.fillRect(48, 56, 210, 18);
    // Shelf objects
    const objects: Array<[number, number, 'circle' | 'vase' | 'arc']> = [
      [96, 250, 'vase'], [232, 250, 'circle'], [368, 250, 'arc'],
    ];
    ctx.strokeStyle = 'rgba(220, 228, 239, .35)';
    ctx.lineWidth = 1.5;
    objects.forEach(([x, y, kind]) => {
      ctx.strokeRect(x - 56, y - 110, 112, 130);
      ctx.fillStyle = 'rgba(140, 184, 245, .28)';
      ctx.fillRect(x - 56, y - 110, 112, 130);
      ctx.fillStyle = 'rgba(245, 247, 251, .85)';
      if (kind === 'vase') {
        ctx.beginPath();
        ctx.moveTo(x - 20, y);
        ctx.bezierCurveTo(x - 34, y - 44, x - 10, y - 58, x - 12, y - 78);
        ctx.lineTo(x + 12, y - 78);
        ctx.bezierCurveTo(x + 10, y - 58, x + 34, y - 44, x + 20, y);
        ctx.closePath();
        ctx.fill();
      } else if (kind === 'circle') {
        ctx.beginPath();
        ctx.arc(x, y - 44, 30, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(x, y, 40, Math.PI, 0);
        ctx.fill();
      }
    });
    ctx.fillStyle = 'rgba(220, 228, 239, .3)';
    ctx.fillRect(48, 300, 416, 1);
    ctx.fillStyle = 'rgba(140, 184, 245, .8)';
    ctx.fillRect(48, 322, 90, 9);
  }
  return canvas;
}

/** Portrait monogram for team installations — derived from real member names only. */
export function drawMonogram(initials: string) {
  const canvas = createCanvas(384, 480);
  const ctx = canvas.getContext('2d')!;
  const bg = ctx.createLinearGradient(0, 0, 0, 480);
  bg.addColorStop(0, '#16324F');
  bg.addColorStop(1, '#0B1F3A');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 384, 480);
  ctx.strokeStyle = 'rgba(220, 228, 239, .2)';
  ctx.lineWidth = 1;
  for (let i = 1; i < 8; i += 1) {
    ctx.beginPath();
    ctx.moveTo(0, i * 60);
    ctx.lineTo(384, i * 60);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(192, 216, 96, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(140, 184, 245, .5)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = 'rgba(245, 247, 251, .92)';
  ctx.font = '600 88px "Space Grotesk Variable", "Inter Variable", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, 192, 222);
  ctx.fillStyle = 'rgba(140, 184, 245, .75)';
  ctx.fillRect(142, 356, 100, 4);
  return canvas;
}

/** React hook: memoized CanvasTexture with automatic disposal. */
export function useCanvasTexture(draw: () => HTMLCanvasElement, deps: unknown[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const texture = useMemo(() => toTexture(draw()), deps);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

export const INTERFACE_VARIANTS: InterfaceVariant[] = ['editorial', 'dashboard', 'store', 'system'];
export const PROJECT_ARTS: ProjectArt[] = ['fashion', 'health', 'commerce'];
export const GLOW_COLOR = PALETTE.ice;
