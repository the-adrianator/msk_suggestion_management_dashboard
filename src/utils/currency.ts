// Utility functions for currency formatting and validation

// Formats a numeric value or string as British pound currency
export function formatCurrency(value: string | number): string {
  if (typeof value === "string") {
    // If already formatted with £ symbol, return as is
    if (value.startsWith("£")) {
      return value;
    }
    // Try to parse numeric value from string
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
      return value; // Return original if not a number
    }
    return `£${numericValue.toFixed(2)}`;
  }

  // Format numeric value
  return `£${value.toFixed(2)}`;
}

// Parses a currency string to extract the numeric value
export function parseCurrency(currencyString: string): number | null {
  // Remove £ symbol and parse
  const cleanValue = currencyString.replace(/£/g, "").trim();
  const numericValue = parseFloat(cleanValue);

  return isNaN(numericValue) ? null : numericValue;
}

// Validates if a string represents a valid currency format
export function isValidCurrency(value: string): boolean {
  // Check if it matches pattern like £85.00 or £85
  const currencyPattern = /^£?\d+(\.\d{2})?$/;
  return currencyPattern.test(value);
}
