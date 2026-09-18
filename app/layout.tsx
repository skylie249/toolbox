import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NexaLab Toolbox",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
