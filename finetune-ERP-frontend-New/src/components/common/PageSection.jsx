export default function PageSection({
  children,
  className = '',
  withBottom = false,
  style = {},
  ...props
}) {
  const minHeight = `calc(100% - var(--topbar-h) - var(--mainnav-h)${
    withBottom ? ' - var(--bottombar-h)' : ''
  })`;

  return (
    <section
      className={`${className} relative`}
      style={{
        minHeight,
        paddingBottom: 'env(safe-area-inset-bottom)',
        ...style,
      }}
      {...props}
    >
      {children}
    </section>
  );
}
