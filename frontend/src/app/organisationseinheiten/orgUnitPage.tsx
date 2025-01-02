/**
 * @file OrganigrammPage.tsx
 * @description Stellt die Organigramm-Seite der Hochschule Karlsruhe (HSKA) dar. Diese Seite erlaubt es,
 * Organisationseinheiten, Funktionen und Benutzer hierarchisch zu durchsuchen und auszuwählen.
 *
 * @module OrganigrammPage
 */

'use client';

import { Box, Modal, Typography, useTheme } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import FunctionsSpalte from '../../components/organigramm/FunctionsSpalte';
import OrgUnitsSpalte from '../../components/organigramm/OrgUnitsSpalte';
import UserInfoSpalte from '../../components/organigramm/UserInfoSpalte';
import UsersSpalte from '../../components/organigramm/UsersSpalte';
import { getOrgUnitById } from '../../lib/api/orgUnit.api';
import { fetchMitglieder } from '../../lib/api/user.api';
import { FunctionString, FunctionUser } from '../../types/function.type';
import { OrgUnit } from '../../types/orgUnit.type';
import { User } from '../../types/user.type';

/**
 * Hauptkomponente für die Organigramm-Seite.
 *
 * Diese Komponente implementiert:
 * - Auswahl von Organisationseinheiten, Funktionen und Benutzern
 * - Dynamische Anzeige von Spalten für Organisationseinheiten, Funktionen, Benutzer und Benutzerdetails
 * - Modal-basierte Benutzerinformationen
 *
 * @component
 * @returns {JSX.Element} Die JSX-Struktur der Seite.
 *
 * @example
 * Verwendung in einer Next.js-App
 * <OrganigrammPage />
 */
export default function OrganigrammPage() {
  // Zustände für ausgewählte Elemente
  // Zustand für die Auswahl
  const [state, setState] = useState({
    selectedOrgUnit: undefined as OrgUnit | undefined,
    selectedRootOrgUnit: undefined as OrgUnit | undefined,
    selectedFunctionId: undefined as string | undefined,
    selectedFunction: undefined as FunctionUser | undefined,
    selectedUserId: undefined as string | undefined,
    expandedNodes: [] as string[],
    organizationUsers: [] as User[],
    isSingleUser: false,
    isImplicitFunction: false,
  });

  // Benutzerdaten
  const theme = useTheme(); // Dynamisches Theme aus Material-UI
  // const { setFacultyTheme } = useFacultyTheme(); // Dynamisches Theme nutzen

  // URL-Parameter
  const searchParams = useSearchParams();
  const openNodesParam = searchParams.get('openNodes') || '';
  const parentOrgUnitIdParam = searchParams.get('parentOrgUnitId') || '';

  const resetUrlParams = () => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('openNodes');
    currentUrl.searchParams.delete('parentOrgUnitId');
    currentUrl.searchParams.delete('selectedNode');
    window.history.replaceState(null, '', currentUrl.toString());
  };

  /**
   * Initialisiert die Seite basierend auf URL-Parametern.
   *
   * @function initializePageState
   * @async
   * @returns {Promise<void>}
   */
  const initializePageState = useCallback(async () => {
    try {
      const expandedNodes = openNodesParam.split(',').filter(Boolean);
      const selectedOrgUnit = parentOrgUnitIdParam
        ? await getOrgUnitById(parentOrgUnitIdParam)
        : undefined;

      setState((prev) => ({
        ...prev,
        expandedNodes,
        selectedOrgUnit,
        selectedFunctionId: undefined,
      }));
    } catch (error) {
      console.error('Fehler beim Initialisieren der Daten:', error);
    }
  }, [openNodesParam, parentOrgUnitIdParam]);

  useEffect(() => {
    initializePageState();
  }, [initializePageState]);

  useEffect(() => {
    console.log('Aktualisiertes Theme:', theme.palette);
  }, [theme.palette]);

  /**
   * Lädt Mitglieder einer Organisationseinheit.
   */
  const loadOrganizationMembers = async (
    alias: string,
    kostenstelleNr: string,
  ) => {
    try {
      return await fetchMitglieder(alias, kostenstelleNr);
    } catch (error) {
      console.error('Fehler beim Laden der Mitglieder:', error);
      return [];
    }
  };

  /**
   * Handhabt die Auswahl einer Organisationseinheit.
   */
  const handleOrgUnitSelect = async (orgUnit: OrgUnit) => {
    const users =
      orgUnit.alias && orgUnit.kostenstelleNr
        ? await loadOrganizationMembers(orgUnit.alias, orgUnit.kostenstelleNr)
        : [];

    const root = orgUnit.alias || orgUnit.kostenstelleNr ? orgUnit : undefined;

    setState({
      ...state,
      selectedOrgUnit: orgUnit,
      selectedRootOrgUnit: root,
      selectedFunctionId: undefined,
      selectedUserId: undefined,
      expandedNodes: [],
      organizationUsers: users,
    });

    resetUrlParams();
  };

  /**
   * Handhabt die Auswahl einer Funktion.
   */
  const handleFunctionSelect = (func: FunctionString) => {
    setState({
      ...state,
      selectedFunctionId: func._id,
      isImplicitFunction: func.isImpliciteFunction,
      isSingleUser: func.isSingleUser,
      selectedUserId: undefined,
    });
  };

  /**
   * Handhabt die Auswahl eines Benutzers.
   */
  const handleUserSelect = (userId: string) => {
    setState({ ...state, selectedUserId: userId });
  };

  /**
   * Löscht die Auswahl von Benutzern oder Funktionen.
   */
  const handleRemoveSelection = (ids: string[]) => {
    setState({
      ...state,
      selectedUserId: ids.includes(state.selectedUserId!)
        ? undefined
        : state.selectedUserId,
      selectedFunctionId: ids.includes(state.selectedFunctionId!)
        ? undefined
        : state.selectedFunctionId,
      selectedOrgUnit: ids.includes(state.selectedOrgUnit?._id || '')
        ? undefined
        : state.selectedOrgUnit,
    });
  };

  // Mitgliederansicht aktivieren
  const handleMitgliederClick = () => {
    setState({
      ...state,
      selectedFunctionId: 'mitglieder',
      selectedFunction: createMembersFunction(state.selectedOrgUnit?._id),
      isImplicitFunction: false,
      isSingleUser: false,
      selectedUserId: undefined,
    });
  };

  /**
   * Erzeugt die Mitglieder-Funktion für eine Organisationseinheit.
   */
  const createMembersFunction = (orgUnitId?: string): FunctionUser => ({
    _id: 'mitglieder',
    functionName: 'Mitglieder',
    orgUnit: orgUnitId ?? '',
    users: state.organizationUsers,
    isImpliciteFunction: false,
    // isSingleUser: false,
  });

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
          onRemove={handleRemoveSelection}
          expandedNodes={state.expandedNodes}
        />
      </Box>

      {/* Zweite Spalte: Funktionen */}
      {state.selectedOrgUnit && (
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
            orgUnit={state.selectedOrgUnit}
            onSelect={handleFunctionSelect}
            rootOrgUnit={state.selectedRootOrgUnit}
            handleMitgliederClick={handleMitgliederClick}
            onRemove={handleRemoveSelection}
          />
        </Box>
      )}

      {/* Dritte Spalte: Benutzer-IDs */}
      {state.selectedFunctionId && (
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
            selectedFunctionId={state.selectedFunctionId}
            selectedMitglieder={state.selectedFunction}
            onSelectUser={handleUserSelect}
            onRemove={handleRemoveSelection}
            isImpliciteFunction={state.isImplicitFunction}
            isSingleUser={state.isSingleUser}
          />
        </Box>
      )}

      {/* Vierte Spalte: Benutzerinformationen als Modal */}
      <Modal
        open={Boolean(state.selectedUserId)}
        onClose={() => setState({ ...state, selectedUserId: undefined })}
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
          {state.selectedUserId && (
            <UserInfoSpalte userId={state.selectedUserId} />
          )}
        </Box>
      </Modal>
    </Box>
  );
}
