
// TODO: test
// TODO: docs
export function getCookie (cookieName: string): string {
  const parts = `; ${document.cookie}`.split(`; ${cookieName}=`);
  if(parts.length === 2) {
    return parts.pop().split(";").shift();
  }
  return null;
}


// TODO: setCookie

// TODO: deleteCookie
