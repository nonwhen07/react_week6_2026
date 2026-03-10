export const handleApiError = (error, setError, defaultMessage = '系統發生錯誤') => {
  const message = error?.response?.data?.message || defaultMessage;

  if (typeof setError === 'function') {
    setError(message);
  }

  console.error('API Error:', error);

  return message;
};
