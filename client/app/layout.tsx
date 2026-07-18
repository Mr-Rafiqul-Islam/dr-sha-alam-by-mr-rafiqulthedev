import type {Metadata} from 'next';
import { Manrope } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FacebookPixel } from '@/components/analytics/FacebookPixel';
import { getApiBaseUrl } from '@/lib/api';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-display',
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
    <html lang="en" className={`${manrope.variable} scroll-smooth`} data-scroll-behavior="smooth">
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
        <Script
          id="tawk-to"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/6a5baf0eb5d7521d47342bf0/1jtr27kuj';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
