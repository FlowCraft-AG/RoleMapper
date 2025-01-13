/**
 * Wandelt verbleibende Sekunden in das Format HH:MM:SS um.
 *
 * @param {number} seconds - Die verbleibenden Sekunden.
 * @returns {string} Die formatierte Zeit als HH:MM:SS.
 */
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [hours, minutes, secs]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
};
