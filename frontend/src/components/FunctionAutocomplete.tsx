import {
  Autocomplete,
  Box,
  CircularProgress,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import React from 'react';
import { FunctionString } from '../types/function.type';

interface FunctionAutocompleteProps {
  options: FunctionString[]; // Optionen für die Funktionen
  loading: boolean; // Ladezustand
  value: FunctionString | null; // Ausgewählter Wert
  onChange: (value: FunctionString | null) => void; // Callback für Änderungen
  label?: string; // Label für das Eingabefeld
  placeholder?: string; // Platzhaltertext
  orgUnitLookup: (id: string) => string; // Funktion zum Auflösen der Organisationseinheit
  orgUnitPathLookup: (id: string) => string; // Funktion für den Pfad der Organisationseinheit
}

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
  const getLabel = (option: FunctionString): string => {
    const orgUnitName = orgUnitLookup(option.orgUnit);
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
        const label = getLabel(option);
        const matches = match(label, inputValue, { insideWords: true });
        const parts = parse(label, matches);
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
