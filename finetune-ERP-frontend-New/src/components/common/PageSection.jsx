export default function PageSection({ children, className = '', ...props }) {
  return (
    <section className={className} {...props}>
      {children}
    </section>
  );
}
