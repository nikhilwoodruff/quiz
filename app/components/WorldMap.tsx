"use client";

import { useState } from "react";
import { getImagePath } from "../utils";

interface WorldMapProps {
  onSelect: (lat: number, lng: number) => void;
  selectedPoint?: { lat: number; lng: number } | null;
  actualPoint?: { lat: number; lng: number } | null;
  showActual?: boolean;
  disabled?: boolean;
}

export default function WorldMap({
  onSelect,
  selectedPoint,
  actualPoint,
  showActual,
  disabled,
}: WorldMapProps) {
  const [hovering, setHovering] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const lng = (x - 0.5) * 360;
    const lat = (0.5 - y) * 180;

    // Debug: show clicked coordinates
    alert(`Clicked: lat=${lat.toFixed(2)}, lng=${lng.toFixed(2)}\nRaw: x=${x.toFixed(4)}, y=${y.toFixed(4)}`);

    onSelect(lat, lng);
  };

  const toPixel = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  return (
    <div
      className={`relative w-full aspect-[2/1] rounded-xl overflow-hidden ${
        disabled ? "cursor-default" : "cursor-crosshair"
      }`}
      onClick={handleClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* World map image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={getImagePath("/images/world-map.png")}
        alt="World map"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Selected point */}
      {selectedPoint && (
        <div
          className="absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full bg-[#ffd700] border-2 border-white shadow-lg z-10 animate-pulse"
          style={{
            left: `${toPixel(selectedPoint.lat, selectedPoint.lng).x}%`,
            top: `${toPixel(selectedPoint.lat, selectedPoint.lng).y}%`,
          }}
        />
      )}

      {/* Actual point */}
      {showActual && actualPoint && (
        <>
          <div
            className="absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full bg-green-500 border-2 border-white shadow-lg z-10"
            style={{
              left: `${toPixel(actualPoint.lat, actualPoint.lng).x}%`,
              top: `${toPixel(actualPoint.lat, actualPoint.lng).y}%`,
            }}
          />
          {selectedPoint && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
              <line
                x1={`${toPixel(selectedPoint.lat, selectedPoint.lng).x}%`}
                y1={`${toPixel(selectedPoint.lat, selectedPoint.lng).y}%`}
                x2={`${toPixel(actualPoint.lat, actualPoint.lng).x}%`}
                y2={`${toPixel(actualPoint.lat, actualPoint.lng).y}%`}
                stroke="white"
                strokeWidth="2"
                strokeDasharray="8,4"
              />
            </svg>
          )}
        </>
      )}

      {/* Hover hint */}
      {!disabled && hovering && !selectedPoint && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
          <span className="text-white text-lg font-semibold px-4 py-2 bg-black/50 rounded-lg">
            Tap to place your guess
          </span>
        </div>
      )}
    </div>
  );
}

export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateGeoPoints(distanceKm: number): number {
  if (distanceKm <= 500) return 2;
  if (distanceKm <= 2000) return 1;
  return 0;
}
