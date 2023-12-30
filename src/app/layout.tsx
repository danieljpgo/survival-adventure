import "../styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Survival Adventure",
  description: "Explore and survive",
};

type RootLayoutProps = {
  children: React.ReactNode;
};
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full bg-black">
      <body className="h-full">
        <main className="h-full">{children}</main>
      </body>
    </html>
  );
}
