import React, { useRef, useState } from 'react';
import "./BidDial.css";
import { CardUtils, type Card } from "shared/src/Card";
import { DeckUtils } from 'shared/src/Deck';
import { SUIT_UNICODE } from '../CombinedBiddingStatusArea/CombinedBiddingStatusArea';

interface BidDialProps {
    currentSuit: Card;
    currentValue: number;
    currentTeam: 1 | 2;
    OnSetValue: (value: number) => void;
}

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

function getRadialPositions(angles: number[], offset: number): { x: number, y: number }[] {
    return angles.map(angle => ({
        x: DIAL_CENTER.x + Math.cos(angle * DEG_TO_RAD) * (DIAL_RADIUS + offset),
        y: DIAL_CENTER.y + Math.sin(angle * DEG_TO_RAD) * (DIAL_RADIUS + offset)
    }));
}

function getHandleAngleFromPosition(x: number, y: number): number {
    const dx = x - DIAL_CENTER.x;
    const dy = y - DIAL_CENTER.y;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    return angle;
}

const BidDial: React.FC<BidDialProps> = (BidDialProps: BidDialProps) => {


    const rachmaAngles = getRachmaAngles();
    const rachmaPositions = getRadialPositions(rachmaAngles, 16);
    const ballPositions = getRadialPositions(rachmaAngles, 0);

    const [handleAngle, setHandleAngle] = useState(0);
    const [dragging, setDragging] = useState(false);
    let lastHandleValue = 0;

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

        const currentHandleIndex = Math.round((handleAngle + 90) / step) * 10;
        const currentHandleValue = currentHandleIndex == 0 ? 0 : Math.round((handleAngle + 90) / step) * 10 + 80;
        if (lastHandleValue != currentHandleValue && BidDialProps.OnSetValue)
            BidDialProps.OnSetValue(currentHandleValue);
        lastHandleValue = currentHandleValue;
    };

    const handleMouseUp = () => setDragging(false);

    const mainPath = useRef<SVGPathElement | null>(null);
    const totalLength = mainPath.current?.getTotalLength() as number;


    const currv = BidDialProps.currentValue ? BidDialProps.currentValue : 0;
    const currentValueIndex = currv == 200 ? 12 : currv == 190 ? 11 : RACHMA_TEXT.indexOf(currv.toString())
    const fillFactor = currentValueIndex / 12;
    const currentColor = BidDialProps.currentTeam == 1 ? "#8f3beb" : "#3b90eb";
    const step = 180 / (RACHMA_COUNT - 1);
    const greyIndex = Math.round((handleAngle + 90) / step);
    const greyFactor = greyIndex / 12;


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
                    stroke="lightgray"
                    fill="none"
                    strokeWidth="20"
                />
                <path
                    id='selectedPath'
                    d="M 40,100 A 60,60 0 0,1 160,100"
                    stroke="white"
                    fill="none"
                    strokeWidth="20"
                    strokeDasharray={totalLength}
                    strokeDashoffset={totalLength - totalLength * greyFactor}
                    style={{ transition: "stroke-dashoffset 0.5s cubic-bezier(0.4,0,0.2,1)" }}
                />
                <path
                    id='mainPath' ref={mainPath}
                    d="M 40,100 A 60,60 0 0,1 160,100"
                    stroke={currentColor}
                    fill="none"
                    strokeWidth="20"
                    strokeDasharray={totalLength}
                    strokeDashoffset={totalLength - totalLength * fillFactor}
                    style={{ transition: "stroke-dashoffset 0.5s cubic-bezier(0.4,0,0.2,1)" }}
                />
                {currentValueIndex > 0 && (
                    <>
                        <circle
                            cx={ballPositions[currentValueIndex].x}
                            cy={ballPositions[currentValueIndex].y}
                            r={10}
                            fill="white"
                            stroke={currentColor}
                            strokeWidth={4}
                        />
                        <text
                            x={ballPositions[currentValueIndex].x}
                            y={ballPositions[currentValueIndex].y + 4}
                            textAnchor="middle"
                            fill={currentColor}
                            fontWeight={900}
                            fontSize={14}
                        >
                            {SUIT_UNICODE[BidDialProps.currentSuit]}
                        </text>
                    </>
                )}
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
                    fill='white'
                    onMouseDown={handleMouseDown}
                />

            </svg>
        </div>
    );
};

export default BidDial;