// (fullscreen) route group — passes through to ConditionalShell which hides Header/Footer
export default function FullscreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
