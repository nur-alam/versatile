import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
    return (
        // <div className="vt-flex vt-flex-col vt-space-y-3">
        //   <Skeleton className="vt-h-[25px] vt-w-[200px] vt-rounded-xl" />
        //   <div className="vt-space-y-2">
        //     <Skeleton className="vt-h-4 vt-w-[200px]" />
        //     <Skeleton className="vt-h-4 vt-w-[200px]" />
        //   </div>
        // </div>

        <div className="vt-flex vt-flex-col vt-space-y-3">
            <Skeleton className="vt-h-[45px] vt-w-[200px] vt-rounded-xl" />
            <div className="vt-space-y-2">
                <Skeleton className="vt-h-4 vt-w-[200px]" />
                <Skeleton className="vt-h-4 vt-w-[200px]" />
            </div>
        </div>

    )
}