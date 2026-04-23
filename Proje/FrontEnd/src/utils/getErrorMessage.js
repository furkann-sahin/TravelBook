export function getErrorMessage(error, fallbackMessage) {
  if (typeof error === "string" && error.trim()) return error;

  if (error && typeof error === "object") {
    if (typeof error.message === "string" && error.message.trim()) {
      return error.message;
    }

    if (typeof error.error === "string" && error.error.trim()) {
      return error.error;
    }

    if (error.data && typeof error.data === "object") {
      if (typeof error.data.message === "string" && error.data.message.trim()) {
        return error.data.message;
      }

      if (typeof error.data.error === "string" && error.data.error.trim()) {
        return error.data.error;
      }
    }
  }

  return fallbackMessage;
}
