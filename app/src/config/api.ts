/**
 * API origin and endpoint resolution helper.
 * Governed by Stage 09.3 deployment architecture.
 */

export class ApiConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiConfigurationError';
  }
}

export interface ResolveApiUrlOptions {
  baseUrl?: string;
  isProduction?: boolean;
}

/**
 * Validates that an input string is a valid relative API endpoint path.
 * Normalizes leading slashes and strictly preserves trailing slashes.
 * Permitted query strings are preserved; fragments and traversal are rejected.
 */
function validateAndNormalizePath(path: unknown): string {
  if (typeof path !== 'string') {
    throw new ApiConfigurationError('API endpoint path must be a string.');
  }

  const trimmed = path.trim();
  if (trimmed.length === 0) {
    throw new ApiConfigurationError('API endpoint path cannot be empty or whitespace-only.');
  }

  // Reject absolute URLs (any URI scheme) or protocol-relative URLs
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed) || trimmed.startsWith('//')) {
    throw new ApiConfigurationError(
      'API endpoint path must be a relative path, not an absolute or protocol-relative URL.'
    );
  }

  // Reject URL fragments
  if (trimmed.includes('#')) {
    throw new ApiConfigurationError(
      'API endpoint path must not contain a URL fragment (#).'
    );
  }

  // Separate path from optional query string safely
  const queryIndex = trimmed.indexOf('?');
  const pathPart = queryIndex === -1 ? trimmed : trimmed.slice(0, queryIndex);
  const queryPart = queryIndex === -1 ? '' : trimmed.slice(queryIndex);

  // Reject double-percent-encoding in the path segment (e.g. %252e%252e)
  if (/%25/i.test(pathPart)) {
    throw new ApiConfigurationError(
      'API endpoint path contains invalid or double-percent-encoded sequences.'
    );
  }

  // Decode path segment to inspect for encoded traversal and backslashes
  let decodedPath: string;
  try {
    decodedPath = decodeURIComponent(pathPart);
  } catch {
    throw new ApiConfigurationError(
      'API endpoint path contains malformed percent-encoding.'
    );
  }

  // Reject literal and encoded backslashes
  if (decodedPath.includes('\\') || pathPart.includes('\\')) {
    throw new ApiConfigurationError(
      'API endpoint path must not contain backslashes.'
    );
  }

  // Reject literal and encoded directory traversal sequences
  if (/(^|\/)\.\.(\/|$)/.test(decodedPath)) {
    throw new ApiConfigurationError(
      'API endpoint path must not contain directory traversal sequences (..).'
    );
  }

  // Reject unencoded whitespace in the path segment
  if (/\s/.test(pathPart)) {
    throw new ApiConfigurationError(
      'API endpoint path must not contain unencoded whitespace.'
    );
  }

  // Normalize leading slash: ensure path begins with '/'
  const normalizedPathPart = pathPart.startsWith('/') ? pathPart : `/${pathPart}`;

  // Reattach query string if present
  return `${normalizedPathPart}${queryPart}`;
}

/**
 * Validates that a configured environment value is a strict API origin:
 * <scheme>://<hostname>[:<port>]
 * 
 * Never interpolates raw input into error messages to prevent credential leakage.
 */
function validateApiOrigin(rawBase: string, isProduction: boolean): string {
  const trimmed = rawBase.trim();

  if (trimmed.startsWith('//')) {
    throw new ApiConfigurationError(
      'Invalid API origin: Protocol-relative URLs are not permitted.'
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new ApiConfigurationError(
      'Invalid API origin: The configured value is not a valid absolute URL.'
    );
  }

  if (isProduction && parsed.protocol !== 'https:') {
    throw new ApiConfigurationError(
      'Insecure API origin in production: Production API origin must use the HTTPS protocol.'
    );
  }

  if (!isProduction && parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new ApiConfigurationError(
      'Unsupported API origin protocol: API origin must use the HTTP or HTTPS protocol.'
    );
  }

  if (!parsed.hostname) {
    throw new ApiConfigurationError(
      'Invalid API origin: Missing required hostname.'
    );
  }

  if (parsed.username || parsed.password) {
    throw new ApiConfigurationError(
      'Invalid API origin: Embedded user credentials (username/password) are not permitted.'
    );
  }

  // Path must be empty or root slashes only (e.g. '', '/', '///'). Genuine path segments are rejected.
  if (parsed.pathname !== '' && !/^\/+$/.test(parsed.pathname)) {
    throw new ApiConfigurationError(
      'Invalid API origin: The origin must not contain a path segment. Specify origin only.'
    );
  }

  if (parsed.search) {
    throw new ApiConfigurationError(
      'Invalid API origin: The origin must not contain query parameters.'
    );
  }

  if (parsed.hash) {
    throw new ApiConfigurationError(
      'Invalid API origin: The origin must not contain a URL fragment.'
    );
  }

  return parsed.origin;
}

/**
 * Resolves an API endpoint path against the configured API origin.
 * 
 * - In local development: an unset/blank base URL returns the relative path,
 *   preserving the local Vite proxy.
 * - In production: a valid HTTPS origin is required. Missing, blank, malformed,
 *   or insecure origins fail closed by throwing ApiConfigurationError.
 */
export function resolveApiUrl(path: unknown, options?: ResolveApiUrlOptions): string {
  const normalizedPath = validateAndNormalizePath(path);

  const isProd = options?.isProduction ?? import.meta.env.PROD;
  const rawBase = options?.baseUrl !== undefined
    ? options.baseUrl
    : (import.meta.env.VITE_API_BASE_URL as string | undefined);

  const cleanBase = (rawBase ?? '').trim();

  if (!cleanBase) {
    if (isProd) {
      throw new ApiConfigurationError(
        'VITE_API_BASE_URL is required in production builds but was not configured.'
      );
    }
    // Local development fallback: relative path triggers Vite proxy to http://127.0.0.1:8000
    return normalizedPath;
  }

  const validatedOrigin = validateApiOrigin(cleanBase, isProd);
  return `${validatedOrigin}${normalizedPath}`;
}
