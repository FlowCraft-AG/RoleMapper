'use client';

import { Box, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import FunctionsSpalte from '../../../components/organigramm/FunctionsSpalte';
import OrgUnitsSpalte from '../../../components/organigramm/OrgUnitsSpalte';
import UserInfoSpalte from '../../../components/organigramm/UserInfoSpalte';
import UsersSpalte from '../../../components/organigramm/UsersSpalte';
import { useFacultyTheme } from '../../../theme/ThemeProviderWrapper';
import { FunctionInfo } from '../../../types/function.type';
import { OrgUnitDTO } from '../../../types/orgUnit.type';
import { fetchMitgliederIds } from '../fetchkp';

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
        flexDirection: { xs: 'column', md: 'row' }, // Spalten für Desktop, Reihen für Smartphones
        gap: 2,
        padding: 2,
        backgroundColor: theme.palette.background.default,
        overflowX: { md: 'auto' }, // Horizontal scrollen für Desktop
        overflowY: 'auto', // Vertikal scrollen immer erlaubt
        height: { xs: 'auto', md: '100vh' }, // Höhe auf 100vh für Desktop, auto für Smartphones
      }}
    >
      {/* Erste Spalte: Organisationseinheiten */}
      <Box
        sx={{
          flexShrink: 0,
          width: { xs: '100%', md: 350 }, // 100% für Smartphones, feste Breite für Desktop
          borderRight: { md: `1px solid ${theme.palette.divider}` },
          padding: 2,
          backgroundColor: theme.palette.background.paper,
          boxShadow: { md: `0px 4px 8px ${theme.palette.divider}` },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: 2,
          }}
        >
          Organisationseinheiten
        </Typography>
        <OrgUnitsSpalte
          onSelect={handleOrgUnitSelect}
          onRemove={handleRemove}
        />
      </Box>

      {/* Zweite Spalte: Funktionen */}
      {selectedOrgUnit && (
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: '100%', md: 600 }, // 100% für Smartphones, feste Breite für Desktop
            borderRight: { md: `1px solid ${theme.palette.divider}` },
            padding: 2,
            backgroundColor: theme.palette.background.paper,
            boxShadow: { md: `0px 4px 8px ${theme.palette.divider}` },
          }}
        >
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              marginBottom: 2,
            }}
          >
            Funktionen
          </Typography>
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
            flexShrink: 0,
            width: { xs: '100%', md: 400 }, // 100% für Smartphones, feste Breite für Desktop
            padding: 2,
            backgroundColor: theme.palette.background.paper,
            boxShadow: { md: `0px 4px 8px ${theme.palette.divider}` },
          }}
        >
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              marginBottom: 2,
            }}
          >
            Benutzer
          </Typography>
          <UsersSpalte
            selectedFunctionId={selectedFunctionId}
            selectedMitglieder={selectedFunction}
            onSelectUser={handleUserSelect}
            onRemove={handleRemove}
            isImpliciteFunction={isImpliciteFunction}
          />
        </Box>
      )}

      {/* Vierte Spalte: Benutzerinformationen */}
      {selectedUserId && (
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: '100%', md: 300 }, // 100% für Smartphones, feste Breite für Desktop
            padding: 2,
            backgroundColor: theme.palette.background.paper,
            boxShadow: { md: `0px 4px 8px ${theme.palette.divider}` },
          }}
        >
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              marginBottom: 2,
            }}
          >
            Benutzerinformationen
          </Typography>
          <UserInfoSpalte userId={selectedUserId} />
        </Box>
      )}
    </Box>
  );
}
