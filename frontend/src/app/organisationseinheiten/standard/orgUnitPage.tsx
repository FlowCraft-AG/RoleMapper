'use client';

import { Box, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import FunctionsSpalte from '../../../components/organigramm/FunctionsSpalte';
import OrgUnitsSpalte from '../../../components/organigramm/OrgUnitsSpalte';
import UserInfoSpalte from '../../../components/organigramm/UserInfoSpalte';
import UsersSpalte from '../../../components/organigramm/UsersSpalte';
import { fetchMitglieder } from '../../../lib/api/rolemapper/user.api';
import { useFacultyTheme } from '../../../theme/ThemeProviderWrapper';
import { FunctionString, FunctionUser } from '../../../types/function.type';
import { OrgUnit } from '../../../types/orgUnit.type';
import { User } from '../../../types/user.type';

/**
 * Organigramm-Seite zur Anzeige und Verwaltung von Organisationseinheiten,
 * Funktionen, Benutzern und Benutzerinformationen.
 */

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

  // Benutzerdaten
  const [combinedUsers, setCombinedUsers] = useState<User[]>([]);
  const [isImpliciteFunction, setIsImpliciteFunction] =
    useState<boolean>(false);

  const theme = useTheme(); // Dynamisches Theme aus Material-UI
  const { setFacultyTheme } = useFacultyTheme(); // Dynamisches Theme nutzen
  const [isSingleUser, setIsSingleUser] = useState<boolean>(false);

  useEffect(() => {
    console.log('Aktualisiertes Theme:', theme.palette);
  }, [setFacultyTheme, theme.palette]);

  /**
   * Lädt Mitglieder der Organisationseinheit basierend auf Alias und Kostenstellennummer.
   * @param alias - Der Alias der Organisationseinheit
   * @param kostenstelleNr - Die Kostenstellennummer der Organisationseinheit
   * @returns Eine Liste der Mitglieder-IDs
   */
  const getMitgliederIds = async (alias: string, kostenstelleNr: string) => {
    try {
      return await fetchMitglieder(alias, kostenstelleNr);
    } catch (error) {
      console.error('Fehler beim Laden der Mitglieder:', error);
      return [];
    }
  };

  /**
   * Handelt die Auswahl einer Organisationseinheit.
   * @param orgUnitDTO - Die ausgewählte Organisationseinheit
   */
  const handleOrgUnitSelect = async (orgUnit: OrgUnit) => {
    setSelectedOrgUnit(orgUnit);
    setSelectedFunctionId(undefined); // Reset selection
    setSelectedUserId(undefined); // Reset selection
    setSelectedRootOrgUnit(undefined);

    if (orgUnit.alias || orgUnit.kostenstelleNr) {
      orgUnit.hasMitglieder = true;
      setSelectedRootOrgUnit(orgUnit);
      setCombinedUsers(
        await getMitgliederIds(orgUnit.alias!, orgUnit.kostenstelleNr!),
      );
    }
  };

  /**
   * Handelt die Auswahl einer Funktion.
   * @param functionInfo - Informationen zur ausgewählten Funktion
   */
  const handleFunctionSelect = (func: FunctionString) => {
    setSelectedFunctionId(func._id);
    //setSelectedFunction(functionInfo);
    setSelectedUserId(undefined); // Reset selection
    setIsImpliciteFunction(func.isImpliciteFunction);
    setIsSingleUser(func.isSingleUser);
  };

  // Mitgliederansicht aktivieren
  const handleMitgliederClick = () => {
    setSelectedFunctionId('mitglieder'); // Reset functions
    setSelectedFunction(mitglied(selectedRootOrgUnit?._id));
    setSelectedUserId(undefined); // Reset users
    setIsImpliciteFunction(false);
  };

  /**
   * Handelt die Auswahl eines Benutzers.
   * @param userId - Die ID des ausgewählten Benutzers
   */
  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
  };

  /**
   * Entfernt ein ausgewähltes Element (Organisationseinheit, Funktion oder Benutzer).
   * @param ids - Eine Liste von IDs der zu entfernenden Elemente
   */
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

  /**
   * Erstellt eine Mitgliederfunktion für eine Organisationseinheit.
   * @param orgUnitId - Die ID der Organisationseinheit
   * @returns Die Mitgliederfunktion
   */
  const mitglied = (orgUnitId: string | undefined) => {
    return {
      _id: 'mitglieder',
      functionName: 'Mitglieder',
      orgUnit: orgUnitId ?? '',
      users: combinedUsers,
      isImpliciteFunction: false,
      isSingleUser: false,
    } as FunctionUser;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        padding: 2,
        backgroundColor: theme.palette.background.default,
        overflowY: 'auto', // Allgemeines Scrollen (horizontal und vertikal)
        height: '100vh', // Volle Höhe des Viewports
        width: '100vw', // Volle Breite des Viewports
      }}
    >
      {/* Erste Spalte: Organisationseinheiten */}
      <Box
        sx={{
          flexShrink: 0, // Keine Verkleinerung
          minWidth: 350, // Feste Breite
          borderRight: `1px solid ${theme.palette.divider}`,
          paddingRight: 2,
          marginRight: 2,
          paddingTop: 2,
          overflowX: 'auto', // Horizontales Scrollen für diese Spalte
        }}
      >
        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: 2,
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
            flexShrink: 0, // Keine Verkleinerung
            minWidth: 350, // Feste Breite
            borderRight: `1px solid ${theme.palette.divider}`,
            paddingRight: 2,
            marginRight: 2,
            paddingTop: 2,
            overflowX: 'auto', // Horizontales Scrollen für diese Spalte
          }}
        >
          <Typography
            variant="h6"
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
            flexShrink: 0, // Keine Verkleinerung
            minWidth: 350, // Feste Breite
            borderRight: `1px solid ${theme.palette.divider}`,
            paddingRight: 2,
            marginRight: 2,
            //paddingTop: 2,
            overflowX: 'auto', // Horizontales Scrollen für diese Spalte
          }}
        >
          <Box
            sx={{
              position: 'sticky',
              top: 0, // Überschrift bleibt oben
              backgroundColor: theme.palette.background.default,
              zIndex: 1,
              padding: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                fontWeight: 'bold',
                marginBottom: 2,
              }}
            >
              Benutzer
            </Typography>
          </Box>
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

      {/* Vierte Spalte: Benutzerinformationen */}
      {selectedUserId && (
        <Box
          sx={{
            flexShrink: 0, // Keine Verkleinerung
            minWidth: 250, // Feste Breite
            paddingTop: 2,
          }}
        >
          <Typography
            variant="h6"
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
