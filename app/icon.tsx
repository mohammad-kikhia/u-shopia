import { ImageResponse } from 'next/og';
import { cookies } from 'next/headers';

// Matches app/globals.css theme tokens
const ACCENT_LIGHT = '#2563eb';
const ACCENT_DARK = '#3b82f6';
const BG_LIGHT = '#f9fafb';
const BG_DARK = '#0e1118';

// tabler:shopping-bag-heart (same mark as Navbar) — inlined so /icon works without public files on the server
const LOGO_PATH_D = [
  'M11.5 21H8.574a3 3 0 0 1-2.965-2.544l-1.255-8.152A2 2 0 0 1 6.331 8H17.67a2 2 0 0 1 1.977 2.304q-.086.552-.127.828',
  'M9 11V6a3 3 0 0 1 6 0v5m3 11l3.35-3.284a2.143 2.143 0 0 0 .005-3.071a2.24 2.24 0 0 0-3.129-.006l-.224.22l-.223-.22a2.24 2.24 0 0 0-3.128-.006a2.143 2.143 0 0 0-.006 3.071z',
] as const;

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
            {LOGO_PATH_D.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        </svg>
      </div>
    ),
    size,
  );
}
