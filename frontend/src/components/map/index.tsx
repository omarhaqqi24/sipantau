"use client"

import { MapContainer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useState, useCallback } from 'react'

import sukabumiData from '@/data/sukabumi.json'

// --- Red dot marker ---
const redDotIcon = new L.DivIcon({
    className: 'bg-transparent',
    html: `<div style="
        width: 12px; height: 12px;
        background: #EF4444;
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 0 4px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -8],
});

// --- Label config: [dx, dy, lineType] ---
// lineType: 'up' = straight vertical up, 'down' = straight vertical down,
//           'left' = straight horizontal left, 'right' = straight horizontal right,
//           'L' = L-shaped (vertical then horizontal)
const labelConfig: Record<string, { dx: number; dy: number; line: string }> = {
    'Pasar Parungkuda':    { dx: -100,  dy: -14,  line: 'left' },    // straight left
    'Pasar Cicurug':       { dx: 40,   dy: -50,   line: 'L' },       // L-shaped top-right
    'Pasar Cibadak':       { dx: 35,   dy: -22,   line: 'L' },       // L-shaped right
    'Pasar Cisaat':        { dx: -47,  dy: 40,    line: 'down' },    // straight down
    'Pasar Sukaraja':      { dx: 40,   dy: 5,     line: 'L' },       // L-shaped right
    'Pasar Warungkiara':    { dx: 25,   dy: -30,   line: 'L' },       // L-shaped top-right
    'Pasar Surade':        { dx: -47,  dy: -45,   line: 'up' },      // straight up
    'Pasar Palabuhanratu': { dx: 30,   dy: 38,    line: 'L' },       // L-shaped bottom-right
}

// --- FlyTo helper ---
function FlyToLocation({ targetName, locations }: { targetName: string, locations: any[] }) {
    const map = useMap();
    useEffect(() => {
        if (targetName) {
            const target = locations.find(p => p.name === targetName);
            if (target) map.flyTo([target.lat, target.lng], 11, { duration: 1.5 });
        }
    }, [targetName, map, locations]);
    return null;
}

function clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v));
}

// --- Price Labels with connector lines ---
function PriceLabelsOverlay({ locations, selectedMarket }: { locations: any[], selectedMarket: string }) {
    const map = useMap();
    const [items, setItems] = useState<{
        name: string; price: string;
        dx: number; dy: number;  // dot
        lx: number; ly: number;  // label
        line: string;
    }[]>([]);

    const LABEL_W = 95;
    const LABEL_H = 28;
    const PAD = 6;

    const update = useCallback(() => {
        const sz = map.getSize();
        setItems(locations.map(loc => {
            const pt = map.latLngToContainerPoint([loc.lat, loc.lng]);
            const cfg = labelConfig[loc.name] || { dx: 35, dy: -25, line: 'L' };
            return {
                name: loc.name,
                price: loc.price,
                dx: pt.x,
                dy: pt.y,
                lx: clamp(pt.x + cfg.dx, PAD, sz.x - LABEL_W - PAD),
                ly: clamp(pt.y + cfg.dy, PAD, sz.y - LABEL_H - PAD),
                line: cfg.line,
            };
        }));
    }, [map, locations]);

    useEffect(() => {
        update();
        map.on('move', update);
        map.on('zoom', update);
        map.on('resize', update);
        return () => {
            map.off('move', update);
            map.off('zoom', update);
            map.off('resize', update);
        };
    }, [map, update]);

    if (!items.length) return null;
    const sz = map.getSize();

    // When a market is selected, only show that market's label
    const visibleItems = selectedMarket
        ? items.filter(p => p.name === selectedMarket)
        : items;

    return (
        <div style={{
            position: 'absolute', top: 0, left: 0,
            width: sz.x, height: sz.y,
            pointerEvents: 'none', zIndex: 650,
            overflow: 'hidden',
        }}>
            {/* Connector lines */}
            <svg width={sz.x} height={sz.y} style={{ position: 'absolute', top: 0, left: 0 }}>
                {visibleItems.map((p, i) => {
                    const labelCenterX = p.lx + LABEL_W / 2;
                    const labelCenterY = p.ly + LABEL_H / 2;

                    if (p.line === 'up' || p.line === 'down') {
                        // Perfectly vertical line
                        const labelEdge = p.line === 'up' ? p.ly + LABEL_H : p.ly;
                        return (
                            <line key={i}
                                x1={p.dx} y1={p.dy}
                                x2={p.dx} y2={labelEdge}
                                stroke="#555" strokeWidth={1.2}
                            />
                        );
                    } else if (p.line === 'left' || p.line === 'right') {
                        // Perfectly horizontal line
                        const labelEdge = p.line === 'left' ? p.lx + LABEL_W : p.lx;
                        return (
                            <line key={i}
                                x1={p.dx} y1={p.dy}
                                x2={labelEdge} y2={p.dy}
                                stroke="#555" strokeWidth={1.2}
                            />
                        );
                    } else {
                        // L-shaped: vertical then horizontal
                        const edgeX = p.lx > p.dx ? p.lx : p.lx + LABEL_W;
                        return (
                            <g key={i}>
                                <line x1={p.dx} y1={p.dy} x2={p.dx} y2={labelCenterY}
                                    stroke="#555" strokeWidth={1.2} />
                                <line x1={p.dx} y1={labelCenterY} x2={edgeX} y2={labelCenterY}
                                    stroke="#555" strokeWidth={1.2} />
                            </g>
                        );
                    }
                })}
            </svg>

            {/* Label boxes */}
            {visibleItems.map((p, i) => (
                <div key={i} style={{
                    position: 'absolute', left: p.lx, top: p.ly,
                    pointerEvents: 'auto',
                }}>
                    <div style={{
                        background: 'white',
                        border: '1.5px solid #ccc',
                        borderRadius: '16px',
                        padding: '4px 12px',
                        boxShadow: '0 1px 5px rgba(0,0,0,0.10)',
                        whiteSpace: 'nowrap',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        color: '#222',
                        userSelect: 'none',
                    }}>
                        {p.price}
                    </div>
                </div>
            ))}
        </div>
    );
}

// --- Market Image Popup when selected ---
function MarketImagePopup({ locations, selectedMarket }: { locations: any[], selectedMarket: string }) {
    const map = useMap();
    const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

    const updatePos = useCallback(() => {
        if (!selectedMarket) { setPos(null); return; }
        const loc = locations.find(l => l.name === selectedMarket);
        if (!loc) { setPos(null); return; }
        const pt = map.latLngToContainerPoint([loc.lat, loc.lng]);
        setPos({ x: pt.x, y: pt.y });
    }, [map, locations, selectedMarket]);

    useEffect(() => {
        updatePos();
        map.on('move', updatePos);
        map.on('zoom', updatePos);
        return () => {
            map.off('move', updatePos);
            map.off('zoom', updatePos);
        };
    }, [map, updatePos]);

    if (!selectedMarket || !pos) return null;

    const loc = locations.find(l => l.name === selectedMarket);
    if (!loc) return null;

    const mapSize = map.getSize();
    // Position popup to the left of the marker, centered vertically
    const popupW = 200;
    const popupH = 150;
    let px = pos.x - popupW - 20; // left of marker
    let py = pos.y - popupH / 2;

    // If too far left, put it to the right
    if (px < 10) px = pos.x + 20;
    // Clamp vertically
    if (py < 10) py = 10;
    if (py + popupH > mapSize.y - 10) py = mapSize.y - popupH - 10;

    return (
        <div style={{
            position: 'absolute', top: 0, left: 0,
            width: mapSize.x, height: mapSize.y,
            pointerEvents: 'none', zIndex: 660,
        }}>
            <div style={{
                position: 'absolute',
                left: px, top: py,
                width: popupW, height: popupH,
                pointerEvents: 'auto',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                border: '2px solid rgba(255,255,255,0.8)',
                transition: 'all 0.3s ease',
            }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={loc.image || '/assets/img/map.png'}
                    alt={loc.name}
                    style={{
                        width: '100%', height: '100%',
                        objectFit: 'cover',
                    }}
                />
                {/* Name overlay at bottom */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    padding: '20px 10px 8px',
                    color: 'white', fontSize: '12px', fontWeight: 700,
                    textAlign: 'center',
                }}>
                    {loc.name}
                </div>
            </div>
        </div>
    );
}

interface MapProps {
    locations: any[];
    selectedMarket: string;
}

export default function Map({ locations, selectedMarket }: MapProps) {
    const center: [number, number] = [-7.08, 106.73];
    const mapId = "map-container-id";

    useEffect(() => {
        return () => {
            const c = L.DomUtil.get(mapId);
            if (c) (c as any)._leaflet_id = null;
        }
    }, []);

    const districtStyle = (feature: any) => {
        const n = feature.properties.name;
        let fill = '#BDC3C7';
        if (['Cisaat', 'Cikembar', 'Gunungguruh'].includes(n)) fill = '#2C3E50';
        else if (['Cibadak', 'Nagrak', 'Parungkuda', 'Cicurug', 'Cidahu'].includes(n)) fill = '#5D6D7E';
        else if (['Palabuhanratu', 'Simpenan', 'Cikakak', 'Bantargadung'].includes(n)) fill = '#95A5A6';
        else if (['Sukaraja', 'Sukabumi', 'Sukalarang'].includes(n)) fill = '#ECF0F1';
        else if (['Surade', 'Jampangkulon', 'Ciracap'].includes(n)) fill = '#7F8C8D';
        return { fillColor: fill, weight: 1, opacity: 1, color: 'white', dashArray: '0', fillOpacity: 1 };
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            <MapContainer
                id={mapId}
                center={center}
                zoom={9.5}
                scrollWheelZoom={false}
                zoomControl={false}
                attributionControl={false}
                dragging={false}
                doubleClickZoom={false}
                style={{ height: "100%", width: "100%", background: 'transparent' }}
            >
                <GeoJSON data={sukabumiData as any} style={districtStyle} />
                <FlyToLocation targetName={selectedMarket} locations={locations} />

                {locations.map((pasar, idx) => (
                    <Marker key={idx} position={[pasar.lat, pasar.lng]} icon={redDotIcon}>
                        <Popup>
                            <div className="text-center">
                                <b className="text-sm">{pasar.name}</b><br />
                                <span className="text-gray-600 text-xs">Harga:</span><br />
                                <span className="font-bold text-green-600 text-base">{pasar.price}</span>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                <PriceLabelsOverlay locations={locations} selectedMarket={selectedMarket} />
                <MarketImagePopup locations={locations} selectedMarket={selectedMarket} />
            </MapContainer>
        </div>
    )
}