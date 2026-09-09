import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { DeploymentInfo } from "~/app/_components/DeploymentInfo";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Teamspeak Viewer",
  description: "Scallyswags TS3 Server Viewer",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <DeploymentInfo />
      </body>
    </html>
  );
}
