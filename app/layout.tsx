import type { Metadata } from 'next';
import { Sora, IBM_Plex_Mono } from 'next/font/google';
import { ColorSchemeScript, MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import './globals.css';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

const ibmMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-mono',
  display: 'swap',
});

const theme = createTheme({
  fontFamily: 'var(--font-sora), sans-serif',
  fontFamilyMonospace: 'var(--font-ibm-mono), monospace',
  primaryColor: 'orange',
  defaultRadius: 'md',
  colors: {
    orange: [
      '#FFF8E1', '#FFECB3', '#FFE082', '#FFD54F', '#FFCA28',
      '#FFC107', '#FFB300', '#F59E0B', '#E65100', '#BF360C',
    ],
  },
  components: {
    Button: { defaultProps: { size: 'sm' } },
    Select: { defaultProps: { size: 'sm' } },
    Badge: { defaultProps: { radius: 'sm' } },
  },
});

export const metadata: Metadata = {
  title: 'FinSights — Tanzania Banking Intelligence',
  description: 'Open, interactive financial analytics for Tanzania\'s banking sector. Track assets, P&L, NPLs and macro trends across 10 major banks — 2017 to 2024.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${sora.variable} ${ibmMono.variable}`}>
        {/*
          ColorSchemeScript must be the FIRST child of <body> so it runs before
          React hydrates and prevents color-scheme flash. Placing it in <head>
          triggers a Next.js 16 "script tag inside JSX" warning.
        */}
        <ColorSchemeScript defaultColorScheme="dark" />
        <MantineProvider theme={theme} defaultColorScheme="dark">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
