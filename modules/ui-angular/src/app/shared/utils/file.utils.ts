export const downloadBlob = (
  blob: Blob,
  filename: string,
  document = window.document,
) => {
  const data = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = data;
  link.download = filename;
  document.body.appendChild(link);

  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  );

  document.body.removeChild(link);
};

export const getFileExtension = (
  filename: string
) => {
  if (!filename) return '';
  if (filename.lastIndexOf('.') === -1) return '';
  return filename.slice((filename.lastIndexOf('.') + 1)).toLowerCase().trim();
};

export const getFileName = (
  filename: string
) => {
  if (!filename) return '';
  if (filename.lastIndexOf('.') === -1) return filename;
  return filename.substring(0, filename.lastIndexOf('.')).toLowerCase().trim();
};
