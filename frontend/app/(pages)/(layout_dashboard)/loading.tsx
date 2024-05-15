export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <div role="status" className="w-full animate-pulse">
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-4" />
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-2.5" />
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5" />
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5" />
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5" />
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]" />
            <span className="sr-only">Loading...</span>
        </div>
    )
}