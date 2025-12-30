'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Error:', error);
    }, [error]);

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <CardTitle className="text-destructive">出错了</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        加载页面时发生了错误。请重试。
                    </p>
                    {error.message && (
                        <p className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
                            {error.message}
                        </p>
                    )}
                    <Button onClick={() => reset()} className="w-full">
                        重试
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
