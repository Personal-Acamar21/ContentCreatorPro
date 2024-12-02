export interface MusicTrack {
  id: string;
  title: string;
  url: string;
  category: 'gospel' | 'relaxation' | 'background' | 'holiday';
  duration: number;
  artist?: string;
  license: 'CC0' | 'CC-BY' | 'Public Domain';
}

export interface MusicCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}