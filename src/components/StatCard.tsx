import { Arrow } from "@/components/ui/SvgIcons";
import {
  getThemeBorderClasses,
  getThemeCardClasses,
  getThemeClasses,
  getThemeTextClasses,
} from "@/utils/themeClasses";
import { useTheme } from "@/contexts/ThemeContext";

export interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "green" | "yellow" | "red" | "purple";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

// Card component for displaying a single statistic with icon, value, and optional trend
export default function StatCard({
  title,
  value,
  icon,
  color,
  trend,
}: StatCardProps) {
  const { theme } = useTheme();
  const bgClassBlue = getThemeClasses("bg-blue-50", "bg-blue-900/20", theme);
  const textClassBlue = getThemeClasses(
    "text-blue-600",
    "text-blue-400",
    theme,
  );

  const bgClassGreen = getThemeClasses("bg-green-50", "bg-green-900/20", theme);
  const textClassGreen = getThemeClasses(
    "text-green-600",
    "text-green-400",
    theme,
  );

  const bgClassYellow = getThemeClasses(
    "bg-yellow-50",
    "bg-yellow-900/20",
    theme,
  );
  const textClassYellow = getThemeClasses(
    "text-yellow-600",
    "text-yellow-400",
    theme,
  );

  const bgClassRed = getThemeClasses("bg-red-50", "bg-red-900/20", theme);
  const textClassRed = getThemeClasses("text-red-600", "text-red-400", theme);

  const bgClassPurple = getThemeClasses(
    "bg-purple-50",
    "bg-purple-900/20",
    theme,
  );
  const textClassPurple = getThemeClasses(
    "text-purple-600",
    "text-purple-400",
    theme,
  );

  const colorClasses = {
    blue: `${bgClassBlue} ${textClassBlue}`,
    green: `${bgClassGreen} ${textClassGreen}`,
    yellow: `${bgClassYellow} ${textClassYellow}`,
    red: `${bgClassRed} ${textClassRed}`,
    purple: `${bgClassPurple} ${textClassPurple}`,
  };

  return (
    <div
      className={`${getThemeCardClasses(theme)} rounded-lg shadow-sm border ${getThemeBorderClasses(theme)}`}
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-md ${colorClasses[color]}`}>
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt
                className={`text-sm font-medium ${getThemeTextClasses(theme)} truncate`}
              >
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div
                  className={`text-3xl font-bold ${getThemeTextClasses(theme)}`}
                >
                  {value}
                </div>
                {trend && (
                  <div
                    className={`ml-2 flex items-baseline text-sm font-semibold ${
                      trend.isPositive
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    <Arrow
                      className={`self-center flex-shrink-0 h-4 w-4 ${
                        trend.isPositive ? "rotate-0" : "rotate-180"
                      }`}
                    />
                    <span className="sr-only">
                      {trend.isPositive ? "Increased" : "Decreased"} by
                    </span>
                    {Math.abs(trend.value)}%
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
