import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityItem } from './ActivityItem';

interface ActivityFeedProps {
    activities: any[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>活动流</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.length > 0 ? (
                        activities.map((item: any, idx) => (
                            <ActivityItem key={idx} item={item} />
                        ))
                    ) : (
                        <p className="text-muted-foreground italic text-sm">暂无活动记录。</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
