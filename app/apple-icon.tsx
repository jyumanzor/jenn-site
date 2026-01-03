import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default async function Icon() {
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

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background: '#3B412D',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 32,
        }}
      >
        <span
          style={{
            fontFamily: fontData ? 'Instrument Serif' : 'Georgia, serif',
            fontStyle: 'italic',
            color: '#FFF5EB',
            marginTop: -8,
          }}
        >
          J
        </span>
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
