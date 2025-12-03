const LoadingOverlay = ({ label = "Memuat data" }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />
    <p className="text-sm text-primary-soft">{label}...</p>
  </div>
);

export default LoadingOverlay;
