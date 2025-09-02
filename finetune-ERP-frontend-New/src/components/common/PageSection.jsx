export default function PageSection({
  children,
  className = '',
  withBottom = false,
  style = {},
  ...props
}) {
  // Full height under topbar + mainnav
  const minHeight = `calc(var(--vh) - var(--topbar-h) - var(--mainnav-h))`;

  return (
    <section
      data-pagesection
      className={`relative ${className}`}
      style={{ minHeight, ...style }}
      {...props}
    >
      <div className={withBottom ? 'pb-[var(--bottombar-h)]' : ''}>
        {children}
      </div>
    </section>
  );
}
