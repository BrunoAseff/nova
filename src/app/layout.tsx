import "@/styles/globals.css";

import { Montserrat_Alternates, Inter, Open_Sans } from "next/font/google";
import { type Metadata } from "next";
import { SpacesProvider } from "@/contexts/spaceContext";
import { ThemeProvider } from "@/components/themeProvider";
import { CyclesContextProvider } from "@/contexts/cycleContext";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "Nova",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const montserrat = Montserrat_Alternates({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${montserrat.variable} ${openSans.variable} ${montserrat.className}`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CyclesContextProvider>
            <SpacesProvider>{children}</SpacesProvider>
          </CyclesContextProvider>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-SZRTRX2GKE" />
    </html>
  );
}
