import { formatCurrency, parseCurrency, isValidCurrency } from '../currency';

describe('formatCurrency', () => {
  it('should format numeric value with £ symbol', () => {
    const result = formatCurrency(85.5);
    expect(result).toBe('£85.50');
  });

  it('should format integer value', () => {
    const result = formatCurrency(100);
    expect(result).toBe('£100.00');
  });

  it('should return string value as-is if already has £ symbol', () => {
    const result = formatCurrency('£85.00');
    expect(result).toBe('£85.00');
  });

  it('should format string numeric value', () => {
    const result = formatCurrency('75.25');
    expect(result).toBe('£75.25');
  });

  it('should return original string if not numeric', () => {
    const result = formatCurrency('not-a-number');
    expect(result).toBe('not-a-number');
  });
});

describe('parseCurrency', () => {
  it('should parse currency string to numeric value', () => {
    const result = parseCurrency('£85.00');
    expect(result).toBe(85);
  });

  it('should parse currency string without £ symbol', () => {
    const result = parseCurrency('85.50');
    expect(result).toBe(85.5);
  });

  it('should handle decimal values', () => {
    const result = parseCurrency('£123.45');
    expect(result).toBe(123.45);
  });

  it('should return null for invalid currency strings', () => {
    const result = parseCurrency('not-a-number');
    expect(result).toBeNull();
  });

  it('should return null for empty string', () => {
    const result = parseCurrency('');
    expect(result).toBeNull();
  });
});

describe('isValidCurrency', () => {
  it('should return true for valid currency with £ symbol', () => {
    expect(isValidCurrency('£85.00')).toBe(true);
  });

  it('should return true for valid currency without £ symbol', () => {
    expect(isValidCurrency('85.00')).toBe(true);
  });

  it('should return true for integer values', () => {
    expect(isValidCurrency('£85')).toBe(true);
  });

  it('should return false for invalid formats', () => {
    expect(isValidCurrency('not-a-number')).toBe(false);
    expect(isValidCurrency('£85.123')).toBe(false); // Too many decimal places
    expect(isValidCurrency('abc')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isValidCurrency('')).toBe(false);
  });
});
