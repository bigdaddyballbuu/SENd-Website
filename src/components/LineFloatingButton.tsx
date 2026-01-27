// LINE Floating Button Component - Official LINE Style

// ใส่ URL LINE ของคุณ
const LINE_URL = "https://line.me/R/ti/p/@098neegh";

const LineFloatingButton = () => {
  const handleClick = () => {
    window.open(LINE_URL, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 left-6 z-50 bg-[#06C755] hover:bg-[#00B849] text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
      aria-label="ติดต่อผ่าน LINE"
      style={{ width: '60px', height: '60px' }}
    >
      {/* Official LINE Logo - Chat Bubble */}
      <div className="w-full h-full flex items-center justify-center">
        <svg 
          viewBox="0 0 24 24" 
          className="w-8 h-8"
          fill="currentColor"
        >
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
        </svg>
      </div>

      {/* Tooltip */}
      <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-[#06C755] text-white text-sm px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-lg font-medium flex items-center gap-2 translate-x-2 group-hover:translate-x-0">
        <span>แชทกับเรา</span>
      </span>

      {/* Subtle pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#06C755] animate-ping opacity-20 pointer-events-none"></span>
    </button>
  );
};

export default LineFloatingButton;
