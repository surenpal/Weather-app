export const WeatherSkeleton = () => (
  <div className="mt-6 animate-pulse space-y-4">
    <div className="h-6 bg-white/20 rounded-lg w-2/3 mx-auto" />
    <div className="flex justify-center items-center gap-4">
      <div className="w-20 h-20 bg-white/20 rounded-full" />
      <div className="h-14 bg-white/20 rounded-lg w-28" />
    </div>
    <div className="h-4 bg-white/20 rounded-lg w-1/2 mx-auto" />
    <div className="grid grid-cols-2 gap-3 mt-2">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-14 bg-white/20 rounded-xl" />
      ))}
    </div>
  </div>
);
