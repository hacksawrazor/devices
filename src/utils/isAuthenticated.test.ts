import { isAuthenticated } from './isAuthenticated';

describe('isAuthenticated', () => {
  it('returns true when user info contains an email', () => {
    expect(isAuthenticated({ email: 'person@example.com' })).toBe(true);
  });

  it.each([null, undefined, {}, { email: null }, { email: '' }])(
    'returns false without a signed-in email (%s)',
    (user) => {
      expect(isAuthenticated(user)).toBe(false);
    },
  );
});
