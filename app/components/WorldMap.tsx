"use client";

import { useState } from "react";

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

    // Convert to lat/lng (simple equirectangular projection)
    const lng = (x - 0.5) * 360;
    const lat = (0.5 - y) * 180;

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
      style={{ backgroundColor: "#1a4d6e" }}
    >
      {/* Simple world map SVG */}
      <svg
        viewBox="0 0 360 180"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Ocean background */}
        <rect width="360" height="180" fill="#1a4d6e" />

        {/* Simplified continents */}
        <g fill="#2d5a3d" stroke="#3d7a4d" strokeWidth="0.5">
          {/* North America */}
          <path d="M20,20 L80,15 L120,25 L130,50 L120,70 L100,75 L80,90 L60,85 L40,70 L25,50 Z" />
          {/* South America */}
          <path d="M70,95 L90,90 L100,100 L95,130 L80,150 L65,145 L55,120 L60,100 Z" />
          {/* Europe */}
          <path d="M160,25 L180,20 L200,25 L195,45 L175,50 L160,40 Z" />
          {/* Africa */}
          <path d="M160,55 L190,50 L210,60 L205,100 L185,120 L165,115 L155,90 L160,70 Z" />
          {/* Asia */}
          <path d="M200,15 L280,10 L320,30 L310,60 L280,70 L250,65 L220,55 L200,40 Z" />
          {/* Australia */}
          <path d="M280,100 L310,95 L320,110 L310,130 L285,125 L275,110 Z" />
          {/* Antarctica hint */}
          <path d="M100,165 L260,165 L250,175 L110,175 Z" opacity="0.5" />
        </g>

        {/* Grid lines */}
        <g stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" fill="none">
          {/* Latitude lines */}
          <line x1="0" y1="45" x2="360" y2="45" />
          <line x1="0" y1="90" x2="360" y2="90" />
          <line x1="0" y1="135" x2="360" y2="135" />
          {/* Longitude lines */}
          <line x1="90" y1="0" x2="90" y2="180" />
          <line x1="180" y1="0" x2="180" y2="180" />
          <line x1="270" y1="0" x2="270" y2="180" />
        </g>
      </svg>

      {/* Selected point (player's guess) */}
      {selectedPoint && (
        <div
          className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full bg-[#ffd700] border-2 border-white shadow-lg z-10"
          style={{
            left: `${toPixel(selectedPoint.lat, selectedPoint.lng).x}%`,
            top: `${toPixel(selectedPoint.lat, selectedPoint.lng).y}%`,
          }}
        />
      )}

      {/* Actual point (correct answer) */}
      {showActual && actualPoint && (
        <>
          <div
            className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full bg-green-500 border-2 border-white shadow-lg z-10"
            style={{
              left: `${toPixel(actualPoint.lat, actualPoint.lng).x}%`,
              top: `${toPixel(actualPoint.lat, actualPoint.lng).y}%`,
            }}
          />
          {/* Line between guess and actual */}
          {selectedPoint && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
              <line
                x1={`${toPixel(selectedPoint.lat, selectedPoint.lng).x}%`}
                y1={`${toPixel(selectedPoint.lat, selectedPoint.lng).y}%`}
                x2={`${toPixel(actualPoint.lat, actualPoint.lng).x}%`}
                y2={`${toPixel(actualPoint.lat, actualPoint.lng).y}%`}
                stroke="white"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>
          )}
        </>
      )}

      {/* Hover hint */}
      {!disabled && hovering && !selectedPoint && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
          <span className="text-white text-lg font-semibold">Click to place your guess</span>
        </div>
      )}
    </div>
  );
}

// Haversine formula to calculate distance between two points
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
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

// Calculate points based on distance
export function calculateGeoPoints(distanceKm: number): number {
  if (distanceKm <= 500) return 2; // Very close - full points
  if (distanceKm <= 2000) return 1; // Same region - half points
  return 0; // Too far
}
