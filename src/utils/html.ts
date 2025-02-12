export function cleanHtmlDescription(description?: string): string | undefined {
  if (!description) return undefined;

  let cleanDescription = description;
  // Remove HTML tags but preserve links
  const matches = cleanDescription.match(/<a href="([^"]+)">[^<]+<\/a>/g);
  if (matches) {
    matches.forEach((match) => {
      const url = match.match(/<a href="([^"]+)">/)?.[1];
      if (url) {
        cleanDescription = cleanDescription.replace(match, url);
      }
    });
  }
  // Remove remaining HTML tags
  cleanDescription = cleanDescription.replace(/<[^>]+>/g, "");
  // Remove any HTML entities
  cleanDescription = cleanDescription.replace(/&[^;]+;/g, "");
  // Clean up any extra whitespace
  return cleanDescription.trim();
}
