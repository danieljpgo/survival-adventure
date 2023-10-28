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
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
