/**
 * Downloads a file in the client's browser.
 *
 * @param {string} filename - The name for the downloaded file.
 * @param {Uint8Array | ArrayBuffer | Blob} file - The file content to be downloaded.
 * @param {string} [ext='zip'] - The file extension for the downloaded file.
 * @returns {void}
 */
const downloadFile = (filename, file, ext = 'zip') => {
  // Create a hidden anchor element to trigger the download
  const anchor = document.createElement('a');
  anchor.style.display = 'none';
  anchor.href = window.URL.createObjectURL(new Blob([file]));
  anchor.download = `${filename}.${ext}`;

  // Trigger the click event to start the download
  document.body.appendChild(anchor);
  anchor.click();

  // Clean up
  URL.revokeObjectURL(anchor.href);
};

export default {
  downloadFile
};
