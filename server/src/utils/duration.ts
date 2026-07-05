const UNIT_TO_MS: Record<string, number> = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

const SEVEN_DAYS_MS = 7 * UNIT_TO_MS.d;

/**
 * Parses simple duration strings ("15m", "12h", "7d", "30s") into
 * milliseconds. Falls back to 7 days if the format is unrecognized, so a
 * malformed JWT_EXPIRES_IN never results in a crash — only a conservative
 * default cookie lifetime.
 */
export function parseDurationToMs(duration: string): number {
  const match = /^(\d+)\s*([smhd])$/.exec(duration.trim());
  if (!match) {
    return SEVEN_DAYS_MS;
  }

  const value = Number(match[1]);
  const unit = match[2];
  return value * UNIT_TO_MS[unit];
}
