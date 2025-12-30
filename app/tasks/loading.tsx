import { Skeleton } from "@/components/ui/skeleton"

export default function TasksLoading() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="space-y-3">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-4 w-80" />
            </div>

            <div className="space-y-4">
                <Skeleton className="h-11 w-full" />
                <div className="flex gap-3">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-48" />
                </div>
            </div>

            <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                ))}
            </div>
        </div>
    );
}
