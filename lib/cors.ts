import type { IncomingMessage, ServerResponse } from 'node:http';

function resolveAllowedOrigin(requestOrigin?: string): string {
  const configured = process.env.ALLOWED_ORIGIN?.trim();
  if (!configured || configured === '*') {
    return '*';
  }

  const allowList = configured
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (requestOrigin && allowList.includes(requestOrigin)) {
    return requestOrigin;
  }

  return allowList[0] ?? '*';
}

export function applyCorsHeaders(req: IncomingMessage, res: ServerResponse): void {
  const requestOrigin =
    typeof req.headers.origin === 'string' ? req.headers.origin : undefined;
  const allowedOrigin = resolveAllowedOrigin(requestOrigin);

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (allowedOrigin !== '*') {
    res.setHeader('Vary', 'Origin');
  }
}

export function handleCorsPreflight(
  req: IncomingMessage,
  res: ServerResponse,
): boolean {
  applyCorsHeaders(req, res);
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }
  return false;
}
