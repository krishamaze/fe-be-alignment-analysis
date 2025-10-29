export default function ComingSoon({ children }) {
  return (
    <div className="pt-20 p-4 text-center">
      {children || 'Coming Soon'}
    </div>
  );
}
