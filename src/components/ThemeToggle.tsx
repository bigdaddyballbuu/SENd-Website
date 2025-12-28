import { Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 rounded-full bg-black/10 dark:bg-white/10 p-1">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-full transition ${
          theme === "light" && "bg-white dark:bg-slate-800 shadow"
        }`}
      >
        <Sun size={16} />
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-full transition ${
          theme === "dark" && "bg-white dark:bg-slate-800 shadow"
        }`}
      >
        <Moon size={16} />
      </button>
    </div>
  );
}
