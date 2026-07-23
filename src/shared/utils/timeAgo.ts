export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 0 || isNaN(date.getTime())) {
    return "just now";
  }
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  if (seconds < 60) {
    return "just now";
  } else if (minutes === 1) {
    return "1 min ago";
  } else if (minutes < 60) {
    return `${minutes} mins ago`;
  } else if (hours === 1) {
    return "1 hr ago";
  } else if (hours < 24) {
    return `${hours} hrs ago`;
  } else if (days === 1) {
    return "yesterday";
  } else if (days < 7) {
    return `${days} days ago`;
  } else if (weeks === 1) {
    return "last week";
  } else if (weeks < 4) {
    return `${weeks} weeks ago`;
  } else if (months === 1) {
    return "last month";
  } else if (months < 12) {
    return `${months} months ago`;
  } else if (years === 1) {
    return "last year";
  } else {
    return `${years} years ago`;
  }
}
