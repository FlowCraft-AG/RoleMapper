import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import React from 'react';
import { GroupHeader, GroupItems } from '../styles/GroupStyles';
import { ShortUser } from '../types/user.type';

/**
 * Props für die UserAutocomplete-Komponente.
 */
interface UserAutocompleteProps {
  options: ShortUser[]; // Optionen, die im Autocomplete angezeigt werden
  loading: boolean; // Zeigt an, ob die Daten noch geladen werden
  value: ShortUser | ShortUser[] | null; // Aktuelle Auswahl (Einzelwert oder Mehrfachauswahl) (hier null da React zwischen kontrolliert (nicht undefined) und unkontrolliert Komponenten unterscheidet)
  onChange: (value: ShortUser[] | ShortUser | undefined) => void; // Callback bei Auswahländerung
  label?: string; // Label für das Eingabefeld
  placeholder?: string; // Platzhaltertext
  displayFormat?: 'full' | 'userId' | 'nameOnly'; // Anzeigeformat der Benutzerdaten (Standard: 'full')
  multiple?: boolean; // Aktiviert Mehrfachauswahl
  helperText?: string; // Text für Fehler oder Hinweise
}

/**
 * `UserAutocomplete` ist eine wiederverwendbare Komponente für die Benutzerauswahl.
 * Unterstützt Einzel- und Mehrfachauswahl sowie benutzerdefinierte Anzeigeformate.
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
