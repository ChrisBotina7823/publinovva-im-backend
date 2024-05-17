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
  return `https://drive.lienuc.com/uc?id=${fileId}`
}

const checkObj = (obj, prototype) => {
  if(!obj) throw new Error(`${prototype} not found`)
}

const calculateDayDiff = (start_date, end_date) => {
  const msDiff = end_date - start_date  
  const dayDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24));
  return dayDiff
}

const parseUsername = (username) => {
  return username.toLowerCase().replace(/\s/g, '');
}

export {
    filterObject,
    getIdFromUrl,
    getUrlFromId,
    checkObj,
    calculateDayDiff,
    parseUsername
}