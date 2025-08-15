// ----------------------------------------------------------------------

/**
 * Format number with commas as thousands separators
 */
export function fNumber(number: number | string): string {
  const num = typeof number === 'string' ? parseFloat(number) : number;
  
  if (isNaN(num)) {
    return '0';
  }
  
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format number as percentage
 */
export function fPercent(number: number | string): string {
  const num = typeof number === 'string' ? parseFloat(number) : number;
  
  if (isNaN(num)) {
    return '0%';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num / 100);
}

/**
 * Format number as currency
 */
export function fCurrency(number: number | string): string {
  const num = typeof number === 'string' ? parseFloat(number) : number;
  
  if (isNaN(num)) {
    return '$0';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Format number with shortened notation (K, M, B)
 */
export function fShortenNumber(number: number | string): string {
  const num = typeof number === 'string' ? parseFloat(number) : number;
  
  if (isNaN(num)) {
    return '0';
  }
  
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(1)}B`;
  }
  
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(1)}M`;
  }
  
  if (num >= 1e3) {
    return `${(num / 1e3).toFixed(1)}K`;
  }
  
  return fNumber(num);
}

/**
 * Format data size in bytes
 */
export function fData(bytes: number | string): string {
  const num = typeof bytes === 'string' ? parseFloat(bytes) : bytes;
  
  if (isNaN(num) || num === 0) {
    return '0 bytes';
  }
  
  const k = 1024;
  const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(num) / Math.log(k));
  
  return `${parseFloat((num / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
