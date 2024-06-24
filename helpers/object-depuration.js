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
  return `https://publinovva-im-backend-production.up.railway.app/img/${fileId}`
}

const checkObj = (obj, prototype) => {
  if(!obj) throw new Error(`${prototype} not found`)
}

const calculateDayDiff = (start_date, end_date) => {
  const msDiff = end_date - start_date  
  console.log(msDiff)
  const dayDiff = msDiff / (1000 * 60 * 60 * 24);
  console.log(dayDiff)
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