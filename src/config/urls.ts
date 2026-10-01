import { getRuntimeEnvironment } from './runtimeEnvironment';

const ssoBaseUrl = 'https://sso.hacksaw.in';

export const urls = {
  devicesApi: getRuntimeEnvironment().devicesApiUrl,
  userInfo: `${ssoBaseUrl}/oauth2/userinfo`,
  login: `${ssoBaseUrl}/oauth2/sign_in`,
  logout: `${ssoBaseUrl}/oauth2/sign_out?rd=https%3A%2F%2Fauth.hacksaw.in%2Flogout%2F`,
  contactEmail: 'mailto:supp@hacksaw.in',
} as const;
