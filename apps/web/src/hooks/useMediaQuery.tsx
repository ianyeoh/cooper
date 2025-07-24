import * as React from 'react';

/**
 * React hook as an escape hatch to execute media queries
 *
 * @param query Media query to evaluate (e.g. "(max-width: 1250px)")
 * @returns {boolean}
 */
export function useMediaQuery(query: string): boolean {
  const [value, setValue] = React.useState(false);

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener('change', onChange);
    setValue(result.matches);

    return () => result.removeEventListener('change', onChange);
  }, [query]);

  return value;
}
