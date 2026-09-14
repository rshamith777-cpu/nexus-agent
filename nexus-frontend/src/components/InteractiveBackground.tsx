import React, { useEffect, useRef, useState } from 'react';
import { Layers, Sparkles, Image as ImageIcon, Box } from 'lucide-react';

export type BgMode = 'hybrid' | '3d-mesh' | 'image';

interface InteractiveBackgroundProps {
  initialMode?: BgMode;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  color: string;
}

interface PulsePacket {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
}

export const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({
  initialMode = 'hybrid',
}) => {
  const [mode, setMode] = useState<BgMode>(initialMode);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  // Track mouse movement for 3D parallax tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseRef.current.targetX = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      mouseRef.current.targetY = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 3D Canvas Render Loop
  useEffect(() => {
    if (mode === 'image') return; // Canvas paused when image-only

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate 3D Neural Nodes
    const NODE_COUNT = width < 768 ? 45 : 85;
    const nodes: Point3D[] = [];
    const colors = ['#38BDF8', '#2563EB', '#60A5FA', '#10B981', '#818CF8'];

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * 1400,
        y: (Math.random() - 0.5) * 900,
        z: Math.random() * 800 - 200,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2.2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Packets moving along connections
    const pulses: PulsePacket[] = [];
    for (let i = 0; i < 18; i++) {
      pulses.push({
        fromIdx: Math.floor(Math.random() * NODE_COUNT),
        toIdx: Math.floor(Math.random() * NODE_COUNT),
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.012,
      });
    }

    // Projection constants
    const focalLength = 480;
    let angleY = 0;
    let angleX = 0;

    const render = () => {
      // Smooth mouse follow
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      angleY = mouseRef.current.x * 0.35;
      angleX = -mouseRef.current.y * 0.25;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // 1. Draw 3D Perspective Grid at the bottom (Radar/Horizon Plane)
      const gridZStart = 100;
      const gridZEnd = 900;
      const gridStepZ = 60;
      const gridXRange = 1200;
      const gridStepX = 100;
      const gridGroundY = 280;

      ctx.save();
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.09)';

      // Longitudinal lines
      for (let gx = -gridXRange; gx <= gridXRange; gx += gridStepX) {
        let p1Z = gridZStart;
        let p2Z = gridZEnd;

        // Apply slight mouse rotation to grid
        const rotX1 = gx * Math.cos(angleY * 0.5) - p1Z * Math.sin(angleY * 0.5);
        const rotZ1 = gx * Math.sin(angleY * 0.5) + p1Z * Math.cos(angleY * 0.5);

        const rotX2 = gx * Math.cos(angleY * 0.5) - p2Z * Math.sin(angleY * 0.5);
        const rotZ2 = gx * Math.sin(angleY * 0.5) + p2Z * Math.cos(angleY * 0.5);

        const s1 = focalLength / (rotZ1 + focalLength);
        const s2 = focalLength / (rotZ2 + focalLength);

        if (s1 > 0 && s2 > 0) {
          ctx.beginPath();
          ctx.moveTo(cx + rotX1 * s1, cy + (gridGroundY + mouseRef.current.y * 50) * s1);
          ctx.lineTo(cx + rotX2 * s2, cy + (gridGroundY + mouseRef.current.y * 50) * s2);
          ctx.stroke();
        }
      }

      // Latitudinal lines
      for (let gz = gridZStart; gz <= gridZEnd; gz += gridStepZ) {
        const p1X = -gridXRange;
        const p2X = gridXRange;

        const rotX1 = p1X * Math.cos(angleY * 0.5) - gz * Math.sin(angleY * 0.5);
        const rotZ1 = p1X * Math.sin(angleY * 0.5) + gz * Math.cos(angleY * 0.5);

        const rotX2 = p2X * Math.cos(angleY * 0.5) - gz * Math.sin(angleY * 0.5);
        const rotZ2 = p2X * Math.sin(angleY * 0.5) + gz * Math.cos(angleY * 0.5);

        const s1 = focalLength / (rotZ1 + focalLength);
        const s2 = focalLength / (rotZ2 + focalLength);

        if (s1 > 0 && s2 > 0) {
          const alpha = (1 - (gz - gridZStart) / (gridZEnd - gridZStart)) * 0.14;
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(cx + rotX1 * s1, cy + (gridGroundY + mouseRef.current.y * 50) * s1);
          ctx.lineTo(cx + rotX2 * s2, cy + (gridGroundY + mouseRef.current.y * 50) * s2);
          ctx.stroke();
        }
      }
      ctx.restore();

      // 2. Update & Project 3D Nodes
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      const projected: { x: number; y: number; scale: number; alpha: number; orig: Point3D }[] = [];

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        n.z += n.vz;

        // Boundary bounce
        if (n.x < -700 || n.x > 700) n.vx *= -1;
        if (n.y < -450 || n.y > 450) n.vy *= -1;
        if (n.z < -200 || n.z > 600) n.vz *= -1;

        // 3D rotation
        // Rotate around Y
        const rx1 = n.x * cosY + n.z * sinY;
        const rz1 = -n.x * sinY + n.z * cosY;

        // Rotate around X
        const ry1 = n.y * cosX - rz1 * sinX;
        const rz2 = n.y * sinX + rz1 * cosX;

        const depth = rz2 + 500;
        if (depth <= 10) continue;

        const scale = focalLength / depth;
        const px = cx + rx1 * scale;
        const py = cy + ry1 * scale;
        const alpha = Math.min(1, Math.max(0.15, (1 - (rz2 + 200) / 800)));

        projected.push({ x: px, y: py, scale, alpha, orig: n });
      }

      // 3. Draw Connecting Neural Lines
      const maxDist = 135;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.22 * Math.min(p1.alpha, p2.alpha);
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // 4. Draw Moving Data Packets (Energy Pulses)
      for (let i = 0; i < pulses.length; i++) {
        const pulse = pulses[i];
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          pulse.progress = 0;
          pulse.fromIdx = Math.floor(Math.random() * projected.length);
          pulse.toIdx = Math.floor(Math.random() * projected.length);
        }

        const pFrom = projected[pulse.fromIdx];
        const pTo = projected[pulse.toIdx];

        if (pFrom && pTo) {
          const dx = pFrom.x - pTo.x;
          const dy = pFrom.y - pTo.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist * 1.5) {
            const curX = pFrom.x + (pTo.x - pFrom.x) * pulse.progress;
            const curY = pFrom.y + (pTo.y - pFrom.y) * pulse.progress;

            ctx.beginPath();
            ctx.arc(curX, curY, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#67E8F9';
            ctx.shadowColor = '#38BDF8';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // 5. Draw 3D Nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const r = Math.max(1.2, p.orig.radius * p.scale);

        // Halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.orig.color;
        ctx.globalAlpha = p.alpha * 0.18;
        ctx.fill();

        // Solid Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = p.orig.color;
        ctx.globalAlpha = p.alpha * 0.85;
        ctx.fill();

        ctx.globalAlpha = 1.0;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mode]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* 1. Cinematic Command Center Image Layer (Used in 'hybrid' and 'image' mode) */}
      {(mode === 'hybrid' || mode === 'image') && (
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/assets/mission_control_banner.jpg"
            alt="NEXUS Mission Control Atmosphere"
            className={`w-full h-full object-cover object-center transition-all duration-1000 ${
              mode === 'image' ? 'opacity-40 scale-100' : 'opacity-25 scale-105'
            }`}
          />
          {/* Subtle Cybernetic Scanlines */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(56, 189, 248, 0.4) 2px, rgba(56, 189, 248, 0.4) 4px)',
            }}
          />
        </div>
      )}

      {/* 2. Interactive 3D Canvas Layer (Used in 'hybrid' and '3d-mesh' mode) */}
      {(mode === 'hybrid' || mode === '3d-mesh') && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
          style={{ mixBlendMode: 'screen' }}
        />
      )}

      {/* 3. Deep Cinematic Blue Vignettes & Atmospheric Lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06142F]/70 via-transparent to-[#06142F]/95" />
      <div className="absolute inset-0 bg-radial-vignette" />

      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2563EB]/15 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-[420px] h-[420px] bg-[#38BDF8]/10 rounded-full blur-3xl" />

      {/* 4. Interactive Background Mode Switcher (Pill Control in Bottom Left) */}
      <div className="pointer-events-auto absolute bottom-6 left-6 sm:left-10 md:left-14 z-30 flex items-center bg-[#071738]/85 backdrop-blur-md border border-[rgba(147,197,253,0.22)] rounded-full p-1 shadow-xl">
        <button
          onClick={() => setMode('hybrid')}
          title="Cyber Hologram (Hybrid 3D Mesh + Mission Control Image)"
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            mode === 'hybrid'
              ? 'bg-gradient-to-r from-[#2563EB] to-[#38BDF8] text-white shadow-md'
              : 'text-[rgba(219,234,254,0.7)] hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Hologram 3D</span>
          <span className="sm:hidden">Hybrid</span>
        </button>

        <button
          onClick={() => setMode('3d-mesh')}
          title="3D Neural Mesh (Interactive Canvas Particles & Radar Grid)"
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            mode === '3d-mesh'
              ? 'bg-gradient-to-r from-[#2563EB] to-[#38BDF8] text-white shadow-md'
              : 'text-[rgba(219,234,254,0.7)] hover:text-white'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">3D Mesh</span>
          <span className="sm:hidden">3D</span>
        </button>

        <button
          onClick={() => setMode('image')}
          title="Mission Control Image Backdrop"
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            mode === 'image'
              ? 'bg-gradient-to-r from-[#2563EB] to-[#38BDF8] text-white shadow-md'
              : 'text-[rgba(219,234,254,0.7)] hover:text-white'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Command Image</span>
          <span className="sm:hidden">Image</span>
        </button>
      </div>
    </div>
  );
};
