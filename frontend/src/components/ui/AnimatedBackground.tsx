export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-slate-50 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Animated Blobs */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-brand-200/20 blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-brand-300/20 blur-[100px] animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-brand-100/10 blur-[120px] animate-pulse delay-700"></div>
    </div>
  );
}
