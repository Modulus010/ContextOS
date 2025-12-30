import React from 'react';
import { HugeiconsIcon } from "@hugeicons/react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
    icon: any;
    label: string;
    value: string | number;
    bgColor: string;
    textColor: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, bgColor, textColor }) => (
    <Card className="flex items-center justify-between p-6 transition-colors">
        <div>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center ${textColor}`}>
            <HugeiconsIcon icon={icon} className="w-6 h-6" />
        </div>
    </Card>
);
