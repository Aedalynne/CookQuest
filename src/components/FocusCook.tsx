import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, ArrowLeft } from 'lucide-react';
import { type Recipe } from '../types/cooking';

interface FocusCookProps {
  recipe: Recipe;
  stepIdx: number;
  sessionXp: number;
  onNextStep: () => void;
  onExit: () => void;
}

export const FocusCook: React.FC<FocusCookProps> = ({
  recipe,
  stepIdx,
  sessionXp,
  onNextStep,
  onExit,
}) => {
  const currentStep = recipe.steps[stepIdx];
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (currentStep?.timerSeconds) {
      setTimeLeft(currentStep.timerSeconds);
      setIsTimerRunning(false);
    } else {
      setTimeLeft(null);
    }
  }, [stepIdx, currentStep]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => (prev ? prev - 1 : 0)), 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col min-h-full space-y-6">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <button
          onClick={onExit}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Exit Quest</span>
        </button>

        <span className="text-xs font-bold text-amber-400 truncate max-w-[180px]">
          {recipe.title}
        </span>
      </div>

      <div className="my-auto space-y-6">
        {/* Step Progress & XP Header */}
        <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-800/60 pb-3">
          <span>Step {stepIdx + 1} of {recipe.steps.length}</span>
          <span className="text-amber-400 font-mono font-bold">Session: +{sessionXp} XP</span>
        </div>

        {/* Embedded Ingredients Needed */}
        {currentStep.ingredientsNeeded && (
          <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
              Ingredients Needed Now:
            </span>
            <div className="flex flex-wrap gap-2">
              {currentStep.ingredientsNeeded.map((ing, i) => (
                <span
                  key={i}
                  className="bg-slate-800 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-200 border border-slate-700"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Step Instruction Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl min-h-[160px] flex items-center justify-center">
          <p className="text-lg font-medium leading-relaxed text-center text-slate-100">
            {currentStep.instruction}
          </p>
        </div>

        {/* Timer Component */}
        {timeLeft !== null && (
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Step Timer</span>
              <span className="text-3xl font-mono font-bold text-amber-400">{formatTime(timeLeft)}</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold"
              >
                {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button
                onClick={() => {
                  setTimeLeft(currentStep.timerSeconds || 0);
                  setIsTimerRunning(false);
                }}
                className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Next / Finish Button */}
        <button
          onClick={onNextStep}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-base rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5" />
          {stepIdx < recipe.steps.length - 1 ? 'Mark Step Done' : 'Finish Recipe!'}
        </button>
      </div>
    </div>
  );
};