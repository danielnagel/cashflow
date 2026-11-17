export type Health = {
  status: 'ok' | 'unavailable';
  database: 'ok' | 'unreachable';
};

export async function fetchHealth(): Promise<Health> {
  const response = await fetch('/api/health');
  if (!response.ok && response.status !== 503) {
    throw new Error(`Health check failed with status ${response.status}`);
  }
  return (await response.json()) as Health;
}
