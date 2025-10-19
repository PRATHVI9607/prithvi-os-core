import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [resetDisplay, setResetDisplay] = useState(false);

  const handleNumber = (num: string) => {
    if (resetDisplay) {
      setDisplay(num);
      setResetDisplay(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleOperation = (op: string) => {
    const current = parseFloat(display);
    
    if (previousValue !== null && operation) {
      const result = calculate(previousValue, current, operation);
      setDisplay(result.toString());
      setPreviousValue(result);
    } else {
      setPreviousValue(current);
    }
    
    setOperation(op);
    setResetDisplay(true);
  };

  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case "+":
        return prev + current;
      case "-":
        return prev - current;
      case "×":
        return prev * current;
      case "÷":
        return prev / current;
      default:
        return current;
    }
  };

  const handleEquals = () => {
    if (previousValue !== null && operation) {
      const current = parseFloat(display);
      const result = calculate(previousValue, current, operation);
      setDisplay(result.toString());
      setPreviousValue(null);
      setOperation(null);
      setResetDisplay(true);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setResetDisplay(false);
  };

  const handleDecimal = () => {
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const buttonClass = "h-16 text-lg font-semibold";

  return (
    <div className="p-4 max-w-sm mx-auto">
      <div className="bg-card rounded-lg p-4 mb-4 text-right">
        <div className="text-4xl font-bold">{display}</div>
        {operation && (
          <div className="text-sm text-muted-foreground mt-1">
            {previousValue} {operation}
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Button className={buttonClass} variant="secondary" onClick={handleClear}>
          C
        </Button>
        <Button className={buttonClass} variant="secondary" onClick={() => setDisplay((parseFloat(display) * -1).toString())}>
          ±
        </Button>
        <Button className={buttonClass} variant="secondary" onClick={() => setDisplay((parseFloat(display) / 100).toString())}>
          %
        </Button>
        <Button className={buttonClass} variant="default" onClick={() => handleOperation("÷")}>
          ÷
        </Button>

        <Button className={buttonClass} variant="outline" onClick={() => handleNumber("7")}>
          7
        </Button>
        <Button className={buttonClass} variant="outline" onClick={() => handleNumber("8")}>
          8
        </Button>
        <Button className={buttonClass} variant="outline" onClick={() => handleNumber("9")}>
          9
        </Button>
        <Button className={buttonClass} variant="default" onClick={() => handleOperation("×")}>
          ×
        </Button>

        <Button className={buttonClass} variant="outline" onClick={() => handleNumber("4")}>
          4
        </Button>
        <Button className={buttonClass} variant="outline" onClick={() => handleNumber("5")}>
          5
        </Button>
        <Button className={buttonClass} variant="outline" onClick={() => handleNumber("6")}>
          6
        </Button>
        <Button className={buttonClass} variant="default" onClick={() => handleOperation("-")}>
          -
        </Button>

        <Button className={buttonClass} variant="outline" onClick={() => handleNumber("1")}>
          1
        </Button>
        <Button className={buttonClass} variant="outline" onClick={() => handleNumber("2")}>
          2
        </Button>
        <Button className={buttonClass} variant="outline" onClick={() => handleNumber("3")}>
          3
        </Button>
        <Button className={buttonClass} variant="default" onClick={() => handleOperation("+")}>
          +
        </Button>

        <Button className={`${buttonClass} col-span-2`} variant="outline" onClick={() => handleNumber("0")}>
          0
        </Button>
        <Button className={buttonClass} variant="outline" onClick={handleDecimal}>
          .
        </Button>
        <Button className={buttonClass} variant="default" onClick={handleEquals}>
          =
        </Button>
      </div>
    </div>
  );
};
