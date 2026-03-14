export interface APODResponse {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  copyright?: string;
  service_version: string;
}

export type DateMode = 'day' | 'month' | 'year';

export interface AppError {
  message: string;
  code?: number;
}
