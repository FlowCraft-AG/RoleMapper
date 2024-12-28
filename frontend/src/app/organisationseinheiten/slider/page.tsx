'use client';

import { Box, Modal, Slider, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import FunctionsSpalte from '../../../components/organigramm/FunctionsSpalte';
import OrgUnitsSpalte from '../../../components/organigramm/OrgUnitsSpalte';
import UsersSpalte from '../../../components/organigramm/UsersSpalte';
import { useFacultyTheme } from '../../../theme/ThemeProviderWrapper';
import { FunctionInfo } from '../../../types/function.type';
import { OrgUnitDTO } from '../../../types/orgUnit.type';
import { fetchMitgliederIds } from '../fetchkp';
import UserInfoSpalte from '../../../components/organigramm/UserInfoSpalte';

export default function OrganigrammPage() {
  // Zustände für ausgewählte Elemente
  const [selectedOrgUnit, setSelectedOrgUnit] = useState<
    OrgUnitDTO | undefined
  >(undefined);
  const [selectedRootOrgUnit, setSelectedRootOrgUnit] = useState<
    OrgUnitDTO | undefined
  >(undefined);

  const [selectedFunctionId, setSelectedFunctionId] = useState<
    string | undefined
  >(undefined);
  const [selectedFunction, setSelectedFunction] = useState<FunctionInfo>();

  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined,
  );

  // Dynamische Breiten für die Spalten
  const [orgUnitsWidth, setOrgUnitsWidth] = useState(600); // Standard: 300px
  const [functionsWidth, setFunctionsWidth] = useState(400); // Standard: 600px
  const [usersWidth, setUsersWidth] = useState(400); // Standard: 400px

  // Benutzerdaten
  const [combinedUsers, setCombinedUsers] = useState<string[]>([]);
  const [isImpliciteFunction, setIsImpliciteFunction] =
    useState<boolean>(false);

  const theme = useTheme(); // Dynamisches Theme aus Material-UI
  const { setFacultyTheme } = useFacultyTheme(); // Dynamisches Theme nutzen

  useEffect(() => {
    console.log('Aktualisiertes Theme:', theme.palette);
  }, [setFacultyTheme, theme.palette]);

  // Mitglieder laden
  const getMitgliederIds = async (alias: string, kostenstelleNr: string) => {
    try {
      return await fetchMitgliederIds(alias, kostenstelleNr);
    } catch (error) {
      console.error('Fehler beim Laden der Mitglieder:', error);
      return [];
    }
  };

  // Organisationseinheit auswählen
  const handleOrgUnitSelect = async (orgUnitDTO: OrgUnitDTO) => {
    setSelectedOrgUnit(orgUnitDTO);
    setSelectedFunctionId(undefined); // Reset selection
    setSelectedUserId(undefined); // Reset selection
    setSelectedRootOrgUnit(undefined);

    if (orgUnitDTO.alias || orgUnitDTO.kostenstelleNr) {
      orgUnitDTO.hasMitglieder = true;
      setSelectedRootOrgUnit(orgUnitDTO);
      setCombinedUsers(
        await getMitgliederIds(orgUnitDTO.alias!, orgUnitDTO.kostenstelleNr!),
      );
    }
  };

  // Funktion auswählen
  const handleFunctionSelect = (functionInfo: FunctionInfo) => {
    setSelectedFunctionId(functionInfo._id);
    setSelectedFunction(functionInfo);
    setSelectedUserId(undefined); // Reset selection
    console.log('selectedFunctionId: ', functionInfo._id);
    console.log('selectedFunction: ', functionInfo);
    setIsImpliciteFunction(functionInfo.isImpliciteFunction);
  };

  // Mitgliederansicht aktivieren
  const handleMitgliederClick = () => {
    setSelectedFunctionId('mitglieder'); // Reset functions
    setSelectedFunction(mitglied(selectedRootOrgUnit?.id));
    setSelectedUserId(undefined); // Reset users
    setIsImpliciteFunction(false);
  };

  // Benutzer auswählen
  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
  };

  // Benutzer oder Funktion entfernen
  const handleRemove = (ids: string[]) => {
    if (ids.includes(selectedUserId!)) {
      setSelectedUserId(undefined);
    }
    if (ids.includes(selectedFunctionId!)) {
      setSelectedFunctionId(undefined);
      setSelectedFunction(undefined);
      setSelectedUserId(undefined);
    }
    if (ids.includes(selectedOrgUnit?.id || '')) {
      setSelectedOrgUnit(undefined);
      setSelectedFunctionId(undefined);
      setSelectedFunction(undefined);
      setSelectedUserId(undefined);
    }
  };

  // Mitgliederfunktion generieren
  const mitglied = (orgUnitId: string | undefined) => {
    return {
      _id: 'mitglieder',
      functionName: 'Mitglieder',
      orgUnit: orgUnitId,
      users: combinedUsers,
      isImpliciteFunction: false,
    };
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2, // Abstand zwischen den Spalten
        padding: 2,
        backgroundColor: theme.palette.background.default,
        overflowX: 'auto', // Horizontal scrollen, falls nötig
      }}
    >
      {/* Erste Spalte: Organisationseinheiten */}
      <Box
        sx={{
          flexShrink: 0,
          width: orgUnitsWidth, // Dynamische Breite
          borderRight: `1px solid ${theme.palette.divider}`,
          padding: '0 2px 2px 2px', // Padding oben, rechts, unten, links
          overflow: 'auto', // Ermöglicht Scrollen
          maxHeight: 'calc(100vh - 64px)', // Begrenzung der maximalen Höhe
          borderRadius: 4, // Abgerundete Ecken
          boxShadow: `0px 4px 8px ${theme.palette.divider}`, // Sanfter Schatten
          backgroundColor: theme.palette.background.paper, // Harmonische Hintergrundfarbe
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            backgroundColor: theme.palette.background.paper,
            padding: '12px 0',
            marginBottom: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Organisationseinheiten
          </Typography>
          <Slider
            value={orgUnitsWidth}
            onChange={(e, value) => setOrgUnitsWidth(value as number)}
            min={200}
            max={600}
            sx={{ width: '80%', margin: '8px auto' }}
          />
        </Box>
        <OrgUnitsSpalte
          onSelect={async (orgUnitDTO) => handleOrgUnitSelect(orgUnitDTO)}
          onRemove={handleRemove}
        />
      </Box>

      {/* Zweite Spalte: Funktionen */}
      {selectedOrgUnit && (
        <Box
          sx={{
            flexShrink: 1,
            width: functionsWidth, // Dynamische Breite
            borderRight: `1px solid ${theme.palette.divider}`,
            padding: 2,
            overflow: 'auto',
            maxHeight: 'calc(100vh - 64px)',
            borderRadius: 4,
            boxShadow: `0px 4px 8px ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Box
            sx={{
              textAlign: 'center',
              position: 'sticky',
              top: 0,
              zIndex: 1,
              backgroundColor: theme.palette.background.paper,
              padding: '12px 0',
              marginBottom: 2,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Funktionen
            </Typography>
            <Slider
              value={functionsWidth}
              onChange={(e, value) => setFunctionsWidth(value as number)}
              min={300}
              max={800}
              sx={{ width: '80%', margin: '8px auto' }}
            />
          </Box>
          <FunctionsSpalte
            orgUnit={selectedOrgUnit}
            onSelect={handleFunctionSelect}
            rootOrgUnit={selectedRootOrgUnit}
            handleMitgliederClick={handleMitgliederClick}
            onRemove={handleRemove}
          />
        </Box>
      )}

      {/* Dritte Spalte: Benutzer-IDs */}
      {selectedFunctionId && (
        <Box
          sx={{
            flexShrink: 1,
            width: usersWidth, // Dynamische Breite
            padding: '0 2px 2px 2px',
            overflow: 'auto',
            maxHeight: 'calc(100vh - 64px)',
            borderRadius: 4,
            boxShadow: `0px 4px 8px ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Box
            sx={{
              textAlign: 'center',
              position: 'sticky',
              top: 0,
              zIndex: 1,
              backgroundColor: theme.palette.background.paper,
              padding: '12px 0',
              marginBottom: 2,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Benutzer
            </Typography>
            <Slider
              value={usersWidth}
              onChange={(e, value) => setUsersWidth(value as number)}
              min={300}
              max={700}
              sx={{ width: '80%', margin: '8px auto' }}
            />
          </Box>
          <UsersSpalte
            selectedFunctionId={selectedFunctionId}
            selectedMitglieder={selectedFunction}
            onSelectUser={handleUserSelect}
            onRemove={handleRemove}
            isImpliciteFunction={isImpliciteFunction}
          />
        </Box>
      )}

      {/* Vierte Spalte: Benutzerinformationen als Modal */}
      <Modal
        open={Boolean(selectedUserId)}
        onClose={() => handleUserSelect('')}
        aria-labelledby="user-info-modal"
        aria-describedby="user-info-details"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 500,
            bgcolor: theme.palette.background.paper,
            boxShadow: 24,
            borderRadius: 4,
            p: 4,
          }}
        >
          {selectedUserId && <UserInfoSpalte userId={selectedUserId} />}
        </Box>
      </Modal>
    </Box>
  );
}
