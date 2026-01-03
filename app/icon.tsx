import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default async function Icon() {
  // Use a user agent that will get TTF format (older browsers)
  const fontResponse = await fetch(
    'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&display=swap',
    {
      headers: {
        // Use an older user agent to get TTF format instead of woff2
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
      },
    }
  );
  const fontCSS = await fontResponse.text();

  // Extract the font URL from the CSS (could be ttf or woff)
  const fontUrlMatch = fontCSS.match(/src: url\(([^)]+)\)/);

  let fontData: ArrayBuffer | null = null;
  if (fontUrlMatch) {
    const fontUrl = fontUrlMatch[1];
    fontData = await fetch(fontUrl).then((res) => res.arrayBuffer());
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 22,
          background: '#3B412D',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
        }}
      >
        <span
          style={{
            fontFamily: fontData ? 'Instrument Serif' : 'Georgia, serif',
            fontStyle: 'italic',
            color: '#FFF5EB',
            marginTop: -1,
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
