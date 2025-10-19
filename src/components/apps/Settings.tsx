import { useTheme } from "@/contexts/ThemeContext";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export const SettingsApp = () => {
  const { theme, setTheme, brightness, setBrightness } = useTheme();

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <p className="text-muted-foreground">Customize your PrathviOS experience</p>
      </div>

      {/* Theme Selection */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Theme</Label>
          <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
        </div>
        <div className="flex gap-4">
          <Button
            variant={theme === "sun" ? "default" : "outline"}
            size="lg"
            onClick={() => setTheme("sun")}
            className="flex-1 h-24 flex-col gap-2"
          >
            <Sun className="h-8 w-8" />
            <span>Sun Theme</span>
            <span className="text-xs opacity-70">Bright & Fresh</span>
          </Button>
          <Button
            variant={theme === "moon" ? "default" : "outline"}
            size="lg"
            onClick={() => setTheme("moon")}
            className="flex-1 h-24 flex-col gap-2"
          >
            <Moon className="h-8 w-8" />
            <span>Moon Theme</span>
            <span className="text-xs opacity-70">Dark & Calm</span>
          </Button>
        </div>
      </div>

      {/* Brightness Control */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Brightness</Label>
          <p className="text-sm text-muted-foreground">
            Adjust screen brightness ({brightness}%)
          </p>
        </div>
        <Slider
          value={[brightness]}
          onValueChange={(value) => setBrightness(value[0])}
          min={30}
          max={100}
          step={5}
          className="w-full"
        />
      </div>

      {/* Info */}
      <div className="pt-8 border-t border-border">
        <h3 className="font-semibold mb-2">About PrathviOS</h3>
        <p className="text-sm text-muted-foreground">Version 1.0.0</p>
        <p className="text-sm text-muted-foreground">
          A beautiful web-based operating system
        </p>
      </div>
    </div>
  );
};
