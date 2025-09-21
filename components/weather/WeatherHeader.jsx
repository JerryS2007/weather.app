import { Button } from "@/components/ui/button";
import { RotateCcw, Clock, Radar } from "lucide-react";
import { format } from "date-fns";

export default function WeatherHeader({ lastUpdated, onRefresh, loading, onShowRadar }) {
    return (
        <div className="bg-blue-950 bg-opacity-50 backdrop-blur-md border-b border-blue-400">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-bold weather-text-shadow mb-2">
                            <span className="text-blue-200">WEATHER</span>
                            <span className="text-yellow-400 ml-3">CENTER</span>
                        </h1>
                        <p className="text-blue-200 text-lg font-medium">
                            Slidell, Louisiana & Surrounding Areas
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-blue-200">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">
                                Last Updated: {format(lastUpdated, "h:mm a")}
                            </span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onShowRadar}
                            className="bg-green-800 bg-opacity-50 border-green-400 text-green-100 hover:bg-green-700"
                        >
                            <Radar className="w-4 h-4 mr-2" />
                            Local Radar
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onRefresh}
                            disabled={loading}
                            className="bg-blue-800 bg-opacity-50 border-blue-400 text-blue-100 hover:bg-blue-700"
                        >
                            <RotateCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
