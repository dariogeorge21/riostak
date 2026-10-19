/**
 * Parses any YouTube URL (watch, share, short, embed) and returns the standard embed URL.
 * Falls back to a safe default video if invalid or empty.
 */
export function getYoutubeEmbedUrl(url: string | null | undefined): string {
  if (!url) {
    return "https://www.youtube-nocookie.com/embed/inpok4MKVLM";
  }

  const trimmed = url.trim();

  // If already an embed URL
  if (trimmed.includes("youtube.com/embed/") || trimmed.includes("youtube-nocookie.com/embed/")) {
    return trimmed;
  }

  // Handle youtu.be/VIDEO_ID
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch && shortMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${shortMatch[1]}`;
  }

  // Handle youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}`;
  }

  // Handle direct video ID passed
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube-nocookie.com/embed/${trimmed}`;
  }

  return trimmed;
}

/**
 * Validates whether a string is a recognizable YouTube link or video ID.
 */
export function isValidYoutubeUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/)|^[a-zA-Z0-9_-]{11}$)/.test(url.trim());
}
