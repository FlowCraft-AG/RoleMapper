'use client';

import { AccountTree, Extension } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Snackbar,
  Tab,
  Tabs,
  TextField,
} from '@mui/material';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { JSX, useEffect, useState } from 'react';
import { fetchAllFunctions } from '../../../lib/api/rolemapper/function.api';
import { fetchAllOrgUnits } from '../../../lib/api/rolemapper/orgUnit.api';
import { fetchRoles } from '../../../lib/api/rolemapper/roles.api';
import { GroupHeader, GroupItems } from '../../../styles/GroupStyles';
import { FunctionString } from '../../../types/function.type';
import { OrgUnit } from '../../../types/orgUnit.type';
import { ShortRole } from '../../../types/process.type';
import { Role } from '../../../types/role.type';
import {
  buildFunctionDisplayName,
  buildOrgUnitDisplayName,
} from '../../../utils/buildDisplayName.utils';

interface RoleEditModalProps {
  open: boolean;
  role: ShortRole | undefined;
  onClose: () => void;
  onSave: (updatedRole: ShortRole | undefined, oldRoleId: string) => void;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function RoleEditModal({
  open,
  role,
  onClose,
  onSave,
}: RoleEditModalProps): JSX.Element {
  const [selectedFunctionType, setSelectedFunctionType] = useState<
    string | null
  >(null);

  const [updatedRole, setUpdatedRole] = useState<ShortRole | undefined>(role);

  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);
  const [functions, setFunctions] = useState<FunctionString[]>([]);
  const [activeTab, setActiveTab] = useState(0); // Tab-Index
  const [loading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const [filters, setFilters] = useState({
    isImplicite: false,
    isSingleUser: false,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setAvailableRoles(await fetchRoles());
        setOrgUnits(await fetchAllOrgUnits());
        setFunctions(await fetchAllFunctions());
      } catch (err) {
        console.error('Fehler beim Laden der Daten:', err);
      }
    }

    if (open) {
      fetchData();
    }
  }, [open]);

  const handleSave = () => {
    console.log('updatedRole:', updatedRole);
    if (role) {
      onSave(updatedRole, role.roleId);
      onClose();
    }
  };

  // Filtere nur Organisationseinheiten mit definiertem alias oder Kostenstelle
  const filteredOrgUnits = orgUnits.filter(
    (unit: OrgUnit) => unit.alias !== null || unit.kostenstelleNr !== null,
  );

  const options = filteredOrgUnits.map((unit) => ({
    ...unit,
    displayName: buildOrgUnitDisplayName(
      unit,
      new Map(orgUnits.map((u) => [u._id, u])),
    ),
  }));

  useEffect(() => {
    if (open && role) {
      setUpdatedRole(role); // Setzt den aktuellen Zustand der Rolle
      // Setze den Function Type basierend auf dem roleType
      if (role.roleType === 'COLLECTION') {
        setSelectedFunctionType('existierende');
      } else if (role.roleType === 'IMPLICITE_ORG_UNIT') {
        setSelectedFunctionType('orgUnit');
      } else if (role.roleType === 'IMPLICITE_FUNCTION') {
        setSelectedFunctionType('orgUnit');
      }
    }
  }, [open, role]);

  return (
    <>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
      />
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '12px',
            padding: '16px',
          },
          '& .MuiAutocomplete-option:focus': {
            backgroundColor: '#e3f2fd',
            outline: '2px solid #1976d2',
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'primary.main',
          }}
        >
          Rolle bearbeiten: {role?.roleName}
        </DialogTitle>
        <DialogContent
          sx={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            // padding: '16px',
            // gap: '24px',
            width: '90%',
            maxWidth: 500,
            top: '50%',
            bgcolor: 'background.paper',
            //position: 'absolute',
          }}
        >
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            value={updatedRole?.roleName ?? 'N/A'}
            onChange={(e) =>
              setUpdatedRole((prev) => ({
                ...prev,
                roleName: e.target.value, // Aktualisiere nur roleName
                roleType: prev?.roleType ?? 'COLLECTION', // Fallback auf Standardwert
                roleId: prev?.roleId ?? '', // Fallback auf leeren String
              }))
            }
          />

          <Box sx={{ marginTop: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedFunctionType === 'existierende'}
                  onChange={() => setSelectedFunctionType('existierende')}
                />
              }
              label="Existierende Rolle"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedFunctionType === 'orgUnit'}
                  onChange={() => setSelectedFunctionType('orgUnit')}
                />
              }
              label="Existierende OrgUnit oder Funktion"
            />
          </Box>

          {selectedFunctionType === 'existierende' && (
            <Autocomplete
              options={availableRoles}
              getOptionLabel={(option) => option.name || 'Unbekannte Rolle'}
              renderInput={(params) => (
                <TextField {...params} label="Existierende Rolle" />
              )}
              value={
                availableRoles.find(
                  (option) => option._id === updatedRole?.roleId,
                ) || null
              }
              onChange={(_, value) =>
                setUpdatedRole((prev) => ({
                  ...prev,
                  roleType: 'COLLECTION',
                  roleId: value?._id || '',
                  roleName: prev?.roleName || '',
                }))
              }
            />
          )}

          {selectedFunctionType === 'orgUnit' && (
            <Box sx={{ marginTop: 2 }}>
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                centered
              >
                <Tab
                  label="OrgUnits"
                  icon={<AccountTree />}
                  {...a11yProps(0)}
                />
                <Tab
                  label="Funktionen"
                  icon={<Extension />}
                  {...a11yProps(1)}
                />
              </Tabs>
              {activeTab === 0 && (
                <Autocomplete
                  options={options}
                  loading={loading}
                  groupBy={
                    (option) => option.name[0].toUpperCase() // Gruppiert basierend auf dem ersten Buchstaben des Nachnamens
                  }
                  renderGroup={(params) => (
                    <li key={params.key}>
                      <GroupHeader>{params.group}</GroupHeader>
                      <GroupItems>{params.children}</GroupItems>
                    </li>
                  )}
                  getOptionLabel={(option) => option.displayName}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Organisationseinheit auswählen"
                      placeholder="Suchen..."
                      variant="outlined"
                      fullWidth
                    />
                  )}
                  value={
                    options.find(
                      (option) => option._id === updatedRole?.roleId,
                    ) || null
                  }
                  onChange={(_, value) =>
                    setUpdatedRole((prev) =>
                      value
                        ? {
                            ...prev,
                            roleType: 'IMPLICITE_ORG_UNIT',
                            roleId: value._id,
                            roleName: prev?.roleName || '',
                          }
                        : prev,
                    )
                  }
                  renderOption={(props, option, { inputValue }) => {
                    const label = option.name;
                    const matches = match(label, inputValue, {
                      insideWords: true,
                    });
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
              )}
              {activeTab === 1 && (
                <>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.isImplicite}
                          onChange={() =>
                            setFilters((prev) => ({
                              ...prev,
                              isImplicite: !prev.isImplicite,
                            }))
                          }
                        />
                      }
                      label="Nur implizite Funktionen"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.isSingleUser}
                          onChange={() =>
                            setFilters((prev) => ({
                              ...prev,
                              isSingleUser: !prev.isSingleUser,
                            }))
                          }
                        />
                      }
                      label="Nur Einzelnutzer-Funktionen"
                    />
                  </Box>
                  {loading ? (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '16px',
                      }}
                    >
                      <CircularProgress size={24} />
                    </Box>
                  ) : (
                    <Autocomplete
                      sx={{
                        '& .MuiAutocomplete-option': {
                          padding: '8px',
                          borderRadius: '8px',
                          '&:hover': {
                            backgroundColor: '#f0f0f0',
                          },
                        },
                        '& .MuiAutocomplete-listbox': {
                          padding: '8px',
                        },
                      }}
                      options={[...functions]
                        .filter(
                          (func) =>
                            (!filters.isImplicite ||
                              func.isImpliciteFunction) &&
                            (!filters.isSingleUser || func.isSingleUser),
                        ) // Filter basierend auf Checkboxen
                        .sort((a, b) =>
                          a.functionName.localeCompare(b.functionName),
                        )} // Alphabetische Sortierung
                      loading={loading}
                      groupBy={
                        (option) => option.functionName[0].toUpperCase() // Gruppiert basierend auf dem ersten Buchstaben des Nachnamens
                      }
                      renderGroup={(params) => (
                        <li key={params.key}>
                          <GroupHeader>{params.group}</GroupHeader>
                          <GroupItems>{params.children}</GroupItems>
                        </li>
                      )}
                      getOptionLabel={(option) =>
                        buildFunctionDisplayName(
                          option,
                          new Map(orgUnits.map((u) => [u._id, u])),
                        )
                      }
                      renderOption={(props, option, { inputValue }) => {
                        const displayName = buildFunctionDisplayName(
                          option,
                          new Map(orgUnits.map((u) => [u._id, u])),
                        );
                        const matches = match(displayName, inputValue);
                        const parts = parse(displayName, matches);

                        return (
                          <li {...props}>
                            <div>
                              {parts.map((part, index) => (
                                <span
                                  key={index}
                                  style={{
                                    fontWeight: part.highlight ? 700 : 400,
                                    color: part.highlight
                                      ? '#1976d2'
                                      : 'inherit',
                                  }}
                                >
                                  {part.text}
                                </span>
                              ))}
                            </div>
                          </li>
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Funktion auswählen"
                          placeholder="Funktion suchen"
                        />
                      )}
                      value={
                        functions.find(
                          (func) => func._id === updatedRole?.roleId,
                        ) || null
                      }
                      onChange={(_, value) =>
                        setUpdatedRole(
                          (prev) =>
                            value
                              ? {
                                  ...prev,
                                  roleType: 'IMPLICITE_FUNCTION',
                                  roleId: value._id, // ID des ausgewählten Objekts
                                  roleName: prev?.roleName || '', // Name der Rolle bleibt unverändert
                                }
                              : prev, // Falls kein Wert ausgewählt ist
                        )
                      }
                      isOptionEqualToValue={(option, value) =>
                        option._id === value?._id
                      }
                    />
                  )}
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" variant="outlined">
            Abbrechen
          </Button>
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            sx={{
              '&:hover': {
                backgroundColor: 'primary.dark',
                transform: 'scale(1.05)',
                transition: 'transform 0.2s ease-in-out',
              },
            }}
          >
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
