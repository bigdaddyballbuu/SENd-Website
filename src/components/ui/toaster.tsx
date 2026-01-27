// src/components/ui/toaster.tsx
import { useToast } from "../../hooks/use-toast";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-0 right-0 p-4 sm:p-6 md:p-8 flex flex-col gap-2 w-full max-w-[420px] z-[9999] pointer-events-none">
      <AnimatePresence>
        {toasts.filter(t => t.open).map(function ({ id, title, description, action, variant }) {
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              layout
              className={`
                pointer-events-auto
                relative overflow-hidden rounded-xl border p-4 shadow-lg pr-12
                ${
                  variant === "destructive"
                    ? "bg-red-50 border-red-200 text-red-900"
                    : variant === "success"
                    ? "bg-green-50 border-green-200 text-green-900" 
                    : "bg-white border-slate-200 text-slate-900"
                }
              `}
            >
              <div className="flex gap-3">
                {variant === "success" ? (
                   <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                ) : variant === "destructive" ? (
                   <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                ) : (
                   <Info className="w-5 h-5 text-slate-600 mt-0.5 shrink-0" />
                )}
                
                <div className="grid gap-1">
                  {title && <div className="font-semibold text-sm">{title}</div>}
                  {description && (
                    <div className="text-sm opacity-90 leading-relaxed">
                      {description}
                    </div>
                  )}
                </div>
              </div>

              {action}
              
              <button
                onClick={() => dismiss(id)}
                className={`
                    absolute top-3 right-3 p-1 rounded-md transition-colors
                    ${variant === "destructive" ? "hover:bg-red-200/50 text-red-500" : ""}
                    ${variant === "success" ? "hover:bg-green-200/50 text-green-500" : ""}
                    ${!variant ? "hover:bg-slate-100 text-slate-400" : ""}
                `}
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
