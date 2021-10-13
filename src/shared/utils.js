export const copyToClipboard = (url) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(url);
    } else {
      let textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((res, rej) => {
        document.execCommand("copy") ? res() : rej();
        textArea.remove();
      });
    }
  } catch {
    window.open(url);
  }
};

export const calculateCreatedTime = (timeCreated) => {
  let periods = {
    year: 365 * 30 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
  };
  let diff = Date.now() - timeCreated;

  for (const key in periods) {
    if (diff >= periods[key]) {
      let result = Math.floor(diff / periods[key]);
      return result + " " + (result === 1 ? key : key + "s") + " ago";
    }
  }

  return "Just now";
};

export const anchorDownloadFile = (url) => {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = url;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};
