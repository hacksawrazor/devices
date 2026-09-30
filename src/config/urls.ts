const ssoBaseUrl = 'https://sso.hacksaw.in';

export const urls = {
  devicesApi: 'https://apis.hacksaw.in/devices/api/devices',
  userInfo: `${ssoBaseUrl}/oauth2/userinfo`,
  login: `${ssoBaseUrl}/oauth2/sign_in`,
  logout: `${ssoBaseUrl}/oauth2/sign_out`,
  contactEmail: 'mailto:supp@hacksaw.in',
} as const;
