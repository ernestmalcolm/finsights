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

const siteUrl = 'https://finsights.vercel.app';
const siteTitle = 'FinSights — Tanzania Banking Intelligence';
const siteDescription =
  'Interactive financial analytics for Tanzania\'s banking sector. Track assets, P&L, NPLs, and macro trends across 10 major banks — 2017 to 2024. Expanding to startups, investments & DSE stocks.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: '%s | FinSights',
  },
  description: siteDescription,
  keywords: [
    'Tanzania banking', 'Tanzania financial data', 'bank analytics Tanzania',
    'CRDB', 'NMB', 'NBC Tanzania', 'Stanbic Tanzania', 'DTB Tanzania',
    'NPL ratio Tanzania', 'P&L banking Tanzania', 'financial intelligence Tanzania',
    'DSE Tanzania', 'Tanzania economy', 'FinSights', 'banking dashboard',
    'financial sector Tanzania', 'banking KPIs', 'Tanzania macro indicators',
    'East Africa finance', 'open financial data',
  ],
  authors: [{ name: 'Eric-Alex Hamissi', url: 'https://www.linkedin.com/in/eric-alex-hamissi-b0b02119b/' }],
  creator: 'Eric-Alex Hamissi',
  publisher: 'FinSights',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_TZ',
    url: siteUrl,
    siteName: 'FinSights',
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    creator: '@finsights',
  },
  category: 'finance',
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
