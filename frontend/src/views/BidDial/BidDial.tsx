import React, { useState } from 'react';
import "./BidDial.css";

interface BidDialProps { }

const DIAL_RADIUS = 60;
const DEG_TO_RAD = Math.PI / 180;
const RACHMA_COUNT = 13;
const DIAL_CENTER = { x: 100, y: 100 };
const RACHMA_TEXT = [
    "0", "90", "100", "110", "120", "130", "140", "150", "160", "170", "180", "kaput", "k-general"
];
const RACHMA_TEXT_ALIGN: ("start" | "middle" | "end")[] = [
    "end", "end", "end", "end", "end", "end", "middle", "start", "start", "start", "start", "start", "start"
];

function getRachmaAngles(): number[] {
    const delta = 180 / (RACHMA_COUNT - 1);
    return Array.from({ length: RACHMA_COUNT }, (_, i) => delta * i - 180);
}

function getRachmaPositions(angles: number[]): { x: number, y: number }[] {
    return angles.map(angle => ({
        x: DIAL_CENTER.x + Math.cos(angle * DEG_TO_RAD) * (DIAL_RADIUS + 16),
        y: DIAL_CENTER.y + Math.sin(angle * DEG_TO_RAD) * (DIAL_RADIUS + 16)
    }));
}

function getHandleAngleFromPosition(x: number, y: number): number {
    const dx = x - DIAL_CENTER.x;
    const dy = y - DIAL_CENTER.y;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    return angle;
}

const BidDial: React.FC<BidDialProps> = () => {
    const rachmaAngles = getRachmaAngles();
    const rachmaPositions = getRachmaPositions(rachmaAngles);

    const [handleAngle, setHandleAngle] = useState(0);
    const [dragging, setDragging] = useState(false);

    const handleMouseDown = (e: React.MouseEvent<SVGPolygonElement, MouseEvent>) => {
        setDragging(true);
        e.preventDefault();
    };

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        const step = 180 / (RACHMA_COUNT - 1);
        if (!dragging) return;
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const angle = getHandleAngleFromPosition(mouseX, mouseY);
        const roundedAngle = Math.round(angle / step) * step;
        if (roundedAngle >= -90 && roundedAngle <= 90)
            setHandleAngle(roundedAngle);
    };

    const handleMouseUp = () => setDragging(false);

    return (
        <div className='biddial' style={{ border: "red solid 0px" }}>
            <svg
                width="240px"
                height="120px"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ userSelect: "none" }}
            >
                <path /* bg */
                    d="M 40,100 A 60,60 0 0,1 160,100"
                    stroke="white"
                    fill="none"
                    strokeWidth="20"
                />
                <path
                    d="M 40,100 A 60,60 0 0,1 160,100"
                    stroke="#8f3beb"
                    fill="none"
                    strokeWidth="20"
                    strokeDasharray="190"
                    strokeDashoffset="126"
                />
                {rachmaPositions.map((pos, idx) => (
                    <text
                        textAnchor={RACHMA_TEXT_ALIGN[idx]}
                        key={idx}
                        x={pos.x}
                        y={pos.y}
                        fill='white'
                        fontWeight={800}
                        fontSize={10}
                    >
                        {RACHMA_TEXT[idx]}
                    </text>
                ))}
                <polygon
                    className="BidDialHandle"
                    points="90,60 100,50 110,60"
                    style={{
                        transform: `rotate(${handleAngle}deg)`,
                        transformOrigin: "100px 100px",
                        cursor: "pointer"
                    }}
                    fill='grey'
                    onMouseDown={handleMouseDown}
                />
            </svg>
        </div>
    );
};

export default BidDial;