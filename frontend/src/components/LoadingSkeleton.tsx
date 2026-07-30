export default function LoadingSkeleton() {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden animate-pulse">
            <div className="h-48 w-full bg-zinc-800"></div>
            <div className="p-5">
                <div className="h-3 w-1/3 bg-zinc-800 rounded mb-3"></div>
                <div className="h-6 w-3/4 bg-zinc-800 rounded mb-4"></div>
                <div className="h-4 w-full bg-zinc-800 rounded mb-2"></div>
                <div className="h-4 w-5/6 bg-zinc-800 rounded mb-6"></div>
                <div className="h-10 w-full bg-zinc-800 rounded-xl"></div>
            </div>
        </div>
    );
}