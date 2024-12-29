import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import React from 'react';
import { GroupHeader, GroupItems } from '../../styles/GroupStyles';
import { UserCredetials } from '../../types/user.type';

interface UserAutocompleteProps {
  options: UserCredetials[];
  loading: boolean;
  value: UserCredetials | UserCredetials[] | null; // Einzelwert oder Mehrfachauswahl
  onChange: (value: UserCredetials[] | UserCredetials | null) => void;
  label?: string;
  placeholder?: string;
  displayFormat: 'full' | 'userId' | 'nameOnly'; // Definiert das Anzeigeformat
  multiple?: boolean; // Optionaler Prop für Mehrfachauswahl
  helperText?: string | null | undefined; // Fehlerausgabe
}

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
  const getLabel = (option: UserCredetials): string => {
    switch (displayFormat) {
      case 'userId':
        return option.userId;
      case 'nameOnly':
        return `${option.profile.lastName} ${option.profile.firstName}`;
      case 'full':
      default:
        return `${option.profile.lastName} ${option.profile.firstName} (${option.userId})`;
    }
  };

  return (
    <Autocomplete
      multiple={multiple} // Aktiviert Mehrfachauswahl
      options={options}
      loading={loading}
      groupBy={(option) => option.profile.lastName[0].toUpperCase()}
      getOptionLabel={getLabel}
      renderGroup={(params) => (
        <li key={params.key}>
          <GroupHeader>{params.group}</GroupHeader>
          <GroupItems>{params.children}</GroupItems>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          helperText={helperText} // Fehlerausgabe
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
      onChange={(_, newValue) => {
        if (multiple) {
          onChange(newValue as UserCredetials[]); // Gibt ein Array zurück
        } else {
          onChange(newValue as UserCredetials | null); // Gibt einen Einzelwert zurück
        }
      }}
      renderOption={(props, option, { inputValue }) => {
        const label = getLabel(option);
        const matches = match(label, inputValue, { insideWords: true });
        const parts = parse(label, matches);

        return (
          <li {...props} key={option._id}>
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
