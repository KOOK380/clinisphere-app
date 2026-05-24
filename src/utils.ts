export const getEmbedUrl = (url: string) => {
  if (!url) return '';
  
  try {
    // YouTube
    const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
    if (isYoutube) {
      let videoId = '';
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      } else if (url.includes('youtube.com/watch')) {
        videoId = new URL(url).searchParams.get('v') || '';
      } else if (url.includes('youtube.com/embed/')) {
        return url; // Assume it already has the correct parameters if passed as embed
      } else if (url.includes('youtube.com/shorts/')) {
        videoId = url.split('youtube.com/shorts/')[1]?.split('?')[0];
      } else if (url.includes('youtube.com/live/')) {
        videoId = url.split('youtube.com/live/')[1]?.split('?')[0];
      }
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}`;
      }
    }

    // Vimeo
    const isVimeo = url.includes('vimeo.com');
    if (isVimeo) {
      const parts = url.split('/');
      const id = parts[parts.length - 1].split('?')[0];
      return `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=1`;
    }
  } catch (error) {
    console.error("Error parsing video URL:", error);
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
