import { describe, it, expect } from 'vitest';
import { resolveApiUrl, ApiConfigurationError } from '../../app/src/config/api';

describe('API Configuration & URL Resolution Helper (resolveApiUrl)', () => {
  const prodOptions = {
    baseUrl: 'https://api.example.com',
    isProduction: true,
  };

  const devOptions = {
    baseUrl: undefined,
    isProduction: false,
  };

  describe('Local Development Fallback & Behavior', () => {
    it('returns relative path when API origin is undefined in development (preserving Vite proxy)', () => {
      const result = resolveApiUrl('/api/contact/', devOptions);
      expect(result).toBe('/api/contact/');
    });

    it('returns relative path when API origin is an empty string in development', () => {
      const result = resolveApiUrl('/api/contact/', { baseUrl: '', isProduction: false });
      expect(result).toBe('/api/contact/');
    });

    it('returns relative path when API origin is whitespace-only in development', () => {
      const result = resolveApiUrl('/api/contact/', { baseUrl: '   \t  ', isProduction: false });
      expect(result).toBe('/api/contact/');
    });

    it('permits HTTP localhost origin in development', () => {
      const result = resolveApiUrl('/api/contact/', { baseUrl: 'http://localhost:8000', isProduction: false });
      expect(result).toBe('http://localhost:8000/api/contact/');
    });

    it('permits HTTP 127.0.0.1 origin in development', () => {
      const result = resolveApiUrl('/api/contact/', { baseUrl: 'http://127.0.0.1:8000', isProduction: false });
      expect(result).toBe('http://127.0.0.1:8000/api/contact/');
    });
  });

  describe('Production Origin Enforcement (Fail-Closed)', () => {
    it('successfully resolves endpoint with a valid production HTTPS origin', () => {
      const result = resolveApiUrl('/api/contact/', prodOptions);
      expect(result).toBe('https://api.example.com/api/contact/');
    });

    it('throws ApiConfigurationError when API origin is undefined in production', () => {
      expect(() => resolveApiUrl('/api/contact/', { baseUrl: undefined, isProduction: true }))
        .toThrow(ApiConfigurationError);
      expect(() => resolveApiUrl('/api/contact/', { baseUrl: undefined, isProduction: true }))
        .toThrow('VITE_API_BASE_URL is required in production builds but was not configured.');
    });

    it('throws ApiConfigurationError when API origin is empty in production', () => {
      expect(() => resolveApiUrl('/api/contact/', { baseUrl: '', isProduction: true }))
        .toThrow(ApiConfigurationError);
    });

    it('throws ApiConfigurationError when API origin is whitespace-only in production', () => {
      expect(() => resolveApiUrl('/api/contact/', { baseUrl: '   ', isProduction: true }))
        .toThrow(ApiConfigurationError);
    });

    it('throws ApiConfigurationError when API origin uses insecure HTTP in production', () => {
      expect(() => resolveApiUrl('/api/contact/', { baseUrl: 'http://api.example.com', isProduction: true }))
        .toThrow(ApiConfigurationError);
      expect(() => resolveApiUrl('/api/contact/', { baseUrl: 'http://api.example.com', isProduction: true }))
        .toThrow('Insecure API origin in production: Production API origin must use the HTTPS protocol.');
    });

    it('throws ApiConfigurationError on malformed origin string', () => {
      expect(() => resolveApiUrl('/api/contact/', { baseUrl: 'not-a-valid-url', isProduction: true }))
        .toThrow(ApiConfigurationError);
      expect(() => resolveApiUrl('/api/contact/', { baseUrl: 'not-a-valid-url', isProduction: true }))
        .toThrow('Invalid API origin: The configured value is not a valid absolute URL.');
    });

    it('throws ApiConfigurationError on protocol-relative origin (//)', () => {
      expect(() => resolveApiUrl('/api/contact/', { baseUrl: '//api.example.com', isProduction: true }))
        .toThrow(ApiConfigurationError);
      expect(() => resolveApiUrl('/api/contact/', { baseUrl: '//api.example.com', isProduction: true }))
        .toThrow('Invalid API origin: Protocol-relative URLs are not permitted.');
    });
  });

  describe('Origin Normalization & Component Validation', () => {
    it('normalizes single root trailing slash on origin', () => {
      const result = resolveApiUrl('/api/contact/', { baseUrl: 'https://api.example.com/', isProduction: true });
      expect(result).toBe('https://api.example.com/api/contact/');
    });

    it('normalizes multiple root trailing slashes on origin', () => {
      const result = resolveApiUrl('/api/contact/', { baseUrl: 'https://api.example.com///', isProduction: true });
      expect(result).toBe('https://api.example.com/api/contact/');
    });

    it('rejects origin containing unexpected path segments', () => {
      expect(() => resolveApiUrl('/api/contact/', { baseUrl: 'https://api.example.com/extra', isProduction: true }))
        .toThrow(ApiConfigurationError);
      expect(() => resolveApiUrl('/api/contact/', { baseUrl: 'https://api.example.com/api', isProduction: true }))
        .toThrow('Invalid API origin: The origin must not contain a path segment. Specify origin only.');
    });

    it('rejects origin containing query parameters', () => {
      expect(() => resolveApiUrl('/api/contact/', { baseUrl: 'https://api.example.com/?mode=test', isProduction: true }))
        .toThrow(ApiConfigurationError);
      expect(() => resolveApiUrl('/api/contact/', { baseUrl: 'https://api.example.com/?mode=test', isProduction: true }))
        .toThrow('Invalid API origin: The origin must not contain query parameters.');
    });

    it('rejects origin containing URL fragments', () => {
      expect(() => resolveApiUrl('/api/contact/', { baseUrl: 'https://api.example.com/#section', isProduction: true }))
        .toThrow(ApiConfigurationError);
      expect(() => resolveApiUrl('/api/contact/', { baseUrl: 'https://api.example.com/#section', isProduction: true }))
        .toThrow('Invalid API origin: The origin must not contain a URL fragment.');
    });

    it('rejects origin containing embedded credentials', () => {
      expect(() => resolveApiUrl('/api/contact/', { baseUrl: 'https://user:password@api.example.com', isProduction: true }))
        .toThrow(ApiConfigurationError);
      expect(() => resolveApiUrl('/api/contact/', { baseUrl: 'https://user:password@api.example.com', isProduction: true }))
        .toThrow('Invalid API origin: Embedded user credentials (username/password) are not permitted.');
    });

    it('rejects origin missing hostname', () => {
      expect(() => resolveApiUrl('/api/contact/', { baseUrl: 'https://', isProduction: true }))
        .toThrow(ApiConfigurationError);
    });

    it('does not leak credentials or raw configured URLs in error messages', () => {
      try {
        resolveApiUrl('/api/contact/', { baseUrl: 'https://secretAdmin:superSecretPass@api.example.com?secretToken=12345', isProduction: true });
        expect.unreachable('Should have thrown ApiConfigurationError');
      } catch (err) {
        expect(err).toBeInstanceOf(ApiConfigurationError);
        const msg = (err as ApiConfigurationError).message;
        expect(msg).not.toContain('secretAdmin');
        expect(msg).not.toContain('superSecretPass');
        expect(msg).not.toContain('secretToken');
        expect(msg).not.toContain('12345');
        expect(msg).not.toContain('https://');
      }
    });
  });

  describe('Endpoint Path Validation & Normalization', () => {
    it('preserves the exact /api/contact/ endpoint and trailing slash in development and production', () => {
      expect(resolveApiUrl('/api/contact/', devOptions)).toBe('/api/contact/');
      expect(resolveApiUrl('/api/contact/', prodOptions)).toBe('https://api.example.com/api/contact/');
    });

    it('normalizes paths without leading slash', () => {
      expect(resolveApiUrl('api/contact/', devOptions)).toBe('/api/contact/');
      expect(resolveApiUrl('api/contact/', prodOptions)).toBe('https://api.example.com/api/contact/');
    });

    it('rejects non-string path inputs', () => {
      expect(() => resolveApiUrl(null as any, devOptions)).toThrow('API endpoint path must be a string.');
      expect(() => resolveApiUrl(undefined as any, devOptions)).toThrow('API endpoint path must be a string.');
      expect(() => resolveApiUrl(12345 as any, devOptions)).toThrow('API endpoint path must be a string.');
    });

    it('rejects empty or whitespace-only paths', () => {
      expect(() => resolveApiUrl('', devOptions)).toThrow('API endpoint path cannot be empty or whitespace-only.');
      expect(() => resolveApiUrl('   \t\n', devOptions)).toThrow('API endpoint path cannot be empty or whitespace-only.');
    });

    it('rejects absolute URLs as paths to prevent SSRF and host redirection', () => {
      expect(() => resolveApiUrl('https://example.com/api', devOptions))
        .toThrow('API endpoint path must be a relative path, not an absolute or protocol-relative URL.');
      expect(() => resolveApiUrl('http://evil.com/api', devOptions))
        .toThrow('API endpoint path must be a relative path, not an absolute or protocol-relative URL.');
      expect(() => resolveApiUrl('javascript:alert(1)', devOptions))
        .toThrow('API endpoint path must be a relative path, not an absolute or protocol-relative URL.');
    });

    it('rejects protocol-relative paths (//) to prevent origin redirection', () => {
      expect(() => resolveApiUrl('//example.com/api', devOptions))
        .toThrow('API endpoint path must be a relative path, not an absolute or protocol-relative URL.');
    });

    it('rejects literal directory traversal sequences', () => {
      expect(() => resolveApiUrl('/api/../secret/', devOptions))
        .toThrow('API endpoint path must not contain directory traversal sequences (..).');
      expect(() => resolveApiUrl('../secret/', devOptions))
        .toThrow('API endpoint path must not contain directory traversal sequences (..).');
      expect(() => resolveApiUrl('/api/..', devOptions))
        .toThrow('API endpoint path must not contain directory traversal sequences (..).');
    });

    it('rejects lowercase encoded traversal sequences (%2e%2e)', () => {
      expect(() => resolveApiUrl('/api/%2e%2e/secret/', devOptions))
        .toThrow('API endpoint path must not contain directory traversal sequences (..).');
    });

    it('rejects uppercase encoded traversal sequences (%2E%2E)', () => {
      expect(() => resolveApiUrl('/api/%2E%2E/secret/', devOptions))
        .toThrow('API endpoint path must not contain directory traversal sequences (..).');
    });

    it('rejects mixed-case and partial encoded traversal sequences (%2e. and .%2e)', () => {
      expect(() => resolveApiUrl('/api/%2e./secret/', devOptions))
        .toThrow('API endpoint path must not contain directory traversal sequences (..).');
      expect(() => resolveApiUrl('/api/.%2e/secret/', devOptions))
        .toThrow('API endpoint path must not contain directory traversal sequences (..).');
    });

    it('rejects double-percent-encoded traversal sequences (%252e%252e)', () => {
      expect(() => resolveApiUrl('/api/%252e%252e/secret/', devOptions))
        .toThrow('API endpoint path contains invalid or double-percent-encoded sequences.');
    });

    it('rejects literal backslashes in paths', () => {
      expect(() => resolveApiUrl('/api\\contact/', devOptions))
        .toThrow('API endpoint path must not contain backslashes.');
    });

    it('rejects lowercase encoded backslashes (%5c)', () => {
      expect(() => resolveApiUrl('/api/%5c/secret/', devOptions))
        .toThrow('API endpoint path must not contain backslashes.');
    });

    it('rejects uppercase encoded backslashes (%5C)', () => {
      expect(() => resolveApiUrl('/api/%5C/secret/', devOptions))
        .toThrow('API endpoint path must not contain backslashes.');
    });

    it('rejects malformed percent-encoding in path segment', () => {
      expect(() => resolveApiUrl('/api/%E0%A4/test', devOptions))
        .toThrow('API endpoint path contains malformed percent-encoding.');
    });

    it('rejects URL fragments in paths', () => {
      expect(() => resolveApiUrl('/api/contact/#section', devOptions))
        .toThrow('API endpoint path must not contain a URL fragment (#).');
    });

    it('rejects unencoded whitespace in paths', () => {
      expect(() => resolveApiUrl('/api/con tact/', devOptions))
        .toThrow('API endpoint path must not contain unencoded whitespace.');
    });

    it('preserves legitimate query parameters on endpoints', () => {
      expect(resolveApiUrl('/api/status/?check=true', devOptions)).toBe('/api/status/?check=true');
      expect(resolveApiUrl('/api/status/?check=true', prodOptions)).toBe('https://api.example.com/api/status/?check=true');
    });

    it('preserves encoded query parameter values', () => {
      expect(resolveApiUrl('/api/search?q=hello%20world', prodOptions))
        .toBe('https://api.example.com/api/search?q=hello%20world');
    });
  });
});

