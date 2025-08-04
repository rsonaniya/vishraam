const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-500/20 backdrop-blur-sm">
      <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default Loader;
