export const getCacheBusterArg = (url: string) => {
  const hasVersion = /\d+\.\d+\.\d+/.test(url);
  const hasToken = /[?&]cacheToken_\d{10,}/.test(url);
  const hasTimestamp = /[?&]_?(ts|t|v|vv)=\d{10,}/.test(url);
  if (hasVersion || hasToken || hasTimestamp) {
    return '';
  }

  const cacheToken = `_ts=${process.env.NG_APP_LEOS_BUILD_TIMESTAMP}`;
  const sep = url.includes('?') ? '&' : '?';
  return `${sep}${cacheToken}`;
};
