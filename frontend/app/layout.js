import "./globals.css"

export const metadata = {
  title: 'Industrial Advisor',
  description: 'Get advice for your industrial company',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
