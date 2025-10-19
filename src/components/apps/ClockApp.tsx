import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw } from "lucide-react";
import { format } from "date-fns";

export const ClockApp = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [timerTime, setTimerTime] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval: any;
    if (stopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchTime((prev) => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [stopwatchRunning]);

  useEffect(() => {
    let interval: any;
    if (timerRunning && timerTime > 0) {
      interval = setInterval(() => {
        setTimerTime((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerTime]);

  const formatStopwatch = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="p-6">
      <Tabs defaultValue="clock" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clock">Clock</TabsTrigger>
          <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
          <TabsTrigger value="timer">Timer</TabsTrigger>
        </TabsList>

        <TabsContent value="clock" className="space-y-4">
          <div className="text-center py-12">
            <div className="text-6xl font-bold mb-2">
              {format(currentTime, "HH:mm:ss")}
            </div>
            <div className="text-xl text-muted-foreground">
              {format(currentTime, "EEEE, MMMM d, yyyy")}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stopwatch" className="space-y-4">
          <div className="text-center py-12">
            <div className="text-6xl font-bold mb-8">
              {formatStopwatch(stopwatchTime)}
            </div>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setStopwatchRunning(!stopwatchRunning)}
              >
                {stopwatchRunning ? (
                  <>
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Start
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setStopwatchTime(0);
                  setStopwatchRunning(false);
                }}
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timer" className="space-y-4">
          <div className="text-center py-12">
            <div className="text-6xl font-bold mb-8">
              {formatTimer(timerTime)}
            </div>
            <div className="flex gap-4 justify-center mb-6">
              <Button
                size="lg"
                onClick={() => setTimerRunning(!timerRunning)}
                disabled={timerTime === 0}
              >
                {timerRunning ? (
                  <>
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Start
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setTimerTime(60);
                  setTimerRunning(false);
                }}
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset
              </Button>
            </div>
            <div className="flex gap-2 justify-center">
              {[1, 3, 5, 10].map((mins) => (
                <Button
                  key={mins}
                  variant="secondary"
                  onClick={() => setTimerTime(mins * 60)}
                  disabled={timerRunning}
                >
                  {mins}m
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
