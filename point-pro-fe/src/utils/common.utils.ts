type DebouncedFunction<T extends (...args: any[]) => void> = (...args: Parameters<T>) => void;

type DebounceOptions = {
  leading?: boolean;
};

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  options: DebounceOptions = { leading: true },
): DebouncedFunction<T> {
  let timeout: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (options.leading && timeout === null) {
      func(...args);
    }

    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
