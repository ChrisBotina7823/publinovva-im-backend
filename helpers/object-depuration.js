const filterObject = (obj) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([key, value]) => value !== undefined)
    );
}

const getIdFromUrl = (url) => {
  const startIdx = url.indexOf("id=");

  if (startIdx !== -1) {
      const endIdx = url.indexOf("&", startIdx);
      return endIdx !== -1 ? url.slice(startIdx + 3, endIdx) : url.slice(startIdx + 3);
  }

  return null;
}

const getUrlFromId = (fileId) => {
  return `https://drive.google.com/uc?export=view&id=${fileId}`
}

export {
    filterObject,
    getIdFromUrl,
    getUrlFromId
}