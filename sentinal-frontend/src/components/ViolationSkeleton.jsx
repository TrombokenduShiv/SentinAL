export default function ViolationSkeleton() {
    return (
      <div className="border border-zinc-800 rounded-lg p-3 bg-zinc-900 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-4 w-16 bg-zinc-700 rounded" />
          <div className="h-3 w-12 bg-zinc-700 rounded" />
        </div>
  
        <div className="mt-3 h-4 w-3/4 bg-zinc-700 rounded" />
        <div className="mt-2 h-3 w-1/2 bg-zinc-700 rounded" />
      </div>
    );
  }
  