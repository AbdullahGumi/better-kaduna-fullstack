/**
 * Utility function to clean and truncate text for OpenGraph descriptions
 * Strips HTML, trims whitespace, and limits to 300 characters
 */
export function cleanOpenGraphDescription(text: string | null | undefined): string {
  if (!text) return '';

  // Strip HTML tags
  const withoutHtml = text.replace(/<[^>]*>/g, '');

  // Trim whitespace
  const trimmed = withoutHtml.trim();

  // Truncate to 300 characters
  if (trimmed.length <= 300) return trimmed;

  return trimmed.substring(0, 297) + '...';
}
