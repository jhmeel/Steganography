
export const createAndDownloadTxtFile = (filename: string, content: string) => {
 
  const blob = new Blob([content], { type: "text/plain" });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename+'.txt';
  document.body.appendChild(link);

  link.click();


  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
};

