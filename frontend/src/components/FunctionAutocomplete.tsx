/**
 * @file FunctionAutocomplete.tsx
 * @description Stellt eine Autocomplete-Komponente bereit, die Funktionen und zugehörige Informationen anzeigt.
 * Diese Komponente unterstützt die Auswahl und Suche von Funktionen, einschließlich Organisationseinheit und zugehörigen Benutzern.
 *
 * @module FunctionAutocomplete
 */

import {
  Autocomplete,
  Box,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { FunctionString } from '../types/function.type';

/**
 * Props für die `FunctionAutocomplete`-Komponente.
 *
 * @interface FunctionAutocompleteProps
 * @property {FunctionString[]} options - Die Liste der verfügbaren Funktionen.
 * @property {boolean} [loading] - Gibt an, ob die Optionen geladen werden (Ladezustand).
 * @property {FunctionString | null} value - Der aktuell ausgewählte Wert.
 * @property {function} onChange - Callback-Funktion, die aufgerufen wird, wenn die Auswahl geändert wird.
 * @property {string} [label] - Beschriftung des Eingabefelds (Standard: "Funktion auswählen").
 * @property {string} [placeholder] - Platzhaltertext für das Eingabefeld (Standard: "Funktion suchen...").
 * @property {function} orgUnitLookup - Funktion, die die Organisationseinheit anhand ihrer ID auflöst.
 * @property {function} orgUnitPathLookup - Funktion, die den Hierarchiepfad einer Organisationseinheit zurückgibt.
 */
interface FunctionAutocompleteProps {
  options: FunctionString[];
  loading?: boolean;
  value: FunctionString | null;
  onChange: (value: FunctionString | null) => void;
  label?: string;
  placeholder?: string;
  orgUnitLookup: (id: string) => string;
  orgUnitPathLookup: (id: string) => string;
}

/**
 * `FunctionAutocomplete`-Komponente
 *
 * Diese Komponente ermöglicht die Suche und Auswahl von Funktionen.
 * - Zeigt detaillierte Informationen über die Funktion, wie Organisationseinheit, Hierarchiepfad und Benutzerstatus.
 * - Unterstützt benutzerdefinierte Ladezustände und Anpassung von Label und Platzhaltertext.
 *
 * @component
 * @param {FunctionAutocompleteProps} props - Die Props der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur der Autocomplete-Komponente.
 *
 * @example
 * <FunctionAutocomplete
 *   options={functionsList}
 *   loading={isLoading}
 *   value={selectedFunction}
 *   onChange={(value) => console.log(value)}
 *   label="Wähle eine Funktion"
 *   placeholder="Funktion suchen..."
 *   orgUnitLookup={(id) => orgUnitNames[id] || "Unbekannte Organisationseinheit"}
 *   orgUnitPathLookup={(id) => orgUnitPaths[id] || "Unbekannter Pfad"}
 * />
 */
const FunctionAutocomplete: React.FC<FunctionAutocompleteProps> = ({
  options,
  loading,
  value,
  onChange,
  label = 'Funktion auswählen',
  placeholder = 'Funktion suchen...',
  orgUnitLookup,
  orgUnitPathLookup,
}) => {
  /**
   * Generiert das Label für eine Option.
   *
   * @function getLabel
   * @param {FunctionString} option - Die Funktion, für die das Label erstellt wird.
   * @returns {string} Das Label mit dem Funktionsnamen und dem Organisationseinheitspfad.
   */
  const getLabel = (option: FunctionString): string => {
    const orgUnitPath = orgUnitPathLookup(option.orgUnit);
    return `${option.functionName} [${orgUnitPath}`;
  };

  return (
    <Autocomplete
      options={options}
      loading={loading}
      getOptionLabel={(option) => getLabel(option)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      renderOption={(props, option, { inputValue }) => {
        const orgUnitPath = orgUnitPathLookup(option.orgUnit);

        return (
          <li {...props} key={option._id}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {/* Funktion Name */}
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {option.functionName.split('').map((char, index) => (
                  <span
                    key={index}
                    style={{
                      fontWeight: inputValue.includes(char) ? 700 : 400,
                    }}
                  >
                    {char}
                  </span>
                ))}
              </Typography>

              {/* Organisationseinheit */}
              <Typography variant="body2" sx={{ color: 'gray' }}>
                {orgUnitLookup(option.orgUnit)}
              </Typography>

              {/* Hierarchiepfad */}
              <Typography
                variant="caption"
                sx={{
                  color: 'gray',
                  fontStyle: 'italic',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={orgUnitPath} // Tooltip für vollständigen Pfad
              >
                {orgUnitPath}
              </Typography>

              {/* Benutzer */}
              <Typography
                variant="caption"
                sx={{
                  color: option.users.length ? 'primary.main' : 'error.main',
                }}
              >
                {option.users.length > 0
                  ? `Benutzer: ${option.users.join(', ')}`
                  : 'Keine Benutzer zugeordnet'}
              </Typography>
            </Box>
          </li>
        );
      }}
    />
  );
};

export default FunctionAutocomplete;
