export const getEmbedUrl = (url: string) => {
  if (!url) return '';
  
  // YouTube
  const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/);
  if (ytMatch) {
    const id = ytMatch[1].split('&')[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}`;
  }

  // Vimeo
  const vimeoMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com)\/(.+)/);
  if (vimeoMatch) {
    const id = vimeoMatch[1].split('?')[0];
    return `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=1`;
  }

  return url;
};

export const isExternalVideo = (url: string) => {
  if (!url) return false;
  return url.includes("youtube.com") || url.includes("youtu.be") || url.includes("vimeo.com");
};

export const isDirectVideo = (url: string) => {
  if (!url) return false;
  const cleanUrl = url.split("?")[0].toLowerCase();
  return cleanUrl.endsWith(".mp4") || cleanUrl.endsWith(".webm") || cleanUrl.endsWith(".ogv");
};

export const getTranslatedField = (item: any, field: string, lang: string) => {
  if (!item) return '';
  
  if (lang === 'en') {
    return item[`${field}_en`] || item[`${field}_fr`] || item[field] || '';
  } else {
    // Default to French for 'fr' or any other language
    return item[`${field}_fr`] || item[`${field}_en`] || item[field] || '';
  }
};
