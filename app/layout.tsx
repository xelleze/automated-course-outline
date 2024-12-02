import "./globals.css";

export const metadata = {
  title: "Automated Course Outline",
  description: "Generate course outlines using AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
