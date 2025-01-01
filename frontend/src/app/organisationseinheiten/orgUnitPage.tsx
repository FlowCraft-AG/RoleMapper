'use client';

import { Box, Modal, Typography, useTheme } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import FunctionsSpalte from '../../components/organigramm/FunctionsSpalte';
import OrgUnitsSpalte from '../../components/organigramm/OrgUnitsSpalte';
import UserInfoSpalte from '../../components/organigramm/UserInfoSpalte';
import UsersSpalte from '../../components/organigramm/UsersSpalte';
import { fetchMitglieder } from '../../lib/api/user.api';
import { useFacultyTheme } from '../../theme/ThemeProviderWrapper';
import { FunctionString, FunctionUser } from '../../types/function.type';
import { OrgUnit } from '../../types/orgUnit.type';
import { User } from '../../types/user.type';
import { getOrgUnitById } from '../../lib/api/orgUnit.api';
import { fetchFunctionById } from '../../lib/api/function.api';

export default function OrganigrammPage() {
  // Zustände für ausgewählte Elemente
  const [selectedOrgUnit, setSelectedOrgUnit] = useState<OrgUnit | undefined>(
    undefined,
  );
  const [selectedRootOrgUnit, setSelectedRootOrgUnit] = useState<
    OrgUnit | undefined
  >(undefined);

  const [selectedFunctionId, setSelectedFunctionId] = useState<
    string | undefined
  >(undefined);
  const [selectedFunction, setSelectedFunction] = useState<FunctionUser>();

  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined,
  );
  const [isSingleUser, setIsSingleUser] = useState<boolean>(false);

  // Benutzerdaten
  const [combinedUsers, setCombinedUsers] = useState<User[]>([]);
  const [isImpliciteFunction, setIsImpliciteFunction] =
    useState<boolean>(false);

  const theme = useTheme(); // Dynamisches Theme aus Material-UI
  const { setFacultyTheme } = useFacultyTheme(); // Dynamisches Theme nutzen

  const searchParams = useSearchParams();
  const openNodesParam = searchParams.get('openNodes') || '';
  const parentOrgUnitIdParam = searchParams.get('parentOrgUnitId') || '';
    const [expandedNodes, setExpandedNodes] = useState<string[] | undefined>([]);

    const resetUrlParams = () => {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete('openNodes');
      currentUrl.searchParams.delete('parentOrgUnitId');
      currentUrl.searchParams.delete('selectedNode');
      window.history.replaceState(null, '', currentUrl.toString());
    };

   const loadS = useCallback(async () => {
     try {
       if (openNodesParam) {
         const openNodes = openNodesParam.split(',').filter((id) => id);
         setExpandedNodes(openNodes);
       }

       if (parentOrgUnitIdParam) {
         const orgUnit = await getOrgUnitById(parentOrgUnitIdParam);
         if (orgUnit) setSelectedOrgUnit(orgUnit);
       }
     } catch (error) {
       console.error('Fehler beim Initialisieren der Daten:', error);
     }
   }, [openNodesParam, parentOrgUnitIdParam]);

  // URL-Parameter verarbeiten und Zustände aktualisieren
  useEffect(() => {
    loadS();
  }, [loadS, openNodesParam, parentOrgUnitIdParam]);

  useEffect(() => {
    console.log('Aktualisiertes Theme:', theme.palette);
  }, [setFacultyTheme, theme.palette]);

  // Mitglieder laden
  const getMitgliederIds = async (alias: string, kostenstelleNr: string) => {
    try {
      return await fetchMitglieder(alias, kostenstelleNr);
    } catch (error) {
      console.error('Fehler beim Laden der Mitglieder:', error);
      return [];
    }
  };

  // Organisationseinheit auswählen
    const handleOrgUnitSelect = async (orgUnit: OrgUnit) => {
      setSelectedOrgUnit(orgUnit);
      setSelectedFunctionId(undefined); // Reset selection
      setSelectedUserId(undefined); // Reset selection
      setSelectedRootOrgUnit(undefined);
      setExpandedNodes(undefined)

      if (orgUnit.alias || orgUnit.kostenstelleNr) {
        orgUnit.hasMitglieder = true;
        setSelectedRootOrgUnit(orgUnit);
        setCombinedUsers(
          await getMitgliederIds(orgUnit.alias!, orgUnit.kostenstelleNr!),
        );
      }

      resetUrlParams(); // URL-Parameter zurücksetzen
    };

  // Funktion auswählen
  const handleFunctionSelect = (functionInfo: FunctionString) => {
    setSelectedFunctionId(functionInfo._id);
    //setSelectedFunction(functionInfo);
    setSelectedUserId(undefined); // Reset selection
    setIsImpliciteFunction(functionInfo.isImpliciteFunction);
    setIsSingleUser(functionInfo.isSingleUser);
  };

  // Mitgliederansicht aktivieren
  const handleMitgliederClick = () => {
    setSelectedFunctionId('mitglieder'); // Reset functions
    setSelectedFunction(mitglied(selectedRootOrgUnit?._id));
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
    if (ids.includes(selectedOrgUnit?._id || '')) {
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
          onSelect={async (orgUnit) => handleOrgUnitSelect(orgUnit)}
          onRemove={handleRemove}
         expandedNodes={expandedNodes}
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
            padding: '0 2px 2px 2px',
            overflow: 'auto',
            maxHeight: 'calc(100vh - 64px)',
            borderRadius: 4,
            boxShadow: `0px 4px 8px ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            minWidth: 250,
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
            isSingleUser={isSingleUser}
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
