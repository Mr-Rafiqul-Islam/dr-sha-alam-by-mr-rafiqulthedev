import type {Metadata} from 'next';
import { Manrope, Anek_Bangla } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FacebookPixel } from '@/components/analytics/FacebookPixel';
import { getApiBaseUrl } from '@/lib/api';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-display',
});
const anekBangla = Anek_Bangla({
  subsets: ['bengali', 'latin'],
  variable: '--font-anek-bangla',
  weight: ['400', '500', '600', '700'],
});
export const metadata: Metadata = {
  title: 'Dr. Shah Alam - ORTHOPEDIC SPECIALIST & CERTIFIED YOGA INSTRUCTOR',
  description: 'Dr. Shah Alam is an Orthopedic Spine Specialist and Certified Yoga Instructor dedicated to helping people make better treatment decisions and achieve lasting recovery. For more than a decade, he has worked with patients suffering from PLID, sciatica, back pain, neck pain, and musculoskeletal disorders.',
};

async function getAnalyticsConfig() {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    return null;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/client/analytics-config`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return null;
    }

    const json = (await response.json()) as {
      success: boolean;
      data?: { pixelId: string | null; enabled: boolean };
    };

    return json.data ?? null;
  } catch {
    return null;
  }
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const analyticsConfig = await getAnalyticsConfig();

  return (
    <html lang="en" className={`${manrope.variable} ${anekBangla.variable} scroll-smooth`} data-scroll-behavior="smooth">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" rel="stylesheet" />
        <meta name="facebook-domain-verification" content="qdg7wve0sk77n8zcyu2qwg6z869nef" />
        <FacebookPixel
          pixelId={analyticsConfig?.pixelId}
          enabled={analyticsConfig?.enabled}
        />
      </head>
      <body suppressHydrationWarning className="bg-background-light text-text-main flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
