export const extractErrorMessage = (
  err: unknown,
  fallback = "Something went wrong"
): string => {
  if (typeof err === "string") return err;

  if (typeof err === "object" && err !== null) {
    const maybeAxiosError = err as {
      response?: {
        data?: {
          message?: string;
        };
      };
    };

    return (
      maybeAxiosError.response?.data?.message ?? fallback
    );
  }

  return fallback;
};
