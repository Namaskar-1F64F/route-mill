import { ImageResponse } from 'next/og';
import { db } from '@/lib/db';
import { users, activityLogs } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export const alt = 'Climber Profile';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ userId: string }> }) {
  const { userId: encodedUserId } = await params;
  const userId = decodeURIComponent(encodedUserId);

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  // Get some basic stats
  const sends = await db.query.activityLogs.findMany({
    where: and(
      eq(activityLogs.user_id, userId),
      eq(activityLogs.action_type, "SEND")
    ),
  });

  if (!user) {
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
          Climber not found
        </div>
      ),
      {
        ...size,
      }
    );
  }

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
            marginBottom: 40,
          }}
        >
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || "User"}
              width="200"
              height="200"
              style={{
                borderRadius: '100%',
                border: '8px solid black',
                boxShadow: '16px 16px 0px 0px rgba(0,0,0,1)',
              }}
            />
          ) : (
            <div
              style={{
                width: 200,
                height: 200,
                borderRadius: '100%',
                backgroundColor: '#e2e8f0',
                border: '8px solid black',
                boxShadow: '16px 16px 0px 0px rgba(0,0,0,1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 80,
                fontWeight: 900,
                color: '#64748b',
              }}
            >
              {user.name?.[0] || "?"}
            </div>
          )}
        </div>

        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.05em',
            color: 'black',
            marginBottom: 20,
            display: 'flex',
            textAlign: 'center',
          }}
        >
          {user.name}
        </div>

        <div
          style={{
            display: 'flex',
            gap: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'black',
              color: 'white',
              padding: '20px 40px',
              transform: 'skew(-6deg)',
            }}
          >
            <div style={{ fontSize: 48, fontWeight: 900, lineHeight: 1 }}>{sends.length}</div>
            <div style={{ fontSize: 16, fontFamily: 'monospace', letterSpacing: '0.1em' }}>SENDS</div>
          </div>
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
