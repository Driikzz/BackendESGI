export const AlertTypes = {
  START_OF_YEAR: 'START_OF_YEAR',
  MID_TERM: 'MID_TERM',
  END_OF_YEAR: 'END_OF_YEAR',
  PROACTIVITY_ALERT: 'PROACTIVITY_ALERT',
  TEAMWORK_ALERT: 'TEAMWORK_ALERT',
  CONTINUATION_OF_STUDIES_ALERT: 'CONTINUATION_OF_STUDIES_ALERT',
  RECRUITMENT_PLANS_ALERT: 'RECRUITMENT_PLANS_ALERT',
} as const;

export type AlertType = typeof AlertTypes[keyof typeof AlertTypes];