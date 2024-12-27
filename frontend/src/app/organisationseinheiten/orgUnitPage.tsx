'use client';

import { Box, Modal, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import FunctionsSpalte from '../../components/organigramm/FunctionsSpalte';
import OrgUnitsSpalte from '../../components/organigramm/OrgUnitsSpalte';
import UserInfoSpalte from '../../components/organigramm/UserInfoSpalte';
import UsersSpalte from '../../components/organigramm/UsersSpalte';
import { useFacultyTheme } from '../../theme/ThemeProviderWrapper';
import { FunctionInfo } from '../../types/function.type';
import { OrgUnitDTO } from '../../types/orgUnit.type';
import { fetchMitgliederIds } from './fetchkp';

export default function OrganigrammPage() {
  console.log('ORGANIGRAMM PAGE');
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
  const [combinedUsers, setCombinedUsers] = useState<string[]>([]);
  const [isImpliciteFunction, setIsImpliciteFunction] =
    useState<boolean>(false);
  const theme = useTheme(); // Dynamisches Theme aus Material-UI
  const { setFacultyTheme } = useFacultyTheme(); // Dynamisches Theme nutzen

  useEffect(() => {
    console.log('Aktualisiertes Theme:', theme.palette);
  }, [setFacultyTheme, theme.palette]);

  const getMitgliederIds = async (alias: string, kostenstelleNr: string) => {
    return await fetchMitgliederIds(alias, kostenstelleNr);
  };

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

  const handleFunctionSelect = (functionInfo: FunctionInfo) => {
    setSelectedFunctionId(functionInfo._id);
    setSelectedFunction(functionInfo);
    setSelectedUserId(undefined); // Reset selection
    console.log('selectedFunctionId: ', functionInfo._id);
    console.log('selectedFunction: ', functionInfo);
    setIsImpliciteFunction(functionInfo.isImpliciteFunction);
  };

  const handleMitgliederClick = () => {
    setSelectedFunctionId('mitglieder'); // Reset functions
    setSelectedFunction(mitglied(selectedRootOrgUnit?.id));
    setSelectedUserId(undefined); // Reset users
    setIsImpliciteFunction(false);
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
  };

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
        padding: 2, // Allgemeines Padding
        backgroundColor: theme.palette.background.default, // Einheitlicher Hintergrund
        overflowX: 'auto', // Horizontal scrollen, falls nötig
      }}
    >
      {/* Erste Spalte: Organisationseinheiten */}
      <Box
        sx={{
          flexGrow: 1, // Dynamische Breite
          flexShrink: 0, // Verhindert, dass sich die Spalte verkleinert
          borderRight: `1px solid ${theme.palette.divider}`,
          padding: '0 2px 2px 2px', // Padding oben, rechts, unten, links
          overflow: 'auto', // Ermöglicht Scrollen
          maxHeight: 'calc(100vh - 64px)', // Begrenzung der maximalen Höhe
          borderRadius: 4, // Abgerundete Ecken
          boxShadow: `0px 4px 8px ${theme.palette.divider}`, // Sanfter Schatten
          backgroundColor: theme.palette.background.paper, // Harmonische Hintergrundfarbe
        }}
      >
        <Typography
          variant="h5"
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            position: 'sticky',
            top: 0,
            backgroundColor: theme.palette.background.paper,
            zIndex: 1,
            padding: '12px 0',
            marginBottom: 2,
            borderBottom: `2px solid`,
            borderImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main}) 1`,
            borderImageSlice: 1,
          }}
        >
          Organisationseinheiten
        </Typography>
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
            width: 600,
            borderRight: `1px solid ${theme.palette.divider}`,
            padding: 2,
            overflow: 'auto',
            maxHeight: 'calc(100vh - 64px)',
            borderRadius: 4,
            boxShadow: `0px 4px 8px ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              position: 'sticky',
              top: 0,
              backgroundColor: theme.palette.background.paper,
              zIndex: 1,
              padding: '12px 0',
              marginBottom: 2,
              borderBottom: `2px solid`,
              borderImage: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.secondary.dark}) 1`,
              borderImageSlice: 1,
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
            flexShrink: 1,
            padding: 2,
            overflow: 'auto',
            maxHeight: 'calc(100vh - 64px)',
            borderRadius: 4,
            boxShadow: `0px 4px 8px ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              position: 'sticky',
              top: 0,
              backgroundColor: theme.palette.background.paper,
              zIndex: 1,
              padding: '12px 0',
              marginBottom: 2,
              borderBottom: `2px solid`,
              borderImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.light}) 1`,
              borderImageSlice: 1,
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
