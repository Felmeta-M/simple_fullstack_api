import "./globals.css";

export const metadata = {
  title: "ETiCPA CPD Events",
  description: "Upcoming CPD training events and registration",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
