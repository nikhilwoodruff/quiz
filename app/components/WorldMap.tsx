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
      {/* World map image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/110m_physical/ne_110m_land.geojson"
        alt=""
        className="hidden"
      />
      {/* Using a reliable static map tile */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('https://basemaps.cartocdn.com/dark_nolabels/0/0/0.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Fallback colored continents */}
      <svg
        viewBox="0 0 2000 1000"
        className="absolute inset-0 w-full h-full opacity-90"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a3d62" />
            <stop offset="100%" stopColor="#1e5799" />
          </linearGradient>
        </defs>
        <rect width="2000" height="1000" fill="url(#oceanGrad)" />

        {/* More realistic continent shapes */}
        <g fill="#3d6b4f" fillOpacity="0.95">
          {/* North America - detailed */}
          <path d="M80,80 C100,60 150,50 200,45 C280,35 350,40 400,55 C450,70 480,100 500,140 C515,175 520,210 515,250 C510,290 490,320 460,340 C430,360 390,370 350,375 C320,378 290,375 270,360 C255,350 250,335 260,315 C270,295 290,280 310,270 C330,260 345,245 340,225 C335,205 310,195 280,200 C250,205 220,225 195,250 C170,275 155,305 150,340 C145,375 155,405 140,430 C125,455 95,465 70,455 C45,445 30,420 25,390 C20,360 25,325 35,295 C45,265 60,240 75,215 C90,190 100,165 95,140 C90,115 70,100 80,80 Z"/>

          {/* Greenland */}
          <path d="M570,50 C620,35 680,40 720,60 C760,80 780,115 775,150 C770,185 740,210 700,220 C660,230 610,220 575,195 C540,170 530,130 545,95 C555,70 570,55 570,50 Z"/>

          {/* South America */}
          <path d="M380,450 C420,430 470,425 510,440 C550,455 580,485 600,525 C620,565 630,615 625,665 C620,715 600,765 565,805 C530,845 480,870 430,875 C380,880 330,865 295,830 C260,795 245,745 250,695 C255,645 280,600 310,560 C340,520 375,490 380,450 Z"/>

          {/* Europe */}
          <path d="M900,100 C940,85 990,80 1030,90 C1070,100 1100,125 1110,155 C1120,185 1110,220 1085,245 C1060,270 1020,280 980,275 C940,270 905,250 885,220 C865,190 865,155 880,125 C890,105 900,100 900,100 Z"/>

          {/* UK/Ireland */}
          <path d="M840,120 C855,110 875,115 885,130 C895,145 890,165 875,175 C860,185 840,180 830,165 C820,150 825,130 840,120 Z"/>

          {/* Africa */}
          <path d="M900,290 C950,270 1010,265 1060,280 C1110,295 1150,330 1175,375 C1200,420 1210,475 1205,530 C1200,585 1180,640 1145,685 C1110,730 1060,765 1005,780 C950,795 890,790 840,765 C790,740 755,695 740,640 C725,585 730,525 755,475 C780,425 825,385 875,355 C900,335 900,310 900,290 Z"/>

          {/* Asia - main mass */}
          <path d="M1100,70 C1180,50 1280,45 1380,55 C1480,65 1580,95 1660,145 C1740,195 1800,265 1830,345 C1860,425 1860,515 1830,590 C1800,665 1740,725 1665,760 C1590,795 1500,800 1420,780 C1340,760 1270,715 1220,655 C1170,595 1145,520 1140,445 C1135,370 1155,295 1190,235 C1225,175 1275,130 1100,70 Z"/>

          {/* India */}
          <path d="M1340,350 C1380,330 1430,335 1465,360 C1500,385 1520,425 1515,470 C1510,515 1480,555 1440,575 C1400,595 1350,590 1315,565 C1280,540 1265,500 1275,455 C1285,410 1315,375 1340,350 Z"/>

          {/* Southeast Asia */}
          <path d="M1500,370 C1540,355 1590,365 1620,395 C1650,425 1660,470 1645,510 C1630,550 1590,575 1545,575 C1500,575 1455,550 1435,510 C1415,470 1425,420 1460,385 C1475,370 1490,365 1500,370 Z"/>

          {/* Japan */}
          <path d="M1720,180 C1745,165 1780,170 1800,195 C1820,220 1820,255 1800,280 C1780,305 1745,315 1715,300 C1685,285 1670,250 1680,215 C1690,190 1710,175 1720,180 Z"/>

          {/* Australia */}
          <path d="M1560,590 C1620,570 1700,575 1760,605 C1820,635 1865,690 1885,755 C1905,820 1895,895 1855,950 C1815,1005 1745,1035 1670,1030 C1595,1025 1525,985 1480,925 C1435,865 1420,790 1440,720 C1460,650 1515,600 1560,590 Z"/>

          {/* New Zealand */}
          <path d="M1870,780 C1895,765 1930,775 1945,805 C1960,835 1955,875 1930,900 C1905,925 1865,930 1840,905 C1815,880 1815,840 1840,810 C1855,790 1870,780 1870,780 Z"/>
        </g>

        {/* Grid overlay */}
        <g stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none">
          <line x1="0" y1="500" x2="2000" y2="500" />
          <line x1="1000" y1="0" x2="1000" y2="1000" />
          <line x1="500" y1="0" x2="500" y2="1000" strokeDasharray="10,10" strokeOpacity="0.3" />
          <line x1="1500" y1="0" x2="1500" y2="1000" strokeDasharray="10,10" strokeOpacity="0.3" />
          <line x1="0" y1="250" x2="2000" y2="250" strokeDasharray="10,10" strokeOpacity="0.3" />
          <line x1="0" y1="750" x2="2000" y2="750" strokeDasharray="10,10" strokeOpacity="0.3" />
        </g>
      </svg>

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
