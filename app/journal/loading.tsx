import { Skeleton } from "@/components/ui/skeleton"

export default function JournalLoading() {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <Skeleton className="h-10 w-48" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-10 w-32" />
                </div>

                <div className="lg:col-span-1 space-y-3">
                    <Skeleton className="h-8 w-32" />
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </div>
            </div>
        </div>
    );
}
