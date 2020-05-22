
/**
 * Returns the value of a cookie
 * @param cookieName The name of the cookie for which to obtain the value
 */
export function getCookie (cookieName: string): string {
  const parts = `; ${document.cookie}`.split(`; ${cookieName}=`);
  if(parts.length === 2) {
    return parts.pop().split(";").shift();
  }
  return null;
}


// TODO: setCookie

// TODO: deleteCookie
