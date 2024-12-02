import type { MusicTrack, MusicCategory } from '../types/music';

export const musicLibrary: MusicTrack[] = [
  // Gospel Music
  {
    id: 'gospel-1',
    title: 'Amazing Grace',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_2dde955030.mp3',
    category: 'gospel',
    duration: 180,
    artist: 'SergeQuadrado',
    license: 'CC0'
  },
  {
    id: 'gospel-2',
    title: 'Spiritual Elevation',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_8ed893fe2d.mp3',
    category: 'gospel',
    duration: 195,
    artist: 'SoulProd',
    license: 'CC0'
  },

  // Relaxation Music
  {
    id: 'relax-1',
    title: 'Meditation Waves',
    url: 'https://cdn.pixabay.com/download/audio/2022/04/27/audio_81cbd2c8f1.mp3',
    category: 'relaxation',
    duration: 240,
    artist: 'FASSounds',
    license: 'CC0'
  },
  {
    id: 'relax-2',
    title: 'Peaceful Mind',
    url: 'https://cdn.pixabay.com/download/audio/2021/08/08/audio_f9a00dc0e1.mp3',
    category: 'relaxation',
    duration: 180,
    artist: 'Music_Unlimited',
    license: 'CC0'
  },

  // Background Music
  {
    id: 'bg-1',
    title: 'Gentle Inspiration',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_5b6c253ab3.mp3',
    category: 'background',
    duration: 165,
    artist: 'Lexin_Music',
    license: 'CC0'
  },
  {
    id: 'bg-2',
    title: 'Corporate Ambient',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_136b26a2bf.mp3',
    category: 'background',
    duration: 210,
    artist: 'AudioCoffee',
    license: 'CC0'
  },

  // Holiday Music
  {
    id: 'holiday-1',
    title: 'Christmas Joy',
    url: 'https://cdn.pixabay.com/download/audio/2022/12/15/audio_a903a4aa62.mp3',
    category: 'holiday',
    duration: 150,
    artist: 'JuliusH',
    license: 'CC0'
  },
  {
    id: 'holiday-2',
    title: 'Winter Wonderland',
    url: 'https://cdn.pixabay.com/download/audio/2022/12/01/audio_c6b3e77808.mp3',
    category: 'holiday',
    duration: 195,
    artist: 'Music_Unlimited',
    license: 'CC0'
  }
];

// Fallback tracks that are guaranteed to work
export const fallbackTracks: MusicTrack[] = [
  {
    id: 'fallback-1',
    title: 'Ambient Piano',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/26/audio_872c0f1f09.mp3',
    category: 'relaxation',
    duration: 180,
    artist: 'FASSounds',
    license: 'CC0'
  },
  {
    id: 'fallback-2',
    title: 'Peaceful Meditation',
    url: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_72447c543d.mp3',
    category: 'relaxation',
    duration: 240,
    artist: 'SoulProd',
    license: 'CC0'
  }
];

export const categories: MusicCategory[] = [
  {
    id: 'gospel',
    name: 'Gospel',
    description: 'Spiritual and uplifting gospel music',
    icon: '🎵'
  },
  {
    id: 'relaxation',
    name: 'Relaxation',
    description: 'Calming and meditative tracks',
    icon: '🌊'
  },
  {
    id: 'background',
    name: 'Background',
    description: 'Perfect for videos and presentations',
    icon: '🎼'
  },
  {
    id: 'holiday',
    name: 'Holiday',
    description: 'Festive music for special occasions',
    icon: '🎄'
  }
];