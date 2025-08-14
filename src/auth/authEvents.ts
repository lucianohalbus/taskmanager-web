export type UnauthorizedHandler = () => void;

let onUnauthorized: UnauthorizedHandler | null = null;

/** Bridge register (logout + redirect) */
export function setUnauthorizedHandler(fn: UnauthorizedHandler) {
  onUnauthorized = fn;
}

/** After receive a 401 */
export function triggerUnauthorized() {
  try {
    onUnauthorized?.();
  } catch {
    /* noop */
  }
}

