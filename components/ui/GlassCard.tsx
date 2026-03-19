import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'primary' | 'secondary' | 'none';
  interactive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  glowColor = 'none',
  interactive = false,
  ...props
}) => {
  const baseStyle = "glass-panel rounded-xl p-6 transition-all duration-300 relative overflow-hidden border border-primary/25";
  
  const glows = {
    primary: "hover:border-primary/70 hover:shadow-[0_0_14px_rgba(194,150,62,0.22)]",
    secondary: "hover:border-secondary/70 hover:shadow-[0_0_14px_rgba(138,106,42,0.2)]",
    none: "border-white/5"
  };

  const interactiveStyle = interactive ? "cursor-pointer hover:-translate-y-1" : "";

  return (
    <div 
        className={`${baseStyle} ${glows[glowColor]} ${interactiveStyle} ${className}`}
        {...props}
    >
      {children}
    </div>
  );
};