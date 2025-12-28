const SectionDivider = () => {
  return (
    <div className="relative py-0 md:py-0 bg-[#F8F9FB] overflow-hidden">
      
      {/* Gradient line */}
      <div className="
        absolute inset-x- md:inset-x-0 top-1/2 
        h-px md:h-[2px] 
        bg-gradient-to-r from-transparent via-[#ed3226] to-transparent
      " />

      {/* Accent dots */}
      <div className="
        relative z-10 flex justify-center items-center gap-0.5 md:gap-6
      ">
        <span className="w-2 h-2 md:w-3 md:h-3 bg-[#ed3226] rounded-full opacity-70" />
        <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#ed3226] rounded-full opacity-40" />
        <span className="w-2 h-2 md:w-3 md:h-3 bg-[#ed3226] rounded-full opacity-70" />
      </div>
    </div>
  );
};

export default SectionDivider;
