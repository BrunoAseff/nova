import "@/styles/globals.css";
import {
  Montserrat_Alternates,
  Inter,
  Open_Sans,
  Delius_Swash_Caps,
} from "next/font/google";
import { type Metadata } from "next";
import { SpacesProvider } from "@/contexts/spaceContext";
import { ThemeProvider } from "@/components/themeProvider";
import { CyclesContextProvider } from "@/contexts/cycleContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

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

const delius = Delius_Swash_Caps({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-delius",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${montserrat.variable} ${delius.className} ${openSans.variable} ${montserrat.className} `}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          themes={[
            "light",
            "dark",
            "system",
            "nebula_light",
            "nebula_dark",
            "ignition_light",
            "ignition_dark",
            "quasar_light",
            "quasar_dark",
            "supernova_light",
            "supernova_dark",
            "singularity_light",
            "singularity_dark",
          ]}
        >
          <CyclesContextProvider>
            <SpacesProvider>{children}</SpacesProvider>
          </CyclesContextProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
      <Analytics />
    </html>
  );
}
