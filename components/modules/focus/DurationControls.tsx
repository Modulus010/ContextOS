import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface DurationControlsProps {
    duration: number;
    onDurationChange: (duration: number) => void;
    disabled: boolean;
    presets: number[];
}

export const DurationControls: React.FC<DurationControlsProps> = ({
    duration,
    onDurationChange,
    disabled,
    presets
}) => {
    return (
        <div className={`w-full space-y-4 transition-opacity duration-300 ${
            disabled ? 'opacity-40 pointer-events-none' : 'opacity-100'
        }`}>
            <label className="block text-sm font-medium text-center">
                {duration === 0 ? '正计时模式' : `专注时长：${duration} 分钟`}
            </label>

            <div className="flex justify-center gap-2 mb-4">
                {presets.map(preset => (
                    <Button
                        key={preset}
                        onClick={() => onDurationChange(preset)}
                        disabled={disabled}
                        variant={duration === preset ? "default" : "outline"}
                        size="sm"
                        className={duration === preset ? 'bg-amber-500 hover:bg-amber-600' : ''}
                    >
                        {preset === 0 ? '正计时' : `${preset}分`}
                    </Button>
                ))}
            </div>

            <Slider
                value={[duration]}
                onValueChange={(val) => {
                    const newVal = Array.isArray(val) ? val[0] : val;
                    onDurationChange(Number(newVal));
                }}
                min={0}
                max={120}
                step={5}
                aria-label="专注时长（分钟）"
                disabled={disabled}
                className="w-full"
            />
        </div>
    );
};
