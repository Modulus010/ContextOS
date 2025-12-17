'use client';

import React, { Suspense } from 'react';
import { Dashboard } from '@/components/Dashboard';

export default function HomePage() {
    return (
        <div className="p-4 md:p-6 mx-auto w-full">
            <Suspense fallback={<div className="text-muted-foreground">加载中...</div>}>
                <Dashboard />
            </Suspense>
        </div>
    );
}
