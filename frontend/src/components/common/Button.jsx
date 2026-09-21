const VARIANT_CLASS_MAP = {
  default: "btn btn-primary",
  outline: "btn btn-secondary",
  text: "btn btn-text",
  fab: "fab",
  miniNav : "mini-nav"
};

export default function Button({
  variant = "default",
  className = "",
  children,
  ...rest
}) {
  const baseClass = VARIANT_CLASS_MAP[variant] ?? VARIANT_CLASS_MAP.primary;
  const combinedClass = className ? `${baseClass} ${className}` : baseClass;

  return (
    <button className={combinedClass} {...rest}>
      {children}
    </button>
  );
}
