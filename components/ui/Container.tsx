import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-[21px] sm:px-[37px] lg:px-[61px] ${className}`}>
      {children}
    </div>
  );
}
