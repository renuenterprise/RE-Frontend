import "./globals.css";

export const metadata = {
  title: "The Laundry",
  description: "Best Laundry In Your Town",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
