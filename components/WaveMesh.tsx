import { useState, useEffect, useRef, useMemo } from 'react';

// Generate 3D mesh - moved outside component to avoid recreation
const generateIsometricMesh = (amplitude: number, frequency: number, time: number) => {
  const gridSize = 18;
  const points = [];

  for (let i = 0; i < gridSize; i++) {
    const row = [];
    for (let j = 0; j < gridSize; j++) {
      const x = (i / (gridSize - 1) - 0.5) * 2.5;
      const z = (j / (gridSize - 1) - 0.5) * 2.5;

      const distance = Math.sqrt(x * x + z * z);
      const y = amplitude * Math.sin(distance * frequency * Math.PI - time * 2);

      row.push({ x, y, z });
    }
    points.push(row);
  }

  const scale = 140;
  const centerX = 400;
  const centerY = 300;
  const angle = Math.PI / 6;
  const cosAngle = Math.cos(angle);
  const sinAngle = Math.sin(angle);

  const projectedPoints = points.map(row => row.map(point => ({
    x: centerX + (point.x - point.z) * cosAngle * scale,
    y: centerY + (point.x + point.z) * sinAngle * scale - point.y * scale
  })));

  const paths = [];

  for (let i = 0; i < gridSize; i++) {
    let pathData = '';
    for (let j = 0; j < gridSize; j++) {
      const p = projectedPoints[i][j];
      pathData += j === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`;
    }
    paths.push(pathData);
  }

  for (let j = 0; j < gridSize; j++) {
    let pathData = '';
    for (let i = 0; i < gridSize; i++) {
      const p = projectedPoints[i][j];
      pathData += i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`;
    }
    paths.push(pathData);
  }

  return paths;
};

export default function WaveMesh() {
  const [frame, setFrame] = useState(0);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  const amplitude = 0.10;
  const frequency = 2.0;

  // Animation loop - throttled to ~30fps
  useEffect(() => {
    let lastUpdate = 0;
    const targetInterval = 33;

    const animate = (timestamp: number) => {
      timeRef.current += 0.02;

      if (timestamp - lastUpdate >= targetInterval) {
        lastUpdate = timestamp;
        setFrame(f => f + 1);
      }

      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const meshPaths = useMemo(() => generateIsometricMesh(amplitude, frequency, timeRef.current), [frame, amplitude, frequency]);

  return (
    <svg viewBox="95 120 610 360" className="w-full h-full">
      <g>
        {meshPaths.map((pathData, i) => (
          <path
            key={i}
            d={pathData}
            fill="none"
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.75"
          />
        ))}
      </g>
    </svg>
  );
}
