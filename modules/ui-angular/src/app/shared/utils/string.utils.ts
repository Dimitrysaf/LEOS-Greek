export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const escapeHtml = (str: string) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export const unescapeHtml = (str: string) =>
  str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&');

export const countOccurrencesOfTextInString = (
  text: string,
  initialString: string,
) => {
  let occurences = 0;
  let startPos = 0;
  const searchStrLen = text.length;
  while (initialString.indexOf(text, startPos) > -1) {
    occurences++;
    startPos = initialString.indexOf(text, startPos) + searchStrLen;
  }
  return occurences;
};

export const cleanDelInsert = (
  title: string
) => {
    const resultTitle = title?.replace(/<del[^>]*?>[\s\S]*?<\/del>/gi, '');
    return resultTitle?.replace(/<\/?ins[^>]*?>/gi, '');
  }
