import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-[11px] sm:px-[27px] lg:px-[51px] ${className}`}>
      {children}
    </div>
  );
}
