import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Jenn Umanzor - Digital Mental Palace';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  // Use a user agent that will get TTF format (older browsers)
  const fontResponse = await fetch(
    'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&display=swap',
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
      },
    }
  );
  const fontCSS = await fontResponse.text();
  const fontUrlMatch = fontCSS.match(/src: url\(([^)]+)\)/);

  let fontData: ArrayBuffer | null = null;
  if (fontUrlMatch) {
    fontData = await fetch(fontUrlMatch[1]).then((res) => res.arrayBuffer());
  }

  const fontFamily = fontData ? 'Instrument Serif' : 'Georgia, serif';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#3B412D',
          position: 'relative',
        }}
      >
        {/* Decorative gradient background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, #546E40 0%, transparent 40%), radial-gradient(circle at 80% 20%, #97A97C 0%, transparent 30%)',
            opacity: 0.4,
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          {/* Logo letter */}
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 24,
              backgroundColor: '#FFF5EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 40,
            }}
          >
            <span
              style={{
                fontSize: 80,
                fontFamily,
                fontStyle: 'italic',
                color: '#3B412D',
                marginTop: -6,
              }}
            >
              J
            </span>
          </div>

          {/* Name */}
          <h1
            style={{
              fontSize: 64,
              fontFamily,
              fontStyle: 'italic',
              color: '#FFF5EB',
              marginBottom: 16,
              letterSpacing: '-0.02em',
            }}
          >
            Jenn Umanzor
          </h1>

          {/* Tagline */}
          <p
            style={{
              fontSize: 28,
              color: '#CBAD8C',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Digital Mental Palace
          </p>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            background: 'linear-gradient(90deg, #FABF34, #97A97C, #FABF34)',
            display: 'flex',
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [
            {
              name: 'Instrument Serif',
              data: fontData,
              style: 'italic',
              weight: 400,
            },
          ]
        : [],
    }
  );
}
