function base64UrlDecode(input) {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return atob(padded);
}

export function decodeJwt(token) {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  try {
    const payload = base64UrlDecode(parts[1]);
    return JSON.parse(payload);
  } catch (_) {
    return null;
  }
}

export function isJwtExpired(token) {
  const payload = decodeJwt(token);
  if (!payload || typeof payload.exp !== 'number') {
    return true;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= nowInSeconds;
}

export function getJwtExpiryMs(token) {
  const payload = decodeJwt(token);
  if (!payload || typeof payload.exp !== 'number') {
    return null;
  }

  return payload.exp * 1000;
}
