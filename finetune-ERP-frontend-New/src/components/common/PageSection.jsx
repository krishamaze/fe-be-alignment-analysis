export default function PageSection({
  children,
  className = '',
  withBottom = false,
  style = {},
  ...props
}) {
  // Always use vh-min so PageSection doesn’t resize when address bar hides/unhides
  const minHeight = `calc(var(--vh-min) - var(--topbar-h) - var(--mainnav-h)${
    withBottom ? ' - var(--bottombar-h)' : ''
  })`;

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
