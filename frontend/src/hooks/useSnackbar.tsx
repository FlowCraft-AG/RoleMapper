import { useState } from 'react';

export function useSnackbar() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    type: 'success',
  });

  const showSnackbar = (
    message: string,
    type: 'success' | 'error' = 'success',
  ) => {
    setSnackbar({ open: true, message, type });
  };

  const hideSnackbar = () =>
    setSnackbar({ open: false, message: '', type: 'success' });

  return { snackbar, showSnackbar, hideSnackbar };
}
