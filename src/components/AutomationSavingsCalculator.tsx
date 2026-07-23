import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Reveal } from "@/components/Reveal";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 1,
  }).format(value);
}

export function AutomationSavingsCalculator() {
  const [minutesPerTask, setMinutesPerTask] = useState<string>("15");
  const [timesPerDay, setTimesPerDay] = useState<string>("20");
  const [workingDaysPerMonth, setWorkingDaysPerMonth] = useState<string>("22");
  const [hourlyCost, setHourlyCost] = useState<string>("2000");
  const [coverage, setCoverage] = useState<number>(70);

  const inputs = useMemo(() => {
    const m = Math.max(0, parseFloat(minutesPerTask) || 0);
    const t = Math.max(0, parseFloat(timesPerDay) || 0);
    const d = Math.max(0, parseFloat(workingDaysPerMonth) || 0);
    const c = Math.max(0, parseFloat(hourlyCost) || 0);
    const r = Math.max(0, Math.min(100, coverage)) / 100;

    const hoursPerMonth = (m * t * d) / 60;
    const hoursSavedPerMonth = hoursPerMonth * r;
    const costSavedPerMonth = hoursSavedPerMonth * c;
    const hoursSavedPerYear = hoursSavedPerMonth * 12;
    const costSavedPerYear = costSavedPerMonth * 12;

    return {
      hoursPerMonth,
      hoursSavedPerMonth,
      costSavedPerMonth,
      hoursSavedPerYear,
      costSavedPerYear,
    };
  }, [minutesPerTask, timesPerDay, workingDaysPerMonth, hourlyCost, coverage]);

  return (
    <Reveal>
      <div className="mt-16 rounded-2xl border border-border bg-surface/40 p-6 sm:p-8 overflow-hidden">
        <div className="flex items-center gap-3 mb-2">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl sm:text-2xl tracking-tight">
              Automation Savings Calculator
            </h3>
            <p className="text-sm text-muted-foreground">
              Estimate what AI automation could free up for your team.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="minutesPerTask" className="text-sm text-muted-foreground">
                Minutes per task
              </Label>
              <Input
                id="minutesPerTask"
                type="number"
                min={0}
                value={minutesPerTask}
                onChange={(e) => setMinutesPerTask(e.target.value)}
                className="bg-background/50 border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timesPerDay" className="text-sm text-muted-foreground">
                Times per day
              </Label>
              <Input
                id="timesPerDay"
                type="number"
                min={0}
                value={timesPerDay}
                onChange={(e) => setTimesPerDay(e.target.value)}
                className="bg-background/50 border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workingDaysPerMonth" className="text-sm text-muted-foreground">
                Working days per month
              </Label>
              <Input
                id="workingDaysPerMonth"
                type="number"
                min={0}
                value={workingDaysPerMonth}
                onChange={(e) => setWorkingDaysPerMonth(e.target.value)}
                className="bg-background/50 border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hourlyCost" className="text-sm text-muted-foreground">
                Hourly staff cost (₦)
              </Label>
              <Input
                id="hourlyCost"
                type="number"
                min={0}
                value={hourlyCost}
                onChange={(e) => setHourlyCost(e.target.value)}
                className="bg-background/50 border-border"
              />
            </div>
            <div className="sm:col-span-2 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <Label htmlFor="coverage" className="text-muted-foreground">
                  Automation coverage
                </Label>
                <span className="font-medium text-primary">{coverage}%</span>
              </div>
              <Slider
                id="coverage"
                value={[coverage]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => setCoverage(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-background/40 p-4 sm:p-5">
              <p className="text-xs text-muted-foreground">Hours saved / month</p>
              <p className="mt-2 font-display font-bold text-2xl sm:text-3xl text-primary">
                {formatNumber(inputs.hoursSavedPerMonth)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                of {formatNumber(inputs.hoursPerMonth)} total hours
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background/40 p-4 sm:p-5">
              <p className="text-xs text-muted-foreground">Cost saved / month</p>
              <p className="mt-2 font-display font-bold text-2xl sm:text-3xl text-primary">
                {formatCurrency(inputs.costSavedPerMonth)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                at {formatCurrency(parseFloat(hourlyCost) || 0)} / hour
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background/40 p-4 sm:p-5">
              <p className="text-xs text-muted-foreground">Hours saved / year</p>
              <p className="mt-2 font-display font-bold text-2xl sm:text-3xl text-foreground">
                {formatNumber(inputs.hoursSavedPerYear)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                equivalent to {(inputs.hoursSavedPerYear / 168).toFixed(1)} work weeks
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background/40 p-4 sm:p-5">
              <p className="text-xs text-muted-foreground">Cost recovered / year</p>
              <p className="mt-2 font-display font-bold text-2xl sm:text-3xl text-foreground">
                {formatCurrency(inputs.costSavedPerYear)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                based on current coverage
              </p>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
