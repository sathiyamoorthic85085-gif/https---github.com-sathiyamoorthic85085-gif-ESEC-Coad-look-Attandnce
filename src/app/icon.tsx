import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          borderRadius: '6px',
          background: 'linear-gradient(135deg, hsl(260, 100%, 60%), hsl(28, 100%, 60%))',
          color: 'white',
          fontSize: '20px',
          fontWeight: 'bold',
          fontFamily: 'monospace',
        }}
      >
        C
      </div>
    ),
    {
      ...size,
    }
  );
}
