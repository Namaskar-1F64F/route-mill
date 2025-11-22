import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
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
          backgroundColor: 'white',
          backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            border: '4px solid black',
            padding: '40px 60px',
            boxShadow: '16px 16px 0px 0px rgba(0,0,0,1)',
            transform: 'skew(-6deg)',
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.05em',
              color: 'black',
              lineHeight: 1,
              marginBottom: 10,
              display: 'flex',
            }}
          >
            Rock Mill
          </div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: '#94a3b8', // slate-400
              display: 'flex',
            }}
          >
            Magnesium
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 24,
            fontFamily: 'monospace',
            color: 'black',
            backgroundColor: 'white',
            padding: '8px 16px',
            border: '2px solid black',
            display: 'flex',
          }}
        >
          {"// DATA DRIVEN CLIMBING"}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
