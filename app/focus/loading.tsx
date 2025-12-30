import { Skeleton } from "@/components/ui/skeleton"

export default function FocusLoading() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <Skeleton className="h-10 w-48" />

            <div className="space-y-6">
                <Skeleton className="h-48 w-full" />
                <div className="flex justify-center gap-4">
                    <Skeleton className="h-12 w-32" />
                    <Skeleton className="h-12 w-32" />
                </div>
            </div>

            <div className="space-y-3">
                <Skeleton className="h-8 w-40" />
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                ))}
            </div>
        </div>
    );
}
