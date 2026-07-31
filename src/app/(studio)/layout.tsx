export const metadata = {
  title: 'Sottomonte Studio',
  icons: { icon: '/images/logo-trim.png' },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
