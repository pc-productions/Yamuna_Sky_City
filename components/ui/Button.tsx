import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline-light" | "outline-dark" | "ghost-dark" | "ghost-light";
type Size = "default" | "large";

/*
 * Brand CTA system: refined rectangular geometry (no radius, no shadows,
 * no gradients), Poppins labels in uppercase. Hierarchy comes from the
 * SkyCity Ember fill vs. hairline outline vs. quiet text, with a single
 * unhurried hover transition.
 */
const base =
  "font-display inline-flex items-center justify-center gap-2 whitespace-nowrap text-[0.6875rem] font-semibold uppercase tracking-[0.1em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-paper hover:bg-brand-dark",
  "outline-light": "border border-paper/70 text-paper hover:border-paper hover:bg-paper hover:text-ink",
  "outline-dark": "border border-ink/30 text-ink hover:border-brand hover:text-brand",
  "ghost-dark": "text-paper/90 hover:text-paper",
  "ghost-light": "text-ink-muted hover:text-brand",
};

const sizes: Record<Size, string> = {
  default: "px-5 py-3 sm:px-7 sm:py-3.5",
  large: "px-7 py-3.5 sm:px-10 sm:py-[1.125rem] text-xs tracking-[0.12em]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsAnchor = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: ButtonAsButton | ButtonAsAnchor) {
  const { variant = "primary", size = "default", className = "", children, ...rest } = props;
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if ("href" in props && props.href) {
    const isExternal = /^https?:\/\//.test(props.href);
    const anchorRest = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        {...anchorRest}
        href={props.href}
        className={classes}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button {...buttonRest} className={classes}>
      {children}
    </button>
  );
}
