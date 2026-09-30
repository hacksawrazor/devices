import { getLoginUrl } from './getLoginUrl';
import { urls } from '../config/urls';

describe('getLoginUrl', () => {
  it('adds the current origin as the rd query parameter', () => {
    const currentOrigin = 'https://devices.example.com';
    const loginUrl = new URL(getLoginUrl(currentOrigin));

    expect(loginUrl.origin + loginUrl.pathname).toBe(urls.login);
    expect(loginUrl.searchParams.get('rd')).toBe(currentOrigin);
  });

  it('defaults rd to the browser origin', () => {
    const loginUrl = new URL(getLoginUrl());

    expect(loginUrl.searchParams.get('rd')).toBe(window.location.origin);
  });
});
