import {
  getThemeBorderClasses,
  getThemeCardClasses,
  getThemeTextClasses,
} from "@/utils/themeClasses";
import { useTheme } from "@/contexts/ThemeContext";

export const StatCard = ({
  title,
  value,
  className = "",
}: {
  title: string;
  value: string | number;
  className?: string;
}) => {
  const { theme } = useTheme();
  return (
    <div
      className={`${getThemeCardClasses(theme)} rounded-lg shadow-sm border ${getThemeBorderClasses(theme)} p-5 ${className}`}
    >
      <p
        className={`text-sm font-bold ${getThemeTextClasses(theme)} text-center sm:text-left`}
      >
        {title}
      </p>
      <p
        className={`mt-1 text-3xl font-bold ${getThemeTextClasses(theme)} text-center sm:text-left`}
      >
        {value}
      </p>
    </div>
  );
};
