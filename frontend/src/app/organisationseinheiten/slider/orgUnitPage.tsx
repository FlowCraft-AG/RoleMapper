'use client';

import { Box, Modal, Slider, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import FunctionsSpalte from '../../../components/organigramm/FunctionsSpalte';
import OrgUnitsSpalte from '../../../components/organigramm/OrgUnitsSpalte';
import UserInfoSpalte from '../../../components/organigramm/UserInfoSpalte';
import UsersSpalte from '../../../components/organigramm/UsersSpalte';
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

  // Dynamische Breiten für die Spalten
  const [orgUnitsWidth, setOrgUnitsWidth] = useState(600); // Standard: 300px
  const [functionsWidth, setFunctionsWidth] = useState(400); // Standard: 600px
  const [usersWidth, setUsersWidth] = useState(400); // Standard: 400px

  // Benutzerdaten
  const [combinedUsers, setCombinedUsers] = useState<User[]>([]);
  const [isImpliciteFunction, setIsImpliciteFunction] =
    useState<boolean>(false);

  const theme = useTheme(); // Dynamisches Theme aus Material-UI
  const [isSingleUser, setIsSingleUser] = useState<boolean>(false);

  /**
   * Lädt Mitglieder der Organisationseinheit basierend auf Alias und Kostenstellennummer.
   * @param alias - Der Alias der Organisationseinheit
   * @param kostenstelleNr - Die Kostenstellennummer der Organisationseinheit
   * @returns Eine Liste der Mitglieder-IDs
   */
  const getMitgliederIds = async (alias: string, kostenstelleNr: string) => {
    try {
      return await getMitgliederIds(alias, kostenstelleNr);
    } catch (error) {
      console.error('Fehler beim Laden der Mitglieder:', error);
      return [];
    }
  };

 /**
   * Handelt die Auswahl einer Organisationseinheit.
   * @param orgUnitDTO - Die ausgewählte Organisationseinheit
   */
  const handleOrgUnitSelect = async (orgUnitDTO: OrgUnit) => {
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

  /**
   * Handelt die Auswahl einer Funktion.
   * @param functionInfo - Informationen zur ausgewählten Funktion
   */
  const handleFunctionSelect = (functionInfo: FunctionString) => {
    setSelectedFunctionId(functionInfo._id);
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
        {/* Header für Organisationseinheiten */}
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
