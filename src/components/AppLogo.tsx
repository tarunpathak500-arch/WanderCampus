import React from 'react';

interface AppLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  subtitle?: string;
  variant?: 'light' | 'dark';
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showText = true,
  subtitle = '600-Acre Lost & Found Network',
  variant = 'light',
  className = '',
}) => {
  const sizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const titleSizeMap = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Circular Emblem Container with Golden Rim matching the Wander Campus crest */}
      <div
        className={`${sizeMap[size]} shrink-0 rounded-full overflow-hidden p-0.5 bg-gradient-to-br from-amber-400 via-emerald-700 to-emerald-950 shadow-md shadow-emerald-950/20 ring-1 ring-amber-400/50 flex items-center justify-center`}
      >
        <img
          src="/assets/aistudio/logo_958dd360.png"
          alt="Wander Campus Logo"
          className="w-full h-full object-cover rounded-full"
          loading="eager"
        />
      </div>

      {showText && (
        <div className="flex flex-col text-left leading-tight">
          <div className="flex items-center gap-2">
            <span
              className={`font-black tracking-tight uppercase ${titleSizeMap[size]} ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
              style={{ letterSpacing: '-0.02em' }}
            >
              Wander Campus
            </span>
            <span className="hidden sm:inline-block text-[9.5px] font-bold text-amber-800 bg-amber-50 border border-amber-300/80 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">
              Official
            </span>
          </div>
          {subtitle && (
            <span
              className={`text-[10.5px] font-medium tracking-wide mt-0.5 font-mono ${
                isDark ? 'text-emerald-300/80' : 'text-emerald-800/80'
              }`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
