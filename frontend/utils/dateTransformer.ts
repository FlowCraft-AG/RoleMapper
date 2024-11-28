import { getLogger } from "./logger";


export async function transformDate(
  dateString: Date | undefined | string | number,
) {
  const logger = getLogger(transformDate.name);
  logger.trace('dateString: %s ', dateString);

  if (!dateString) {
    logger.warn('Datum ist undefined');
    return 'Kein Datum Angegeben';
  }

  let datum: Date;

  if (dateString instanceof Date) {
    logger.info('Datum ist ein Date');
    datum = dateString;
  } else if (typeof dateString === 'string') {
    logger.trace('Datum ist ein String');
    datum = new Date(parseInt(dateString));

    if (isNaN(datum.getTime())) {
      logger.error('Ungültiges Datum im String-Format');
      return 'Ungültiges Datum';
    }
  } else if (typeof dateString === 'number') {
    logger.info('Datum ist eine Zahl (vermutlich ein Timestamp)');
    datum = new Date(dateString);
  } else {
    logger.error('Datum ist weder ein Date, String noch eine Zahl');
    return 'Ungültiges Datum';
  }

  if (isNaN(datum.getTime())) {
    logger.error('Ungültiges Datum nach Konvertierung');
    return 'Ungültiges Datum';
  }

  const tag = datum.getDate();
  const monat = datum.getMonth() + 1; // Monate sind nullbasiert
  const jahr = datum.getFullYear();

  const datumFormatted = `${tag}.${monat}.${jahr}`;
  logger.trace('datum: %s', datumFormatted);
  return datumFormatted;
}

interface Props {
  dateStr?: string;
  date?: Date;
  locale?: string;
}

interface Props {
  dateStr?: string;
  date?: Date;
  locale?: string;
}

export const formatDateToLocal = ({
  dateStr,
  date,
  locale = 'en-US', // Default-Wert direkt im Parameter
}: Props): string => {
  const logger = getLogger(formatDateToLocal.name);
  logger.debug('Signature: %o', { date: date, locale: locale, dateStr: dateStr });

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  const formatter = new Intl.DateTimeFormat(locale, options);

  try {
    // Überprüfung, ob dateStr ein gültiges Datum ist
    if (dateStr) {
      const strDate = new Date(dateStr);
      if (!isNaN(strDate.getTime())) {
        return formatter.format(strDate);
      } else {
        logger.warn('Invalid dateStr value provided: %o', dateStr);
      }
    }

    // Überprüfung, ob date gültig ist
    if (date && !isNaN(date.getTime())) {
      const strDate = new Date(date);
      if (!isNaN(strDate.getTime())) {
        return formatter.format(strDate);
      } else {
        logger.warn('Invalid dateStr value provided: %o', dateStr);
      }
    }

  } catch (error) {
    logger.error('Error formatting date: %o', error);
    return 'Invalid date';
  }

  // Fallback falls kein gültiges Datum übergeben wird
  return 'Invalid date';
};



