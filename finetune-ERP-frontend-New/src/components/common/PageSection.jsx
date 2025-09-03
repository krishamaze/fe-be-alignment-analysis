export default function PageSection({
  children,
  className = '',
  withBottom = false,
  style = {},
  ...props
}) {
  const minHeight = `calc(100dvh - var(--topbar-h,0px) - var(--mainnav-h)${withBottom ? ' - var(--bottombar-h,0px)' : ''})`;

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
