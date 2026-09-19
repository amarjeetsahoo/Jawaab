"use client";

import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";

interface SvgConnectorProps {
  sourceEl: HTMLElement | null;
  targetEl: HTMLElement | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
  verdictColor?: string;
}

export const SvgConnector: React.FC<SvgConnectorProps> = ({
  sourceEl,
  targetEl,
  containerRef,
  verdictColor = "#f59e0b",
}) => {
  const pathRef = useRef<SVGPathElement | null>(null);
  const [pathD, setPathD] = useState<string>("");

  const updatePath = () => {
    if (!sourceEl || !targetEl || !containerRef.current) {
      setPathD("");
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const sourceRect = sourceEl.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    // Source coordinate (middle-right of active claim card)
    const x1 = sourceRect.right - containerRect.left;
    const y1 = sourceRect.top + sourceRect.height / 2 - containerRect.top;

    // Target coordinate (middle-left of matching document clause)
    const x2 = targetRect.left - containerRect.left;
    const y2 = targetRect.top + targetRect.height / 2 - containerRect.top;

    // Control points for smooth organic bezier curve
    const dx = Math.abs(x2 - x1) * 0.5;
    const cp1x = x1 + dx;
    const cp1y = y1;
    const cp2x = x2 - dx;
    const cp2y = y2;

    const d = `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
    setPathD(d);

    // Animate line draw with GSAP
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      gsap.fromTo(
        pathRef.current,
        {
          strokeDasharray: length,
          strokeDashoffset: length,
        },
        {
          strokeDashoffset: 0,
          duration: 0.4,
          ease: "power2.out",
        }
      );
    }
  };

  useEffect(() => {
    updatePath();

    const handleResize = () => updatePath();
    window.addEventListener("resize", handleResize);

    const observer = new ResizeObserver(() => updatePath());
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [sourceEl, targetEl, containerRef]);

  if (!pathD) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-20 w-full h-full"
      style={{ overflow: "visible" }}
    >
      <defs>
        <marker
          id="arrow-end"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 8 5 L 0 9 z" fill={verdictColor} />
        </marker>
      </defs>

      {/* Background shadow path for depth */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(0,0,0,0.08)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Main animated connecting path */}
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke={verdictColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        markerEnd="url(#arrow-end)"
      />
    </svg>
  );
};
