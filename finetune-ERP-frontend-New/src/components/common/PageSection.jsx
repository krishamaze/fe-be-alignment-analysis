export default function PageSection({
  children,
  className = '',
  withBottom = false,
  style = {},
  ...props
}) {
  const minHeight = `calc(var(--vh) - var(--topbar-h) - var(--mainnav-h)${
    withBottom ? ' - var(--bottombar-h)' : ''
  })`;
  return (
    <section className={className} style={{ minHeight, ...style }} {...props}>
      {children}
    </section>
  );
}
