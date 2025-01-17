export interface JwtTokenPayload {
  email: string;
  sub: string;
  role: 'admin' | 'user';
  iat: number;
  exp: number;
}
