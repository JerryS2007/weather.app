import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function RadarDisplay({ onClose }) {
    // Coordinates for Slidell, LA (70461)
    const SLIDELL_COORDS = { lat: 30.2752, lon: -89.7814 };
    const RADAR_URL = "https://radar.weather.gov/?settings=v1_eyJhZ2VuZGEiOnsiaWQiOiJ3ZWF0aGVyIiwiY2VudGVyIjpbLTg5LjczNiwzMC4yNjRdLCJsb2NhdGlvbiI6Wy04OS43MzYsMzAuMjY0XSwiem9vbSI6NywibGF5ZXIiOiJicmVmX3FjZDIifSwiYW5pbWF0aW5nIjpmYWxzZSwiYmFzZSI6InN0YW5kYXJkIiwiYXJ0Y2MiOmZhbHNlLCJjb3VudHkiOmZhbHNlLCJjd2EiOmZhbHNlLCJyZmMiOmZhbHNlLCJzdGF0ZSI6ZmFsc2UsIm1lbnUiOnRydWUsInNob3J0RnVzZWRPbmx5IjpmYWxzZSwib3BhY2l0eSI6eyJhbGVydHMiOjAuOCwibG9jYWwiOjAuNiwiTG9jYWxTdGF0aW9ucyI6MC44LCJuYXRpb25hbCI6MC42fX0=";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-5xl h-full max-h-[90vh] retro-border bg-blue-900 bg-opacity-95 weather-glow flex flex-col">
                <CardHeader className="bg-blue-950 bg-opacity-50 border-b border-blue-400">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl font-bold text-white weather-text-shadow flex items-center gap-3">
                            <div className="w-6 h-6 bg-green-500 rounded animate-pulse"></div>
                            LIVE RADAR - SLIDELL, LA (70461)
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="text-white hover:bg-blue-800"
                        >
                            <X className="w-6 h-6" />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-6 flex-1 overflow-hidden">
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-white">
                                <span className="text-lg font-semibold">DOPPLER RADAR</span>
                                <span className="ml-4 text-blue-200">
                                    {SLIDELL_COORDS.lat.toFixed(4)}°N, {Math.abs(SLIDELL_COORDS.lon).toFixed(4)}°W
                                </span>
                            </div>
                        </div>

                        {/* Live Radar Iframe taking full space */}
                        <div className="flex-1 relative bg-black rounded-lg overflow-hidden border-2 border-green-500">
                           <iframe
                               src={RADAR_URL}
                               title="Live Weather Radar"
                               className="w-full h-full"
                               frameBorder="0"
                           />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
