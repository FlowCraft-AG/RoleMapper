/**
 * @file UserAutocomplete.tsx
 * @description Wiederverwendbare Autocomplete-Komponente für die Auswahl von Benutzern.
 * Unterstützt Einzel- und Mehrfachauswahl, verschiedene Anzeigeformate und Gruppierungen.
 *
 * @module UserAutocomplete
 */

import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import React from 'react';
import { GroupHeader, GroupItems } from '../styles/GroupStyles';
import { ShortUser } from '../types/user.type';

/**
 * Props für die `UserAutocomplete`-Komponente.
 *
 * @interface UserAutocompleteProps
 * @property {ShortUser[]} options - Die Liste der Benutzeroptionen.
 * @property {boolean} loading - Gibt an, ob die Daten noch geladen werden.
 * @property {ShortUser | ShortUser[] | null} value - Der aktuelle Wert der Auswahl (Einzelwert oder Mehrfachauswahl).
 * @property {function} onChange - Callback-Funktion, die aufgerufen wird, wenn die Auswahl geändert wird.
 * @property {string} [label] - Beschriftung des Eingabefelds (Standard: "Benutzer auswählen").
 * @property {string} [placeholder] - Platzhaltertext für das Eingabefeld (Standard: "Benutzer suchen...").
 * @property {'full' | 'userId' | 'nameOnly'} [displayFormat] - Das Format der angezeigten Benutzerdaten (Standard: "full").
 * @property {boolean} [multiple] - Aktiviert die Mehrfachauswahl (Standard: `false`).
 * @property {string} [helperText] - Zusätzliche Hinweise oder Fehlermeldungen für das Eingabefeld.
 */
interface UserAutocompleteProps {
  options: ShortUser[];
  loading: boolean;
  value: ShortUser | ShortUser[] | null;
  onChange: (value: ShortUser[] | ShortUser | undefined) => void;
  label?: string;
  placeholder?: string;
  displayFormat?: 'full' | 'userId' | 'nameOnly';
  multiple?: boolean;
  helperText?: string;
}

/**
 * `UserAutocomplete`-Komponente
 *
 * Diese Komponente ermöglicht die Benutzer-Suche und -Auswahl mit zusätzlichen Funktionen:
 * - Unterstützt Einzel- und Mehrfachauswahl.
 * - Gruppiert Optionen basierend auf der Benutzer-ID oder dem Nachnamen.
 * - Zeigt Ladeindikatoren an, wenn die Daten noch geladen werden.
 * - Hebt übereinstimmende Zeichen basierend auf der Eingabe hervor.
 *
 * @component
 * @param {UserAutocompleteProps} props - Die Props der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur der Autocomplete-Komponente.
 *
 * @example
 * <UserAutocomplete
 *   options={userOptions}
 *   loading={isLoading}
 *   value={selectedUser}
 *   onChange={(newValue) => console.log(newValue)}
 *   label="Benutzer auswählen"
 *   placeholder="Benutzer suchen..."
 *   displayFormat="nameOnly"
 *   multiple={true}
 *   helperText="Wählen Sie einen oder mehrere Benutzer aus."
 * />
 */
const UserAutocomplete: React.FC<UserAutocompleteProps> = ({
  options,
  loading,
  value,
  onChange,
  label = 'Benutzer auswählen',
  placeholder = 'Benutzer suchen...',
  displayFormat = 'full',
  multiple = false,
  helperText = '',
}) => {
  /**
   * Bestimmt das Label für die Anzeige einer Benutzeroption basierend auf dem `displayFormat`.
   *
   * @function getLabel
   * @param {ShortUser} option - Die Benutzeroption.
   * @returns {string} Das Label, das angezeigt werden soll.
   */
  const getLabel = (option: ShortUser): string => {
    switch (displayFormat) {
      case 'userId':
        return option.userId; // Nur Benutzer-ID anzeigen
      case 'nameOnly':
        return `${option.profile?.lastName} ${option.profile?.firstName}`; // Nur Vor- und Nachname anzeigen
      case 'full':
      default:
        return `${option.profile?.lastName} ${option.profile?.firstName} (${option.userId})`; // Vollständige Anzeige
    }
  };

  return (
    <Autocomplete
      multiple={multiple} // Aktiviert Mehrfachauswahl
      options={options} // Benutzeroptionen
      loading={loading} // Zeigt Ladeindikator an, wenn true
      groupBy={
        (option) =>
          displayFormat === 'userId'
            ? option.userId[0].toUpperCase() // Gruppiert basierend auf dem ersten Zeichen der userId
            : option.profile?.lastName[0].toUpperCase() // Gruppiert basierend auf dem ersten Buchstaben des Nachnamens
      }
      getOptionLabel={getLabel} // Bestimmt die Anzeige der Optionen
      renderGroup={(params) => (
        <li key={params.key}>
          <GroupHeader>{params.group}</GroupHeader>
          <GroupItems>{params.children}</GroupItems>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label} // Label des Eingabefelds
          placeholder={placeholder} // Platzhalter
          helperText={helperText} // Fehlerausgabe oder zusätzliche Hinweise
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
      value={value} // Der aktuelle Wert der Auswahl
      onChange={(_, newValue) => {
        if (multiple) {
          onChange(newValue as ShortUser[]); // Mehrfachauswahl
        } else {
          onChange(newValue as ShortUser | undefined); // Einzelwert
        }
      }}
      renderOption={(props, option, { inputValue }) => {
        const label = getLabel(option);
        const matches = match(label, inputValue, { insideWords: true });
        const parts = parse(label, matches);

        return (
          <li {...props} key={option.userId}>
            <div>
              {parts.map((part, index) => (
                <span
                  key={index}
                  style={{
                    fontWeight: part.highlight ? 700 : 400,
                  }}
                >
                  {part.text}
                </span>
              ))}
            </div>
          </li>
        );
      }}
    />
  );
};

export default UserAutocomplete;
