import { ImageResponse } from 'next/og';
import { cookies } from 'next/headers';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Matches app/globals.css theme tokens
const ACCENT_LIGHT = '#2563eb';
const ACCENT_DARK = '#3b82f6';
const BG_LIGHT = '#f9fafb';
const BG_DARK = '#0e1118';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default async function Icon() {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get('theme')?.value;
  const isDark = themeCookie === 'dark';

  const accent = isDark ? ACCENT_DARK : ACCENT_LIGHT;
  const background = isDark ? BG_DARK : BG_LIGHT;
  const logoPath = path.join(process.cwd(), 'public', 'assets', 'img', 'logo.svg');
  const rawLogo = await readFile(logoPath, 'utf8');
  // ImageResponse/Satori does not reliably paint <img src="data:image/svg+xml,..."> — use inline SVG.
  const pathDs = [...rawLogo.matchAll(/<path[^>]+d="([^"]+)"/g)].map((m) => m[1]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          background,
          position: 'relative',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            fill="none"
            stroke={accent}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            {pathDs.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        </svg>
      </div>
    ),
    size,
  );
}
