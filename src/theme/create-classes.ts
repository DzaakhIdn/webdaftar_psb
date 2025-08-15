import { themeConfig } from './theme-config';

// ----------------------------------------------------------------------

export function createClasses(className: string) {
  return `${themeConfig.classesPrefix}__${className}`;
}
