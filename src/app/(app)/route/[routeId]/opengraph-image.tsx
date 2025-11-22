import { ImageResponse } from 'next/og';
import { db } from '@/lib/db';
import { routes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const alt = 'Route Details';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ routeId: string }> }) {
  const { routeId } = await params;
  const route = await db.query.routes.findFirst({
    where: eq(routes.id, routeId),
  });

  if (!route) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Route not found
        </div>
      ),
      {
        ...size,
      }
    );
  }

  const colorMap: Record<string, string> = {
    "Red": "#ef4444",
    "Blue": "#3b82f6",
    "Green": "#22c55e",
    "Yellow": "#eab308",
    "Orange": "#f97316",
    "Purple": "#a855f7",
    "Black": "#171717",
    "White": "#f5f5f5",
    "Pink": "#ec4899",
  };

  const routeColor = colorMap[route.color] || "#94a3b8";
  const isWhite = route.color === "White";

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
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: routeColor,
            border: '4px solid black',
            padding: '40px',
            boxShadow: '16px 16px 0px 0px rgba(0,0,0,1)',
            transform: 'skew(-6deg)',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              fontSize: 120,
              fontWeight: 900,
              color: isWhite ? 'black' : 'white',
              lineHeight: 1,
              display: 'flex',
            }}
          >
            {route.grade}
          </div>
        </div>

        <div
          style={{
            fontSize: 60,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            color: 'black',
            marginBottom: 10,
            display: 'flex',
            textAlign: 'center',
            maxWidth: '80%',
          }}
        >
          {route.color} {route.grade}
        </div>

        <div
          style={{
            fontSize: 30,
            fontFamily: 'monospace',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span>{"// SET BY "}{route.setter_name.toUpperCase()}</span>
          <span>•</span>
          <span>{new Date(route.set_date).toLocaleDateString()}</span>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 40,
            fontSize: 24,
            fontWeight: 900,
            color: 'black',
            display: 'flex',
          }}
        >
          ROCK MILL MAGNESIUM
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
