import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline-light" | "outline-dark" | "ghost-dark" | "ghost-light";
type Size = "default" | "large";

/*
 * Sharp-cornered, letter-spaced CTA system. Luxury restraint: no radius,
 * no shadows, no gradients — hierarchy comes from fill vs. hairline
 * outline vs. quiet text, and a single unhurried hover transition.
 */
const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-[0.6875rem] font-semibold uppercase tracking-[0.22em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  "outline-light": "border border-white/60 text-white hover:border-white hover:bg-white hover:text-night",
  "outline-dark": "border border-ink/25 text-ink hover:border-brand hover:text-brand",
  "ghost-dark": "text-mist hover:text-white",
  "ghost-light": "text-ink-muted hover:text-brand",
};

const sizes: Record<Size, string> = {
  default: "px-7 py-3.5",
  large: "px-10 py-[1.125rem] text-xs tracking-[0.24em]",
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
