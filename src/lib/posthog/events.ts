export const analyticsEvents = ['event_viewed','filters_used','search_performed','calendar_export_clicked','source_clicked','contribute_clicked','admin_candidate_reviewed','adapter_run_started','adapter_run_completed'] as const;
export type AnalyticsEvent = (typeof analyticsEvents)[number];
