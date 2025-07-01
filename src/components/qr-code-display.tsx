"use client";

import QRCode from "qrcode";
import { useEffect, useRef } from "react";

export const QRCodeDisplay = ({ value }: { value: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: 192, // 12rem
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
    }
  }, [value]);

  return <canvas ref={canvasRef} className="rounded" />;
};
