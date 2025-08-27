//no payload or params from frontend to validated
export type GetEventsStatsSuccess = {
  stats: {
    total_events: number;
    upcoming: number;
    ongoing: number;
    completed: number;
  };
};
export type GetEventsStatsError = {
  error: { code: number; message: string };
};
