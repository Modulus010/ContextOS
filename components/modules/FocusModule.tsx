'use client';

import React, { useState, useEffect } from 'react';
import { FocusSession, Task } from '@/types';
import { startOfDay } from 'date-fns';
import { useTimer, useStopwatch } from 'react-timer-hook';
import { useCreateFocusSession } from '@/hooks/useSupabaseData';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FocusHeader, TaskSelection, TimerDisplay, DurationControls } from './focus';

interface FocusModuleProps {
    sessions: FocusSession[];
    tasks: Task[];
}

export const FocusModule: React.FC<FocusModuleProps> = ({ sessions, tasks }) => {
    const [hasStarted, setHasStarted] = useState(false);
    const [duration, setDuration] = useState(25);
    const [selectedTaskId, setSelectedTaskId] = useState<string>('');
    const [isCountUp, setIsCountUp] = useState(false);

    const createSession = useCreateFocusSession();

    const getExpiryTimestamp = () => {
        const time = new Date();
        time.setSeconds(time.getSeconds() + duration * 60);
        return time;
    };

    // 倒计时器
    const {
        seconds: timerSeconds,
        minutes: timerMinutes,
        hours: timerHours,
        isRunning: timerIsRunning,
        start: timerStart,
        pause: timerPause,
        restart: timerRestart,
    } = useTimer({
        expiryTimestamp: getExpiryTimestamp(),
        onExpire: () => handleCountdownExpire(),
        autoStart: false,
    });

    // 正计时器
    const {
        seconds: stopwatchSeconds,
        minutes: stopwatchMinutes,
        hours: stopwatchHours,
        isRunning: stopwatchIsRunning,
        start: stopwatchStart,
        pause: stopwatchPause,
        reset: stopwatchReset,
    } = useStopwatch({ autoStart: false });

    // 当 duration 改变时，更新倒计时器（仅在未开始时）
    useEffect(() => {
        if (!hasStarted) {
            if (duration === 0) {
                setIsCountUp(true);
                stopwatchReset(undefined, false);
            } else {
                setIsCountUp(false);
                const time = new Date();
                time.setSeconds(time.getSeconds() + duration * 60);
                timerRestart(time, false);
            }
        }
    }, [duration, hasStarted]);

    const handleCountdownExpire = () => {
        if (Notification.permission === 'granted') {
            new Notification("Nexus 专注", { body: "倒计时结束！现在开始正计时。" });
        }

        setIsCountUp(true);
        stopwatchReset();
        stopwatchStart();
    };

    const completeSession = async () => {
        let actualDurationSeconds: number;

        if (isCountUp) {
            const countUpElapsed = stopwatchHours * 3600 + stopwatchMinutes * 60 + stopwatchSeconds;
            actualDurationSeconds = duration * 60 + countUpElapsed;
        } else {
            const elapsedSeconds = duration * 60 - (timerMinutes * 60 + timerSeconds);
            actualDurationSeconds = elapsedSeconds;
        }

        await createSession.mutateAsync({
            durationSeconds: actualDurationSeconds,
            completed: true,
            taskId: selectedTaskId || undefined
        });

        setSelectedTaskId('');
    };

    const toggleTimer = () => {
        if (!hasStarted) {
            setHasStarted(true);
            if (Notification.permission !== 'granted') {
                Notification.requestPermission();
            }
        }

        if (isCountUp) {
            if (stopwatchIsRunning) {
                stopwatchPause();
            } else {
                stopwatchStart();
            }
        } else {
            if (timerIsRunning) {
                timerPause();
            } else {
                timerStart();
            }
        }
    };

    const resetTimer = async () => {
        if (hasStarted) {
            await completeSession();

            if (Notification.permission === 'granted') {
                new Notification("Nexus 专注", { body: "专注时段已结束并保存。" });
            }
        }

        setHasStarted(false);
        if (duration === 0) {
            setIsCountUp(true);
            stopwatchReset(undefined, false);
        } else {
            setIsCountUp(false);
            stopwatchReset(undefined, false);
            const time = new Date();
            time.setSeconds(time.getSeconds() + duration * 60);
            timerRestart(time, false);
        }
    };

    const activeTasks = tasks.filter(t => t.status !== 'done');
    const PRESETS = [0, 15, 25, 50, 90];

    const displayHours = isCountUp ? stopwatchHours : timerHours;
    const displayMinutes = isCountUp ? stopwatchMinutes : timerMinutes;
    const displaySeconds = isCountUp ? stopwatchSeconds : timerSeconds;
    const isRunning = isCountUp ? stopwatchIsRunning : timerIsRunning;

    const focusMinutesToday = Math.floor(
        sessions.filter(s => {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            return new Date(s.startedAt) > startOfDay;
        }).reduce((acc, curr) => acc + curr.durationSeconds, 0) / 60
    );

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <FocusHeader focusMinutesToday={focusMinutesToday} />
            <Separator />

            <Card>
                <CardContent className="p-8">
                    <TaskSelection
                        selectedTaskId={selectedTaskId}
                        onTaskSelect={setSelectedTaskId}
                        tasks={activeTasks}
                        disabled={hasStarted}
                    />

                    <Separator className="my-8" />

                    <TimerDisplay
                        hours={displayHours}
                        minutes={displayMinutes}
                        seconds={displaySeconds}
                        isRunning={isRunning}
                        onToggle={toggleTimer}
                        onReset={resetTimer}
                        hasStarted={hasStarted}
                    />

                    <Separator className="my-8" />

                    <DurationControls
                        duration={duration}
                        onDurationChange={setDuration}
                        disabled={hasStarted}
                        presets={PRESETS}
                    />
                </CardContent>
            </Card>
        </div>
    );
};
