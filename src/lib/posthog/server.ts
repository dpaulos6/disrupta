import type { AnalyticsEvent } from './events';
export async function captureServerEvent(_event: AnalyticsEvent, _properties: Record<string, string | number | boolean> = {}) { try { return; } catch { return; } }
