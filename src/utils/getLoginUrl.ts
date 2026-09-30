import { urls } from '../config/urls';

export function getLoginUrl(currentOrigin: string = window.location.origin): string {
  const loginUrl = new URL(urls.login);
  loginUrl.searchParams.set('rd', currentOrigin);
  return loginUrl.toString();
}
