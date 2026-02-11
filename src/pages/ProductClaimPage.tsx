import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  ChevronRight, ChevronLeft, Send, Upload, Loader2, 
  Shield, HeartHandshake, MessageSquareText, Copy, RefreshCw, X,
  CheckCircle2, AlertCircle, PartyPopper, Flag, Clock, ChevronDown, XCircle
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Assets
import bgImage from "../assets/images/washer.png";
import scooterImage from "../assets/hero/bike.png";
import { stores } from "./LaundryPage";
import LineFloatingButton from "../components/LineFloatingButton";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx-k5yX-bhFBLN9ybuh20XeYM6Yt-mpWrN9BNQg1QZP-mRsZ9HaGla-acbIvnCqQU7GJQ/exec";

// --- Types & Schema ---

const problemOptions = [
  { value: "เสื้อผ้าสูญหาย", key: "claim.problems.lost" },
  { value: "เสื้อผ้าชำรุด", key: "claim.problems.damaged" },
  { value: "ผ้าไม่สะอาด", key: "claim.problems.unclean" },
  { value: "ผ้าอบไม่แห้ง", key: "claim.problems.notDry" },
  { value: "ไฟดับ", key: "claim.problems.powerOutage" },
  { value: "เครื่องซักมีปัญหา", key: "claim.problems.machineIssue" },
  { value: "ไรเดอร์ไม่สุภาพ", key: "claim.problems.rudeRider" },
  { value: "อื่นๆ", key: "claim.problems.others" },
];

const formSchema = z.object({
  name: z.string().trim().min(2, "กรุณากรอกชื่อ-นามสกุล").max(100),
  phone: z.string().trim().length(10, "เบอร์โทรศัพท์ต้องมี 10 หลัก").regex(/^[0-9]+$/, "กรุณากรอกเฉพาะตัวเลข"),
  email: z.string().trim().email("กรุณากรอกอีเมลที่ถูกต้อง").max(255),
  problem: z.string().min(1, "กรุณาเลือกปัญหา"),
  date: z.string().min(1, "กรุณาเลือกวันที่"),
  shop_branch: z.string().trim().min(1, "กรุณากรอกชื่อร้าน-สาขา").max(200),
  image_base64: z.array(z.string()).optional(),
  others: z.string().trim().max(1000).optional(),
  consent: z.boolean().refine((val) => val === true, "กรุณายืนยันข้อมูล"),
});

type FormData = z.infer<typeof formSchema>;

type ClaimData = {
  ticketId: string;
  status: string; // 'submitted' | 'reviewing' | 'processing' | 'completed' | 'ปฏิเสธ'
  custom_estimate?: string; // Admin override
  rejection_reason?: string; // เหตุผลที่ปฏิเสธ
  timestamp: number;
  data: FormData;
};

// --- Components ---

const HeroSection = () => {
  const { t } = useTranslation();
  
    const features = [{
        icon: HeartHandshake,
        title: t("claim.featureHelp"),
        description: t("claim.featureHelpDesc")
      }, {
        icon: Shield,
        title: t("claim.featureSafe"),
        description: t("claim.featureSafeDesc")
      }, {
        icon: MessageSquareText,
        title: t("claim.featureFeedback"),
        description: t("claim.featureFeedbackDesc")
      }];

  return (
    <section className="relative min-h-[60vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden pt-32 pb-20">
      {/* Background Image */}
      {/* Background Image & Overlay */}
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0 bg-slate-900">
        <img src={bgImage} alt="SENd Laundry Service" className="w-full h-full object-cover opacity-50" />
        
        {/* Dark Glassy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-900/40 to-slate-900/40 backdrop-blur-[0px]" />
        
        {/* Radial Spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#0f172a_100%)] opacity-70" />
        
        {/* Subtle Grid Texture (Optional for tech/modern feel) */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-soft-light"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="animate-fade-in-up opacity-0 mb-8" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium border border-white/20 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#ff2500] animate-pulse" />
              {t("claim.heroBadge")}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-slate-800 mb-6 leading-tight drop-shadow-sm text-white">
            {t("claim.heroTitle")}
            <span className="block text-[#ff2500]">{t("claim.heroTitleHighlight")}</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-slate-600 mb-14 max-w-2xl mx-auto leading-relaxed text-white">
            {t("claim.heroDesc")}
            <br className="hidden md:block" />
            {t("claim.heroDesc2")}
          </p>

          {/* CTA Button */}
          <div className="mb-16">
            <a 
                href="#form" 
                onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#ff2500] hover:bg-[#d62000] text-white rounded-full text-lg font-bold shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-1"
            >
              <MessageSquareText className="w-5 h-5" />
              {t("claim.ctaButton")}
            </a>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {features.map((feature, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-4 text-[#ff2500]">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2 text-lg">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const renderStatusStep = (stepNum: number, labelKey: string, currentStatus: string, t: any) => {
    // Map status string to step number (1-4)
    // English fallback supported just in case
    let currentStepNum = 1;
    if (currentStatus === 'กำลังตรวจสอบ' || currentStatus === 'reviewing') currentStepNum = 2;
    if (currentStatus === 'กำลังดำเนินการ' || currentStatus === 'processing') currentStepNum = 3;
    if (currentStatus === 'สำเร็จ' || currentStatus === 'completed') currentStepNum = 4;

    const isSuccess = currentStatus === 'สำเร็จ' || currentStatus === 'completed';
    const activeColorClass = isSuccess ? "bg-green-500 border-green-500 text-white" : "bg-[#ff2500] border-[#ff2500] text-white";
    const activeTextClass = isSuccess ? "text-green-600" : "text-[#ff2500]";

    const isActive = stepNum <= currentStepNum;
    const isCurrent = stepNum === currentStepNum;

    return (
        <div className="flex flex-col items-center relative z-10 w-24">
            <div className={`
                w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 mb-2
                ${isActive ? activeColorClass : "bg-white border-slate-200 text-slate-300"}
                ${isCurrent ? "ring-4 ring-white shadow-md scale-110" : ""}
            `}>
                {stepNum < currentStepNum || isSuccess ? (
                    <CheckCircle2 className="w-6 h-6" />
                ) : stepNum === 4 ? (
                    <Flag className="w-5 h-5" />
                ) : (
                    <span className="font-bold">{stepNum}</span>
                )}
            </div>
            <span className={`text-xs font-medium text-center ${isActive ? activeTextClass : "text-slate-400"}`}>
                {t(labelKey)}
            </span>
        </div>
    );
};

const getEstimatedWaitTime = (problem: string, t: any) => {
    const hours = t("claim.estimate.time.hour");
    const days = t("claim.estimate.time.day");
    
    switch (problem) {
        case "เสื้อผ้าสูญหาย": return { check: `48 ${hours}`, process: `15 ${days}`, total: `17 ${days}`, reason: t("claim.estimate.reasons.lost") };
        case "เสื้อผ้าชำรุด": return { check: `48 ${hours}`, process: `14 ${days}`, total: `16 ${days}`, reason: t("claim.estimate.reasons.damaged") };
        case "ผ้าไม่สะอาด": return { check: `24 ${hours}`, process: `24 ${hours}`, total: `24 ${hours}`, reason: t("claim.estimate.reasons.unclean") };
        case "ผ้าอบไม่แห้ง": return { check: `24 ${hours}`, process: `24 ${hours}`, total: `24 ${hours}`, reason: t("claim.estimate.reasons.notDry") };
        case "ไฟดับ": return { check: `24 ${hours}`, process: `24 ${hours}`, total: `48 ${hours}`, reason: t("claim.estimate.reasons.powerOutage") };
        case "เครื่องซักมีปัญหา": return { check: `24 ${hours}`, process: `24 ${hours}`, total: `48 ${hours}`, reason: t("claim.estimate.reasons.machineIssue") };
        case "ไรเดอร์ไม่สุภาพ": return { check: `24 ${hours}`, process: `24 ${hours}`, total: `48 ${hours}`, reason: t("claim.estimate.reasons.rudeRider") };
        default: return { check: `1–2 ${days}`, process: `7-14 ${days}`, total: `8-16 ${days}`, reason: t("claim.estimate.reasons.default") };
    }
};

const FireworkExplosion = ({ x, y, delay, color }: { x: string; y: string; delay: number; color: string }) => {
    return (
        <div className="absolute pointer-events-none" style={{ left: x, top: y }}>
            {/* Primary Explosion */}
            {[...Array(30)].map((_, i) => {
                const angle = (i * 360) / 30;
                const radius = Math.random() * 120 + 60;
                return (
                    <motion.div
                        key={`primary-${i}`}
                        className="absolute w-1.5 h-1.5 rounded-full shadow-[0_0_10px_currentColor]"
                        style={{ 
                            backgroundColor: color,
                            color: color
                        }}
                        initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                        animate={{
                            x: [0, Math.cos(angle * Math.PI / 180) * radius],
                            y: [0, Math.sin(angle * Math.PI / 180) * radius + (Math.random() * 60)], // Gravity
                            opacity: [1, 1, 0],
                            scale: [0, 1, 0],
                        }}
                        transition={{ 
                            duration: 1.8, 
                            ease: "easeOut", 
                            delay: delay,
                            repeat: Infinity,
                            repeatDelay: 3
                        }}
                    />
                );
            })}
             {/* Secondary Sparkles (Trail/Glitter) */}
             {[...Array(15)].map((_, i) => {
                const angle = Math.random() * 360;
                const radius = Math.random() * 80;
                return (
                    <motion.div
                        key={`secondary-${i}`}
                        className="absolute w-1 h-1 rounded-full bg-white/80"
                        initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                        animate={{
                            x: [0, Math.cos(angle * Math.PI / 180) * radius * 0.8],
                            y: [0, Math.sin(angle * Math.PI / 180) * radius * 0.8 + 40],
                            opacity: [0, 1, 0],
                            scale: [0, 0.8, 0],
                        }}
                        transition={{ 
                            duration: 1.5, 
                            ease: "easeOut", 
                            delay: delay + 0.2, // Slightly later
                            repeat: Infinity,
                            repeatDelay: 3.3
                        }}
                    />
                );
            })}
        </div>
    );
};

const ConfettiRain = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
            {[...Array(50)].map((_, i) => {
                const randomX = Math.random() * 100;
                const randomDelay = Math.random() * 5;
                const randomDuration = Math.random() * 3 + 3;
                const randomColor = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"][Math.floor(Math.random() * 6)];
                const randomRotation = Math.random() * 360;
                
                return (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-4 rounded-[1px]"
                        style={{ 
                            left: `${randomX}%`,
                            top: `-5%`,
                            backgroundColor: randomColor,
                        }}
                        animate={{
                            y: ["0vh", "100vh"],
                            x: [0, Math.random() * 20 - 10, 0, Math.random() * 20 - 10], // Swaying
                            rotateX: [0, 360],
                            rotateY: [0, 360],
                            rotateZ: [0, randomRotation + 360],
                        }}
                        transition={{
                            duration: randomDuration,
                            repeat: Infinity,
                            delay: randomDelay,
                            ease: "linear",
                        }}
                    />
                );
            })}
        </div>
    );
};

const SuccessView = ({ existingClaim, onClear, onRefresh, loadingStatus }: { existingClaim: ClaimData, onClear: () => void, onRefresh: (ticketId: string) => void, loadingStatus: boolean }) => {
    const { t } = useTranslation();
    const { toast } = useToast(); // Fix: Add useToast hook
    const [progressWidth, setProgressWidth] = useState('0%');

    useEffect(() => {
        // Trigger entrance animation
        const timer = setTimeout(() => {
            const targetWidth = (existingClaim.status === 'สำเร็จ' || existingClaim.status === 'completed') ? '100%' : 
                (existingClaim.status === 'กำลังดำเนินการ' || existingClaim.status === 'processing') ? '66.66%' : 
                (existingClaim.status === 'กำลังตรวจสอบ' || existingClaim.status === 'reviewing') ? '33.33%' : '0%';
            
            setProgressWidth(targetWidth);
        }, 500); // Increased delay to 500ms to ensure "drive-in" effect is visible

        return () => clearTimeout(timer);
    }, [existingClaim.status]);



    return (
      <section id="form" className="py-20 px-4 relative overflow-hidden min-h-screen flex items-center">
        {/* Confetti Rain (Foreground) */}
        {(existingClaim.status === 'สำเร็จ' || existingClaim.status === 'completed') && (
            <ConfettiRain />
        )}

        {/* Background Gradients & City */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/90 via-white/95 to-red-50/90 z-0" />
        
        {/* Blurred City Background */}
        <div className="absolute inset-0 z-[-1] opacity-20 pointer-events-none">
            <div 
                className="w-full h-full bg-cover bg-bottom blur-[6px] scale-105"
                style={{ backgroundImage: `url(${bgImage})` }}
            />
        </div>

        {/* 🫧 Laundry Theme Background Effects */}
            
        {/* Rising Soap Bubbles - More Visible */}
        {[...Array(15)].map((_, i) => (
            <motion.div
                key={`bubble-${i}`}
                className="absolute rounded-full border border-blue-200/60 bg-white/40 shadow-sm backdrop-blur-[1px]"
                style={{
                    width: Math.random() * 30 + 15 + 'px',
                    height: Math.random() * 30 + 15 + 'px',
                    left: `${Math.random() * 100}%`,
                    bottom: '-20%',
                    zIndex: 1,
                }}
                animate={{
                    y: -1200,
                    x: [0, Math.random() * 100 - 50, 0],
                    opacity: [0, 0.6, 0],
                    scale: [0.5, 1.1, 1.2],
                }}
                transition={{
                    duration: Math.random() * 15 + 20,
                    repeat: Infinity,
                    delay: Math.random() * 10,
                    ease: "linear",
                }}
            />
        ))}

        {/* Floating Water Droplets - More Visible */}
        {[...Array(10)].map((_, i) => (
            <motion.div
                key={`droplet-${i}`}
                className="absolute w-3 h-3 bg-blue-400/40 rounded-full blur-[0.5px] shadow-sm"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    zIndex: 1,
                }}
                animate={{
                    y: [0, -30, 0],
                    opacity: [0.3, 0.7, 0.3],
                    scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                    duration: 3 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                    ease: "easeInOut",
                }}
            />
        ))}

        {/* Clean Sparkles - More Visible */}
        {[...Array(8)].map((_, i) => (
            <motion.div
                key={`clean-sparkle-${i}`}
                className="absolute text-orange-400/50"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 80}%`,
                    zIndex: 1,
                }}
                animate={{
                    scale: [0, 1.3, 0],
                    rotate: [0, 45, 90],
                    opacity: [0, 0.8, 0],
                }}
                transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: "easeInOut",
                }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
            </motion.div>
        ))}
        
        {/* Subtle Spinning Washer/Pattern Elements - More Visible */}
        <motion.div 
            className="absolute top-[15%] left-[8%] text-blue-200/20 pointer-events-none"
            style={{ zIndex: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
             <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v12" strokeDasharray="2 2" />
                <path d="M6 12h12" strokeDasharray="2 2" />
             </svg>
        </motion.div>
        
        <motion.div 
            className="absolute bottom-[20%] right-[5%] text-orange-200/20 pointer-events-none"
            style={{ zIndex: 0 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
             <svg width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="12" cy="12" r="8" />
                <path d="M12 2v2" /><path d="M12 20v2" />
                <path d="M22 12h-2" /><path d="M4 12H2" />
                <path d="M19.07 4.93L17.66 6.34" /><path d="M6.34 17.66L4.93 19.07" />
                <path d="M19.07 19.07L17.66 17.66" /><path d="M6.34 6.34L4.93 4.93" />
             </svg>
        </motion.div>
        
        {/* Animated Scooter - Bumpy Ride on Realistic Road */}
        <div className="absolute inset-x-0 bottom-0 overflow-hidden pointer-events-none z-0 h-44 flex items-end">
             {/* Realistic Road */}
             <div className="w-full h-16 bg-slate-700 relative flex items-center shadow-lg transform -skew-x-12 scale-110 origin-bottom">
                {/* Road Surfaces */}
                <div className="absolute top-0 w-full h-[2px] bg-slate-600"></div>
                <div className="absolute bottom-0 w-full h-[4px] bg-slate-800"></div>
                
                {/* Center Lines - Animated */}
                <div className="w-full flex justify-between gap-12 animate-road-move px-4">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="w-12 h-2 bg-white/40 rounded-full shrink-0"></div>
                    ))}
                </div>
             </div>
             
             <motion.div
                className="absolute bottom-3 left-0 w-32 md:w-44 z-10"
                initial={{ x: "-20%" }}
                animate={{ 
                    x: "120vw",
                    y: [0, -2, 1, -1, 0, -3, 0], // Bumpy y-axis
                    rotate: [0, -1, 1, -1, 0.5, 0] 
                }}
                transition={{ 
                    x: {
                        duration: 18, 
                        repeat: Infinity, 
                        ease: "linear", 
                        delay: 0
                    },
                    y: {
                        duration: 2,
                        repeat: Infinity, 
                        ease: "easeInOut",
                        repeatType: "mirror"
                    },
                    rotate: {
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear"
                    }
                }}
             >
                <img src={scooterImage} alt="SENd Scooter" className="w-full h-auto drop-shadow-xl" />
                
                {/* Dust/Smoke Effect */}
                <div className="absolute bottom-2 -left-2 flex space-x-1">
                     <motion.div 
                        className="w-3 h-3 bg-white/20 rounded-full blur-[2px]"
                        animate={{ opacity: [0, 0.5, 0], x: [-5, -15], y: [-5, -15], scale: [0.5, 1.5] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                    />
                     <motion.div 
                        className="w-2 h-2 bg-white/30 rounded-full blur-[1px]"
                        animate={{ opacity: [0, 0.6, 0], x: [-2, -10], y: [-2, -8], scale: [0.5, 1.2] }}
                        transition={{ duration: 0.7, repeat: Infinity, delay: 0.3 }}
                    />
                </div>
             </motion.div>
        </div>

        {/* Fireworks Effect */}
        {existingClaim.status === 'สำเร็จ' || existingClaim.status === 'completed' ? (
             <div className="absolute inset-0 pointer-events-none overflow-hidden z-1">
                <FireworkExplosion x="20%" y="30%" delay={0} color="#ff2500" />
                <FireworkExplosion x="80%" y="25%" delay={0.5} color="#fbbf24" />
                <FireworkExplosion x="50%" y="40%" delay={1} color="#3b82f6" />
                <FireworkExplosion x="30%" y="60%" delay={1.5} color="#10b981" />
                <FireworkExplosion x="70%" y="50%" delay={2} color="#f43f5e" />
             </div>
        ) : null}

        <div className="container mx-auto max-w-2xl relative z-20">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-14 text-center border border-white/50 shadow-2xl shadow-orange-100/50">
            
            {/* Ticket ID Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-slate-600 font-mono font-bold text-lg mb-8 border border-slate-200 mx-auto">
                <span>{t("claim.success.ticket")}</span>
                <span className="text-[#ff2500]">{existingClaim.ticketId}</span>
                <button 
                    onClick={() => {
                        navigator.clipboard.writeText(existingClaim.ticketId);
                        toast({ title: t("claim.success.copy") });
                    }}
                    className="p-1 hover:bg-slate-200 rounded-md transition-colors"
                >
                    <Copy className="w-4 h-4" />
                </button>
            </div>

            {/* Status Icon - Conditional based on status */}
            {existingClaim.status === 'ปฏิเสธ' || existingClaim.status === 'rejected' ? (
              <>
                {/* Rejected Icon */}
                <div className="relative mx-auto mb-6 w-24 h-24">
                  <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-50" />
                  <div className="relative w-full h-full bg-red-500 rounded-full flex items-center justify-center shadow-xl shadow-red-200">
                    <XCircle className="w-12 h-12 text-white" />
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-red-600 mb-4">
                  {t("claim.rejected.title")}
                </h2>

                <p className="text-slate-500 mb-6">
                  {t("claim.rejected.desc")}
                </p>

                {/* แสดงเหตุผลการปฏิเสธ */}
                {existingClaim.rejection_reason && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-10 max-w-md mx-auto">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-red-700 mb-1">{t("claim.rejected.reason")}</p>
                        <p className="text-sm text-red-600">{existingClaim.rejection_reason}</p>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-sm text-slate-400 mb-10">
                  {t("claim.rejected.contact")}
                </p>
              </>
            ) : (
              <>
                {/* Success Icon */}
                <div className="relative mx-auto mb-6 w-24 h-24">
                  <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-50" />
                  <div className="relative w-full h-full bg-green-500 rounded-full flex items-center justify-center shadow-xl shadow-green-200">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <PartyPopper className="w-6 h-6 text-orange-400" />
                  <h2 className="text-3xl font-bold text-slate-800">
                    {t("claim.success.title")}
                  </h2>
                  <PartyPopper className="w-6 h-6 text-orange-400" />
                </div>

                <p className="text-slate-500 mb-10">
                  {t("claim.success.desc")}
                </p>
              </>
            )}

                {/* PROGRESS BAR - ซ่อนเมื่อปฏิเสธ */}
                {existingClaim.status !== 'ปฏิเสธ' && existingClaim.status !== 'rejected' && (
                <div className="mb-20 relative max-w-lg mx-auto mt-12 px-4">
                    {/* Connecting Line - Background (Road Style) */}
                    <div className="absolute top-5 left-12 right-12 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="w-full h-full border-b-2 border-dashed border-slate-300 transform -translate-y-1/2 top-1/2 relative opacity-50"></div>
                    </div>
                    
                    {/* Connecting Line - Active */}
                    <div className="absolute top-5 left-12 right-12 h-2 rounded-full overflow-visible">
                         <motion.div 
                            className={`h-full shadow-sm relative ${
                                (existingClaim.status === 'สำเร็จ' || existingClaim.status === 'completed') 
                                ? "bg-green-500" 
                                : "bg-[#ff2500]"
                            }`} 
                            initial={{ width: "0%" }}
                            animate={{ width: progressWidth }}
                            transition={{ duration: 2.5, ease: "easeInOut" }}
                        >
                             {/* Moving Scooter Indicator */}
                            <div className="absolute right-0 bottom-2 translate-x-1/2 z-20">
                                <motion.div 
                                    className="relative"
                                    animate={{ 
                                        y: [0, -1.5, 0, -1, 0], // Bumpy road
                                        rotate: [0, -2, 0] // Tilt backward slightly when moving
                                    }} 
                                    transition={{ 
                                        y: { duration: 0.3, repeat: Infinity, repeatType: "mirror" },
                                        rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                >
                                    <img 
                                        src={scooterImage} 
                                        alt="Progress Scooter" 
                                        className="w-14 h-auto drop-shadow-md z-10 relative" 
                                    />
                                    
                                    {/* Realistic Smoke/Exhaust Effect */}
                                    <div className="absolute bottom-1 -left-2 z-0">
                                         {[...Array(5)].map((_, i) => (
                                            <motion.div 
                                                key={`smoke-${i}`}
                                                className="absolute bottom-0 right-0 bg-slate-300 rounded-full blur-[2px]"
                                                style={{
                                                    width: Math.random() * 6 + 4 + 'px',
                                                    height: Math.random() * 6 + 4 + 'px',
                                                }}
                                                animate={{ 
                                                    opacity: [0.6, 0], 
                                                    x: [-2, -15 - Math.random() * 10], 
                                                    y: [-2, -5 - Math.random() * 8], 
                                                    scale: [0.5, 2] 
                                                }}
                                                transition={{ 
                                                    duration: 0.6 + Math.random() * 0.4, 
                                                    repeat: Infinity, 
                                                    delay: i * 0.15,
                                                    ease: "easeOut" 
                                                }}
                                            />
                                         ))}
                                    </div>

                                    {/* Realistic Speed Lines (Wind) */}
                                    <div className="absolute top-1/2 right-full mr-1 -translate-y-1/2 flex flex-col gap-0.5">
                                        {[...Array(3)].map((_, i) => (
                                            <motion.div 
                                                key={`speed-${i}`}
                                                className="h-[1px] bg-sky-300/80 rounded-full origin-right"
                                                style={{ 
                                                    width: 15 + Math.random() * 20 + 'px',
                                                    alignSelf: i === 1 ? 'flex-end' : 'flex-start'
                                                }}
                                                animate={{ 
                                                    scaleX: [0.5, 1.5, 0.5],
                                                    opacity: [0, 0.8, 0], 
                                                    x: [0, -15, 0] 
                                                }}
                                                transition={{ 
                                                    duration: 0.3 + Math.random() * 0.2, 
                                                    repeat: Infinity,
                                                    delay: i * 0.1
                                                }}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                    
                    {/* Steps */}
                    <div className="flex justify-between relative">
                        {renderStatusStep(1, "claim.status.submitted", existingClaim.status, t)}
                        {renderStatusStep(2, "claim.status.reviewing", existingClaim.status, t)}
                        {renderStatusStep(3, "claim.status.processing", existingClaim.status, t)}
                        {renderStatusStep(4, "claim.status.completed", existingClaim.status, t)}
                    </div>
                </div>
                )}

                {/* Estimated Time Breakdown - ซ่อนเมื่อปฏิเสธ */}
                {existingClaim.status !== 'ปฏิเสธ' && existingClaim.status !== 'rejected' && (
                <div className="mt-8 mb-8 bg-white border border-slate-200 rounded-xl p-6 shadow-sm mx-auto max-w-lg transition-all">
                    <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2 justify-center">
                        <Clock className="w-5 h-5 text-orange-500" />
                        {t("claim.estimate.title")}
                    </h3>
                    
                    {/* --- ADMIN OVERRIDE --- */}
                    {existingClaim.custom_estimate && existingClaim.custom_estimate.toString().trim() !== "" ? (
                        <div className="bg-red-50 p-6 rounded-xl border border-red-100 text-center animate-in fade-in zoom-in-95">
                             <div className="text-sm text-slate-500 mb-2">{t("claim.estimate.adminOverride")}</div>
                             <div className="text-3xl font-bold text-[#ff2500] mb-1">{existingClaim.custom_estimate}</div>
                             <div className="text-xs text-slate-400">{t("claim.estimate.adminRemark")}</div>
                        </div>
                    ) : (
                        <>
                            {/* Checking Stage */}
                            {(existingClaim.status !== 'กำลังดำเนินการ' && existingClaim.status !== 'processing' 
                            && existingClaim.status !== 'สำเร็จ' && existingClaim.status !== 'completed') && (
                                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 text-center animate-in fade-in slide-in-from-bottom-2">
                                    <div className="text-sm text-slate-500 mb-2 whitespace-pre-wrap">{t("claim.estimate.checking").split(':')[0]}: <span className="text-[#ff2500] font-bold">{t("claim.status.reviewing")}</span></div>
                                    <div className="text-3xl font-bold text-slate-800 mb-1">{getEstimatedWaitTime(existingClaim.data.problem, t).check}</div>
                                    <div className="text-xs text-slate-400">{t("claim.estimate.checkingRemark")}</div>
                                </div>
                            )}

                            {/* Processing Stage */}
                            {(existingClaim.status === 'กำลังดำเนินการ' || existingClaim.status === 'processing') && (
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center animate-in fade-in slide-in-from-bottom-2">
                                    <div className="text-sm text-slate-500 mb-2 whitespace-pre-wrap">{t("claim.estimate.processing").split(':')[0]}: <span className="text-blue-600 font-bold">{t("claim.status.processing")}</span></div>
                                    <div className="text-3xl font-bold text-slate-800 mb-1">{getEstimatedWaitTime(existingClaim.data.problem, t).process}</div>
                                    <div className="text-xs text-slate-400">{t("claim.estimate.processingRemark")}</div>
                                </div>
                            )}
                            
                            {/* Completed Stage */}
                            {(existingClaim.status === 'สำเร็จ' || existingClaim.status === 'completed') && (
                                <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center animate-in fade-in slide-in-from-bottom-2">
                                    <div className="text-sm text-slate-500 mb-2 whitespace-pre-wrap">{t("claim.estimate.completed").split(':')[0]}: <span className="text-green-600 font-bold">{t("claim.status.completed")}</span></div>
                                    <div className="text-3xl font-bold text-slate-800 mb-1">{getEstimatedWaitTime(existingClaim.data.problem, t).total}</div>
                                    <div className="text-xs text-slate-400">{t("claim.estimate.completedRemark")}</div>
                                </div>
                            )}
                        </>
                    )}
                 </div>
                )}

                <div className="mt-1 mb-6 flex justify-center">
                     <button 
                        onClick={() => onRefresh(existingClaim.ticketId)}
                        disabled={loadingStatus}
                        className="text-sm text-[#ff2500] hover:text-[#d62000] flex items-center gap-2 disabled:opacity-50"
                     >
                        <RefreshCw className={`w-4 h-4 ${loadingStatus ? "animate-spin" : ""}`} />
                        {t("claim.success.updateStatus")}
                     </button>
                </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="px-8 py-3.5 rounded-xl font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
              >
                {t("claim.success.backHome")}
              </Link>
              <button
                onClick={onClear}
                className={`px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg ${
                  existingClaim.status === 'สำเร็จ' || existingClaim.status === 'completed' ||
                  existingClaim.status === 'ปฏิเสธ' || existingClaim.status === 'rejected'
                    ? 'text-white bg-[#ff2500] hover:bg-[#d62000] shadow-orange-200'
                    : 'text-white bg-red-500 hover:bg-red-600 shadow-red-200'
                }`}
              >
                {existingClaim.status === 'สำเร็จ' || existingClaim.status === 'completed' ||
                 existingClaim.status === 'ปฏิเสธ' || existingClaim.status === 'rejected'
                  ? t("claim.success.newClaim")
                  : t("claim.success.cancelClaim")}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };
    
const ProductClaimPage = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  
  // Claim Status Logic
  const [existingClaim, setExistingClaim] = useState<ClaimData | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  
  // Claim History
  const [claimHistory, setClaimHistory] = useState<ClaimData[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,

    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      problem: "",
      date: "",
      shop_branch: "",
      image_base64: [],
      others: "",
      consent: false,
    },
  });

  const selectedProblem = watch("problem");

  // Load existing claim and history from local storage
  useEffect(() => {
    // Load current claim
    const saved = localStorage.getItem('send_claim_data');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            setExistingClaim(parsed);
            
            // Check for updates
            checkStatus(parsed.ticketId);
        } catch (e) {
            console.error("Failed to parse saved claim", e);
        }
    }
    
    // Load claim history
    const historyData = localStorage.getItem('send_claim_history');
    if (historyData) {
      try {
        setClaimHistory(JSON.parse(historyData));
      } catch (e) {
        console.error("Failed to parse claim history", e);
      }
    }
  }, []);

  // Auto-refresh status every 10 seconds
  useEffect(() => {
    if (!existingClaim) return;
    
    // Stop polling if completed
    if (existingClaim.status === 'สำเร็จ' || existingClaim.status === 'completed') return;

    const interval = setInterval(() => {
        checkStatus(existingClaim.ticketId, true);
    }, 10000); 

    return () => clearInterval(interval);
  }, [existingClaim]);

  const checkStatus = async (ticketId: string, isAuto = false) => {
    if (!isAuto) setLoadingStatus(true);
    try {
        // Fetch status from Google Script
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=check_status&ticketId=${ticketId}`);
        const data = await response.json();
        
        if (data && data.status) {
            const prevStatus = existingClaim?.status;
            const statusChanged = prevStatus !== data.status;
            const estimateChanged = existingClaim?.custom_estimate !== data.custom_estimate;
            const reasonChanged = existingClaim?.rejection_reason !== data.rejection_reason;

            if (statusChanged || estimateChanged || reasonChanged) {
                // Update state
                setExistingClaim(prev => ({ 
                    ...prev!, 
                    status: data.status, 
                    custom_estimate: data.custom_estimate, 
                    rejection_reason: data.rejection_reason 
                }));

                // Toast notification when status changes during auto-poll (outside setState)
                if (isAuto && statusChanged) {
                    toast({
                        title: "สถานะมีการอัปเดต",
                        description: `สถานะล่าสุด: ${data.status}`,
                        variant: "success"
                    });
                }

                // Update local storage
                const current = localStorage.getItem('send_claim_data');
                if (current) {
                    const parsed = JSON.parse(current);
                    parsed.status = data.status;
                    parsed.custom_estimate = data.custom_estimate;
                    parsed.rejection_reason = data.rejection_reason;
                    localStorage.setItem('send_claim_data', JSON.stringify(parsed));
                }
            }
        }
    } catch (error) {
        console.error("Error fetching status:", error);
    } finally {
        if (!isAuto) setLoadingStatus(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxImages = 5;
    const remainingSlots = maxImages - imagePreview.length;

    if (remainingSlots <= 0) {
      toast({ title: "ถึงจำนวนสูงสุดแล้ว", description: "สามารถอัปโหลดได้สูงสุด 5 รูป", variant: "destructive" });
      return;
    }

    const validFiles = Array.from(files).slice(0, remainingSlots).filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "ไฟล์ใหญ่เกินไป", description: `${file.name} เกิน 5MB`, variant: "destructive" });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newImages = await Promise.all(
      validFiles.map(file => new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      }))
    );

    const allImages = [...imagePreview, ...newImages];
    setImagePreview(allImages);
    setValue("image_base64", allImages);
  };

  const handleNextStep = async () => {
    const isValid = await trigger(["name", "phone", "email", "problem"]);
    if (isValid) {
      setStep(2);
      window.scrollTo({ top: document.getElementById('form')?.offsetTop || 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setStep(1);
    window.scrollTo({ top: document.getElementById('form')?.offsetTop || 0, behavior: 'smooth' });
  };

  const generateTicketId = () => {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000); // 4 digit random
    return `SENd-${year}-${random}`;
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const ticketId = generateTicketId();

    try {
      // Prepare payload with Ticket ID
      const payload = {
        ...data,
        ticketId,
        status: 'รับเรื่องแล้ว',
        timestamp: new Date().toISOString()
      };

      // ใช้ no-cors mode จะได้ opaque response
      // ถ้า fetch สำเร็จ (ไม่มี network error) ถือว่าส่งได้
      await fetch(
        GOOGLE_SCRIPT_URL,
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      // ถ้ามาถึงตรงนี้ = fetch สำเร็จ (ข้อมูลส่งไปแล้ว)
      // no-cors จะได้ response.type === "opaque" และ status === 0
      // แต่ถือว่าสำเร็จถ้าไม่ throw error

      // Save to local storage (ไม่เก็บ image เพราะใหญ่เกินไป)
      const { image_base64, ...dataWithoutImages } = data;
      const claimData: ClaimData = {
        ticketId,
        status: 'รับเรื่องแล้ว',
        timestamp: Date.now(),
        data: dataWithoutImages as FormData
      };
      localStorage.setItem('send_claim_data', JSON.stringify(claimData));
      setExistingClaim(claimData);

      toast({
        title: "ส่งรายงานสำเร็จ",
        description: `Ticket ID: ${ticketId}`,
        variant: "success",
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งรายงานได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // บันทึก claim ลงประวัติ
  const saveToHistory = (claim: ClaimData) => {
    const history = JSON.parse(localStorage.getItem('send_claim_history') || '[]');
    // ตรวจสอบว่ามีอยู่แล้วหรือไม่
    const exists = history.some((h: ClaimData) => h.ticketId === claim.ticketId);
    if (!exists) {
      history.unshift(claim); // เพิ่มใหม่ไว้ข้างหน้า
      // เก็บแค่ 10 รายการล่าสุด
      const trimmed = history.slice(0, 10);
      localStorage.setItem('send_claim_history', JSON.stringify(trimmed));
      setClaimHistory(trimmed);
    }
  };

  const handleClearClaim = async () => {
    const isCompleted = existingClaim?.status === 'สำเร็จ' || existingClaim?.status === 'completed';
    const isRejected = existingClaim?.status === 'ปฏิเสธ' || existingClaim?.status === 'rejected';
    const isCancelled = existingClaim?.status === 'ยกเลิก';
    
    // ถ้าสำเร็จ/ปฏิเสธ/ยกเลิกแล้ว ไม่ต้องกรอกเหตุผล
    if (isCompleted || isRejected || isCancelled) {
      if (window.confirm("คุณต้องการแจ้งเรื่องใหม่ใช่หรือไม่?")) {
        // บันทึกลงประวัติก่อนเคลียร์
        if (existingClaim) {
          saveToHistory(existingClaim);
        }
        localStorage.removeItem('send_claim_data');
        window.location.reload();
      }
      return;
    }
    
    // กรอกเหตุผลก่อนยกเลิก
    const reason = window.prompt(
      "กรุณาระบุเหตุผลที่ต้องการยกเลิก:",
      "ต้องการแจ้งเรื่องใหม่"
    );
    
    // ถ้ากด Cancel (reason === null) ไม่ดำเนินการ
    if (reason === null) return;
    
    // ส่งเหตุผลไปยัง API
    if (existingClaim) {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'cancel_claim',
            ticketId: existingClaim.ticketId,
            reason: reason.trim() || 'ไม่ระบุเหตุผล'
          })
        });
        
        // บันทึกลงประวัติพร้อมสถานะยกเลิก
        saveToHistory({ ...existingClaim, status: 'ยกเลิก' });
      } catch (error) {
        console.error("Error cancelling claim:", error);
      }
    }
    
    localStorage.removeItem('send_claim_data');
    window.location.reload();
  };

  const { t } = useTranslation();

  // If claim exists, show success view
  if (existingClaim) {
      return (
        <SuccessView 
            existingClaim={existingClaim} 
            onClear={handleClearClaim} 
            onRefresh={(id) => checkStatus(id)} 
            loadingStatus={loadingStatus} 
        />
      );
  }

  // Otherwise show form
  return (
    <>
    <div className="min-h-screen bg-[#F8F9FB]">
        
      <HeroSection />

      <section id="form" className="py-20 px-4 relative overflow-hidden">
        {/* Animated Gradient Background */}
         <div className="absolute inset-0 bg-[#FFF5F2]">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-100/50 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-red-100/50 via-transparent to-transparent"></div>
            
            {/* Animated Blobs */}
            <motion.div 
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-3xl opacity-60"
            />
            <motion.div 
                animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-gradient-to-tr from-[#ff2500]/10 to-orange-300/20 rounded-full blur-3xl opacity-60"
            />

            {/* 🫧 Laundry Theme Background Effects */}
            
            {/* Rising Soap Bubbles - More Visible */}
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={`bubble-${i}`}
                    className="absolute rounded-full border border-blue-200/60 bg-white/40 shadow-sm backdrop-blur-[1px]"
                    style={{
                        width: Math.random() * 30 + 15 + 'px',
                        height: Math.random() * 30 + 15 + 'px',
                        left: `${Math.random() * 100}%`,
                        bottom: '-20%',
                        zIndex: 1, // Ensure visibility
                    }}
                    animate={{
                        y: -1200,
                        x: [0, Math.random() * 100 - 50, 0],
                        opacity: [0, 0.6, 0], // Increased opacity
                        scale: [0.5, 1.1, 1.2],
                    }}
                    transition={{
                        duration: Math.random() * 15 + 20,
                        repeat: Infinity,
                        delay: Math.random() * 10,
                        ease: "linear",
                    }}
                />
            ))}

            {/* Floating Water Droplets - More Visible */}
            {[...Array(10)].map((_, i) => (
                <motion.div
                    key={`droplet-${i}`}
                    className="absolute w-3 h-3 bg-blue-400/40 rounded-full blur-[0.5px] shadow-sm"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        zIndex: 1,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.3, 0.7, 0.3], // Increased opacity
                        scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 3,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Clean Sparkles - More Visible */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={`clean-sparkle-${i}`}
                    className="absolute text-orange-400/50" // Darker orange
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 80}%`,
                        zIndex: 1,
                    }}
                    animate={{
                        scale: [0, 1.3, 0],
                        rotate: [0, 45, 90],
                        opacity: [0, 0.8, 0],
                    }}
                    transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: "easeInOut",
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                    </svg>
                </motion.div>
            ))}
            
            {/* Subtle Spinning Washer/Pattern Elements - More Visible */}
            <motion.div 
                className="absolute top-[15%] left-[8%] text-blue-200/20 pointer-events-none" // Increased opacity and changed to blue
                style={{ zIndex: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
                 <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v12" strokeDasharray="2 2" />
                    <path d="M6 12h12" strokeDasharray="2 2" />
                 </svg>
            </motion.div>
            
            <motion.div 
                className="absolute bottom-[20%] right-[5%] text-orange-200/20 pointer-events-none" // Increased opacity
                style={{ zIndex: 0 }}
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
                 <svg width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <circle cx="12" cy="12" r="8" />
                    <path d="M12 2v2" /><path d="M12 20v2" />
                    <path d="M22 12h-2" /><path d="M4 12H2" />
                    <path d="M19.07 4.93L17.66 6.34" /><path d="M6.34 17.66L4.93 19.07" />
                    <path d="M19.07 19.07L17.66 17.66" /><path d="M6.34 6.34L4.93 4.93" />
                 </svg>
            </motion.div>
        </div>

        {/* Animated Scooter - Bumpy Ride on Realistic Road */}
        <div className="absolute inset-x-0 bottom-0 overflow-hidden pointer-events-none z-0 h-44 flex items-end">
             {/* Realistic Road */}
             <div className="w-full h-16 bg-slate-700 relative flex items-center shadow-lg transform -skew-x-12 scale-110 origin-bottom">
                {/* Road Surfaces */}
                <div className="absolute top-0 w-full h-[2px] bg-slate-600"></div>
                <div className="absolute bottom-0 w-full h-[4px] bg-slate-800"></div>
                
                {/* Center Lines - Animated */}
                <div className="w-full flex justify-between gap-12 animate-road-move px-4">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="w-12 h-2 bg-white/40 rounded-full shrink-0"></div>
                    ))}
                </div>
             </div>
             
             <motion.div
                className="absolute bottom-3 left-0 w-32 md:w-44 z-10"
                initial={{ x: "-20%" }}
                animate={{ 
                    x: "120vw",
                    y: [0, -2, 1, -1, 0, -3, 0], // Bumpy y-axis
                    rotate: [0, -1, 1, -1, 0.5, 0] 
                }}
                transition={{ 
                    x: {
                        duration: 18, 
                        repeat: Infinity, 
                        ease: "linear", 
                        delay: 0
                    },
                    y: {
                        duration: 2,
                        repeat: Infinity, 
                        ease: "easeInOut",
                        repeatType: "mirror"
                    },
                    rotate: {
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear"
                    }
                }}
             >
                <img src={scooterImage} alt="SENd Scooter" className="w-full h-auto drop-shadow-xl" />
                
                {/* Dust/Smoke Effect */}
                <div className="absolute bottom-2 -left-2 flex space-x-1">
                     <motion.div 
                        className="w-3 h-3 bg-white/20 rounded-full blur-[2px]"
                        animate={{ opacity: [0, 0.5, 0], x: [-5, -15], y: [-5, -15], scale: [0.5, 1.5] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                    />
                     <motion.div 
                        className="w-2 h-2 bg-white/30 rounded-full blur-[1px]"
                        animate={{ opacity: [0, 0.6, 0], x: [-2, -10], y: [-2, -8], scale: [0.5, 1.2] }}
                        transition={{ duration: 0.7, repeat: Infinity, delay: 0.3 }}
                    />
                </div>
             </motion.div>
        </div>

        <div className="container mx-auto max-w-2xl relative z-10">
            {/* ประวัติการแจ้งเคลม - อยู่เหนือ Step Indicator */}
            {claimHistory.length > 0 && (
              <div className="mb-8">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200 hover:bg-white transition-colors"
                >
                  <span className="flex items-center gap-2 text-slate-700 font-medium">
                    <Clock className="w-5 h-5 text-slate-400" />
                    {t("claim.historyTitle")} ({claimHistory.length})
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
                </button>
                
                {showHistory && (
                  <div className="mt-3 space-y-2">
                    {claimHistory.map((claim, index) => (
                      <div 
                        key={claim.ticketId || index}
                        className="p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-sm font-bold text-[#ff2500]">
                            {claim.ticketId}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            claim.status === 'สำเร็จ' || claim.status === 'completed' 
                              ? 'bg-green-100 text-green-700' 
                              : claim.status === 'ปฏิเสธ' || claim.status === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : claim.status === 'ยกเลิก'
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {claim.status === 'สำเร็จ' || claim.status === 'completed' ? t("claim.status.completed") :
                             claim.status === 'ปฏิเสธ' || claim.status === 'rejected' ? t("claim.status.rejected") :
                             claim.status === 'ยกเลิก' ? t("claim.status.cancelled") :
                             claim.status === 'กำลังตรวจสอบ' || claim.status === 'reviewing' ? t("claim.status.reviewing") :
                             claim.status === 'กำลังดำเนินการ' || claim.status === 'processing' ? t("claim.status.processing") :
                             t("claim.status.submitted")}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">
                          {claim.data?.problem || '-'}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(claim.timestamp).toLocaleDateString('th-TH', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                        {claim.rejection_reason && (
                          <p className="text-xs text-red-500 mt-1">
                            {t("claim.rejected.reason")} {claim.rejection_reason}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-10">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= 1 ? "bg-[#ff2500] text-white" : "bg-slate-200 text-slate-500"}`}>
                1
                </div>
                <div className="flex items-center gap-1 px-4">
                {[...Array(4)].map((_, i) => (
                    <div 
                    key={i} 
                    className={`w-3 h-1 rounded-full transition-colors duration-300 ${step >= 2 ? "bg-[#ff2500]" : "bg-slate-200"}`} 
                    />
                ))}
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= 2 ? "bg-[#ff2500] text-white" : "bg-slate-200 text-slate-500"}`}>
                2
                </div>
            </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
            {step === 1 && (
                <div className="space-y-6">
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    {t("claim.formTitle")}
                    </h3>
                    <p className="text-slate-500">
                    {t("claim.formDesc")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                        {t("claim.fields.name")} <span className="text-red-500">*</span>
                        </label>
                        <input
                        type="text"
                        {...register("name")}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500] transition-all"
                        placeholder={t("claim.fields.namePlaceholder")}
                        />
                        {errors.name && (
                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4" />
                            {errors.name ? (errors.name.message === "กรุณากรอกชื่อ-นามสกุล" ? t("claim.validation.name") : errors.name.message) : ""}
                        </p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                        {t("claim.fields.phone")} <span className="text-red-500">*</span>
                        </label>
                        <input
                        type="tel"
                        {...register("phone")}
                        maxLength={10}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500] transition-all"
                        placeholder={t("claim.fields.phonePlaceholder")}
                        />
                        {errors.phone && (
                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4" />
                            {errors.phone ? (
                                errors.phone.message === "เบอร์โทรศัพท์ต้องมี 10 หลัก" ? t("claim.validation.phoneLength") : 
                                errors.phone.message === "กรุณากรอกเฉพาะตัวเลข" ? t("claim.validation.phoneNum") :
                                errors.phone.message
                            ) : ""}
                        </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                        {t("claim.fields.email")} <span className="text-red-500">*</span>
                        </label>
                        <input
                        type="email"
                        {...register("email")}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500] transition-all"
                        placeholder={t("claim.fields.emailPlaceholder")}
                        />
                        {errors.email && (
                        <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4" />
                            {errors.email ? (errors.email.message === "กรุณากรอกอีเมลที่ถูกต้อง" ? t("claim.validation.email") : errors.email.message) : ""}
                        </p>
                        )}
                    </div>
                </div>

                {/* Problem Selection */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                    {t("claim.fields.problem")} <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                    {problemOptions.map((problem) => {
                        // เสื้อผ้าสูญหาย และ เสื้อผ้าชำรุด เป็นสีแดง
                        const isRedProblem = problem.value === "เสื้อผ้าสูญหาย" || problem.value === "เสื้อผ้าชำรุด";
                        // ผ้าไม่สะอาด และ ผ้าอบไม่แห้ง เป็นสีส้ม
                        const isOrangeProblem = problem.value === "ผ้าไม่สะอาด" || problem.value === "ผ้าอบไม่แห้ง";
                        // ไฟดับ และ เครื่องซักมีปัญหา เป็นสีแอมเบอร์
                        const isAmberProblem = problem.value === "ไฟดับ" || problem.value === "เครื่องซักมีปัญหา";
                        
                        const getStyleClasses = () => {
                          if (selectedProblem === problem.value) {
                            if (isRedProblem) {
                              return "border-red-500 bg-red-50 ring-2 ring-red-200";
                            } else if (isOrangeProblem) {
                              return "border-orange-400 bg-orange-50/50 ring-2 ring-orange-100";
                            } else if (isAmberProblem) {
                              return "border-amber-300 bg-amber-50/50 ring-2 ring-amber-100";
                            }
                            return "border-slate-400 bg-slate-50 ring-2 ring-slate-200";
                          }
                          
                          if (isRedProblem) {
                            return "border-red-200 bg-red-50/30 hover:border-red-400 hover:bg-red-50";
                          } else if (isOrangeProblem) {
                            return "border-orange-200/60 bg-orange-50/20 hover:border-orange-400 hover:bg-orange-50/40";
                          } else if (isAmberProblem) {
                            return "border-amber-200/60 bg-amber-50/20 hover:border-amber-300 hover:bg-amber-50/40";
                          }
                          return "border-slate-200 bg-slate-50/20 hover:border-slate-300 hover:bg-slate-50/40";
                        };
                        
                        const getTextColor = () => {
                          if (selectedProblem === problem.value) {
                            if (isRedProblem) return "text-red-600 font-semibold";
                            if (isOrangeProblem) return "text-orange-600 font-semibold";
                            if (isAmberProblem) return "text-amber-700 font-semibold";
                            return "text-slate-700 font-semibold";
                          }
                          if (isRedProblem) return "text-red-600";
                          if (isOrangeProblem) return "text-orange-500";
                          if (isAmberProblem) return "text-amber-600/80";
                          return "text-slate-500";
                        };
                        
                        const getCheckColor = () => {
                          if (isRedProblem) return "text-red-500";
                          if (isOrangeProblem) return "text-orange-500";
                          if (isAmberProblem) return "text-amber-500";
                          return "text-slate-400";
                        };
                        
                        return (
                          <label
                            key={problem.value}
                            className={`relative flex items-center justify-center py-3 px-4 rounded-xl border-2 cursor-pointer transition-all duration-200 h-14 ${getStyleClasses()}`}
                          >
                            <input
                              type="radio"
                              {...register("problem")}
                              value={problem.value}
                              className="sr-only"
                            />
                            <span className={`text-sm font-medium ${getTextColor()}`}>
                              {t(problem.key)}
                            </span>
                            {selectedProblem === problem.value && (
                              <CheckCircle2 className={`absolute top-2 right-2 w-4 h-4 ${getCheckColor()}`} />
                            )}
                          </label>
                        );
                    })}
                    </div>

                    {/* Others Input */}
                    {selectedProblem === "อื่นๆ" && (
                         <div className="mt-3 animate-in fade-in slide-in-from-top-1">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                {t("claim.fields.others")} <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                {...register("others")} 
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500] transition-all"
                                placeholder={t("claim.fields.othersPlaceholder")} 
                            />
                         </div>
                    )}

                    {errors.problem && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" />
                        {errors.problem ? (errors.problem.message === "กรุณาเลือกปัญหา" ? t("claim.validation.problem") : errors.problem.message) : ""}
                    </p>
                    )}
                </div>

                {/* Next Button */}
                <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 mt-4"
                >
                    {t("claim.fields.nextBtn")}
                    <ChevronRight className="w-5 h-5" />
                </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6">
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    {t("claim.step2Title")}
                    </h3>
                    <p className="text-slate-500">
                    {t("claim.step2Desc")}
                    </p>
                </div>

                {/* Date */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t("claim.fields.date")} <span className="text-red-500">*</span>
                    </label>
                    <input
                    type="date"
                    {...register("date")}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500] transition-all"
                    />
                    {errors.date && (
                    <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" />
                        {errors.date ? (errors.date.message === "กรุณาเลือกวันที่" ? t("claim.validation.date") : errors.date.message) : ""}
                    </p>
                    )}
                </div>

                {/* Shop Branch */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t("claim.fields.shopBox")} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            {...register("shop_branch")}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500] transition-all appearance-none bg-white font-medium text-slate-700"
                            defaultValue=""
                        >
                            <option value="" disabled>{t("claim.fields.shopBoxPlaceholder")}</option>
                            {stores.map((store) => (
                                <option key={store.id} value={store.name}>
                                    {store.name}
                                </option>
                            ))}
                        </select>
                         <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                             <ChevronDown className="w-5 h-5" />
                        </div>
                    </div>
                    {errors.shop_branch && (
                    <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" />
                        {errors.shop_branch ? (errors.shop_branch.message === "กรุณากรอกชื่อร้าน-สาขา" ? t("claim.validation.shop") : errors.shop_branch.message) : ""}
                    </p>
                    )}
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t("claim.fields.images")}
                    </label>
                    
                    {/* Image Gallery */}
                    {imagePreview.length > 0 && (
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        {imagePreview.map((img, index) => (
                          <div key={index} className="relative rounded-xl overflow-hidden border border-slate-200 aspect-square">
                            <img src={img} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = imagePreview.filter((_, i) => i !== index);
                                setImagePreview(updated);
                                setValue("image_base64", updated);
                              }}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload Button */}
                    {imagePreview.length < 5 && (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-[#ff2500] hover:bg-orange-50 transition-all duration-200 bg-slate-50">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm text-[#ff2500]">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          {imagePreview.length > 0 ? t("claim.fields.images") : t("claim.fields.imagesDesc")}
                        </span>
                        <span className="text-xs text-slate-400 mt-1">
                          ({imagePreview.length}/5, max 5MB/file)
                        </span>
                        <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                      </label>
                    )}
                </div>

                {/* Others */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t("claim.fields.others")}
                    </label>
                    <textarea
                    {...register("others")}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff2500]/20 focus:border-[#ff2500] transition-all resize-none"
                    placeholder="อธิบายรายละเอียดเพิ่มเติมเกี่ยวกับปัญหาที่พบ..."
                    />
                </div>

                {/* Consent Checkbox */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input 
                            type="checkbox" 
                            {...register("consent")}
                            className="mt-1 w-5 h-5 rounded border-slate-300 text-[#ff2500] focus:ring-[#ff2500]" 
                        />
                        <span className="text-sm text-slate-600 leading-relaxed">
                            {t("claim.fields.consent")}
                        </span>
                    </label>
                    {errors.consent && (
                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5 ml-8">
                            <AlertCircle className="w-4 h-4" />
                            {errors.consent ? (errors.consent.message === "กรุณายืนยันข้อมูล" ? t("claim.validation.consent") : errors.consent.message) : ""}
                        </p>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={handlePrevStep}
                        className="w-1/3 py-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        {t("claim.fields.prevBtn")}
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-4 bg-[#ff2500] text-white rounded-xl font-bold hover:bg-[#d62000] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
                    >
                        {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {t("claim.fields.submitting")}
                        </>
                        ) : (
                        <>
                            {t("claim.fields.submitBtn")}
                            <Send className="w-5 h-5" />
                        </>
                        )}
                    </button>
                </div>
                </div>
            )}
            </form>
        </div>
      </section>
    </div>
    
    {/* ปุ่มลอย LINE */}
    <LineFloatingButton />
    </>
  );
};

export default ProductClaimPage;
