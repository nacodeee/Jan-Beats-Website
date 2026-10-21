export function Button({ children, variant = 'primary', size, className = '', ...props }) {
  const cls = `${variant} ${className}`.trim();
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
