'use client';

import { Add, Delete, Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { JSX, useCallback, useEffect, useState } from 'react';
import { fetchAllFunctions } from '../../lib/api/rolemapper/function.api';
import { fetchAllOrgUnits } from '../../lib/api/rolemapper/orgUnit.api';
import {
  fetchRoles,
  removeProcessRole,
  updateProcessRole,
} from '../../lib/api/rolemapper/roles.api';
import { FunctionString } from '../../types/function.type';
import { OrgUnit } from '../../types/orgUnit.type';
import { Process, ShortRole } from '../../types/process.type';
import { Role } from '../../types/role.type';
import ExistingRolesModal from '../modal/processModals/AddExistingRoleModal';
import NewRoleModal from '../modal/processModals/AddNewRoleModal';
import SelectAddRoleModal from '../modal/processModals/SelectAddRoleModal';
import RoleEditModal from '../modal/rolesModal/RoleEditModal';

/**
 * Die Eigenschaften für die `EditorView`-Komponente
 */
interface EditorViewProps {
  // Der aktuell ausgewählte Prozess, für den Rollen verwaltet werden
  selectedProcess: Process;
}

/**
 * Hauptkomponente, die eine Editor-Ansicht für Rollen innerhalb eines Prozesses darstellt.
 * 
 * @param {EditorViewProps} props Die Eigenschaften für die Komponente
 * @returns {JSX.Element} Die gerenderte Editor-Ansicht
 */
export default function EditorView({
  selectedProcess,
}: EditorViewProps): JSX.Element {
  const theme = useTheme();

  /** Die aktuell ausgewählten Rollen des Prozesses */
  const [selectedProcessRoles, setSelectedProcessRoles] = useState<
    ShortRole[] | undefined
  >(selectedProcess.roles);

  /** Zustandsvariablen für verschiedene Modale */
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newRoleModalOpen, setNewRoleModalOpen] = useState(false);
  const [existingRolesModalOpen, setExistingRolesModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  /** Die aktuell ausgewählte Rolle für die Bearbeitung */
  const [selectedRole, setSelectedRole] = useState<ShortRole | undefined>();

  /** Gesammelte Rollen, Organisationseinheiten und Funktionen */ 
  const [collectionRoles, setCollectionRoles] = useState<Role[] | undefined>(
    undefined,
  );
  const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);
  const [functions, setFunctions] = useState<FunctionString[]>([]);

  /** Snackbar für Benachrichtigungen */
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  /**
   * Öffnet das Bearbeitungsmodal für eine ausgewählte Rolle
   * 
   * @param {ShortRole | undefined} role Die Rolle, die bearbeitet werden soll
   */
  const handleEditClick = (role: ShortRole | undefined) => {
    if (!role) return;
    setSelectedRole(role);
    setEditModalOpen(true);
  };

  /**
   * Schließt das Bearbeitungsmodal
   */
  const handleEditModalClose = () => {
    setSelectedRole(undefined);
    setEditModalOpen(false);
  };

  /**
   * Löscht eine Rolle aus dem aktuellen Prozess
   * 
   * @param {ShortRole} roleToDelete Die zu löschende Rolle
   */
  const handleDeleteClick = async (roleToDelete: ShortRole) => {
    try {
      await removeProcessRole(
        selectedProcess._id,
        selectedProcessRoles!,
        roleToDelete.roleId,
      );

      // Aktualisiere die Ansicht
      const updatedRoles = selectedProcessRoles?.filter(
        (role) => role.roleId !== roleToDelete.roleId,
      );
      selectedProcess.roles = updatedRoles;
      setSelectedProcessRoles(updatedRoles);

      // Zeige eine Bestätigung an
      setSnackbar({
        open: true,
        message: 'Rolle erfolgreich gelöscht!',
      });
    } catch (error) {
      console.error('Fehler beim Löschen der Rolle:', error);
      setSnackbar({
        open: true,
        message: 'Fehler beim Löschen der Rolle.',
      });
    }
  };

  /**
 * Öffnet das Modal zum Hinzufügen einer neuen Rolle.
  */
  const handleAddRole = () => {
    console.log('Add role clicked');
    setAddModalOpen(true);
  };

  /**
  * Schließt das Modal zur Rollenauswahl.
  */
  const handleSelectModalClose = () => {
    setAddModalOpen(false);
  };

  /**
  * Öffnet das Modal zum Erstellen einer neuen Rolle und schließt das Auswahl-Modal.
  */
  const handleNewRoleModalOpen = () => {
    setAddModalOpen(false);
    setNewRoleModalOpen(true);
  };

  /**
  * Schließt das Modal zum Erstellen einer neuen Rolle.
  */
  const handleNewRoleModalClose = () => {
    setNewRoleModalOpen(false);
  };

  /**
  * Öffnet das Modal zum Auswählen bestehender Rollen und schließt das Auswahl-Modal.
  */
  const handleExistingRolesModalOpen = () => {
    setAddModalOpen(false);
    setExistingRolesModalOpen(true);
  };

  /**
  * Schließt das Modal für bestehende Rollen.
  */
  const handleExistingRolesModalClose = () => {
    setExistingRolesModalOpen(false);
  };


  /** 
   * Aktualisiert die Daten einer Rolle sowohl in der lokalen State-Variable `collectionRoles`
   * als auch in den Rollen des ausgewählten Prozesses.
   *
   * @param {ShortRole | undefined} updatedRole - Die aktualisierte Rolle.
   * @param {string} oldRoleId - Die ID der zu ersetzenden alten Rolle.
   */
  const refresh = (updatedRole: ShortRole | undefined, oldRoleId: string) => {
    // Aktualisiere die Rolle in der `roles`-Liste
    setCollectionRoles(
      (prevRoles) =>
        prevRoles?.map((role) =>
          role.roleId === oldRoleId ? { ...role, ...updatedRole } : role,
        ) || [],
    );

    // Aktualisiere die Rolle in `selectedProcess.roles`
    const updatedProcessRoles = selectedProcess.roles?.map((role) =>
      role.roleId === oldRoleId ? { ...role, ...updatedRole } : role,
    );

    // Aktualisiere `selectedProcess`
    selectedProcess.roles = updatedProcessRoles;
    setSelectedProcessRoles(updatedProcessRoles);
    console.log(selectedProcess.roles);
  };

  /**
   * Aktualisiert eine Rolle, speichert die Änderungen im Backend und synchronisiert den lokalen State.
   *
   * @param {ShortRole | undefined} updatedRole - Die aktualisierte Rolle.
   * @param {string} oldRoleId - Die ID der zu ersetzenden alten Rolle.
   */
  const handleUpdateRole = async (
    updatedRole: ShortRole | undefined,
    oldRoleId: string,
  ) => {
    if (!updatedRole) return;

    try {
      //Backend-Aufruf zum Speichern der Rolle 
      await updateProcessRole(
        selectedProcess._id,
        selectedProcess.name,
        selectedProcessRoles,
        updatedRole,
        oldRoleId,
      );

      refresh(updatedRole, oldRoleId);

      setSnackbar({
        open: true,
        message: 'Rolle erfolgreich aktualisiert!',
      });
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Rolle:', error);
      setSnackbar({
        open: true,
        message: 'Fehler beim Aktualisieren der Rolle.',
      });
    }
  };

  /**
   * Verarbeitet die Auswahl einer Rolle im Modal.
   *
   * @param {Role | null} role - Die ausgewählte Rolle oder `null`, wenn keine Rolle ausgewählt wurde.
   */
  const handleSelectRole = (role: Role | null) => {
    if (role) {
      console.log('Ausgewählte Rolle:', role);
    }
  };

  /**
   * Lädt Rollen, Organisationseinheiten und Funktionen für den ausgewählten Prozess.
   * Wenn keine Rollen vorhanden sind, wird die Rollenliste geleert.
   */
  const loadRoles = useCallback(async () => {
    try {
      if (!selectedProcess.roles || selectedProcess.roles?.length === 0) {
        setCollectionRoles([]);
        return;
      }

      const roleIds = selectedProcess.roles?.map((role) => role.roleId);
      const [loadedRoles, loadedOrgUnits, loadedFunctions] = await Promise.all([
        fetchRoles(roleIds),
        fetchAllOrgUnits(),
        fetchAllFunctions(),
      ]);

      setCollectionRoles(loadedRoles);
      setOrgUnits(loadedOrgUnits);
      setFunctions(loadedFunctions);
    } catch (err) {
      console.error('Fehler beim Laden der Rollen:', err);
    }
  }, [selectedProcess, selectedProcessRoles]);

  /**
   * Effekt, um Rollen zu laden, wenn sich der ausgewählte Prozess oder die Prozessrollen ändern.
   */
  useEffect(() => {
    loadRoles();
  }, [selectedProcess, selectedProcessRoles]);

  return (
    <>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
      />
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
        {selectedProcess.name}
      </Typography>

      {/* Modernisierte Tabelle */}
      <Box
        component="table"
        sx={{
          width: '100%',
          borderCollapse: 'collapse',
          overflow: 'hidden',
          borderRadius: '8px',
          boxShadow: `0px 2px 8px ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                padding: '12px',
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: '1rem',
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
              }}
            >
              Rollen
            </th>
            <th
              style={{
                padding: '12px',
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: '1rem',
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
              }}
            >
              Funktionen
            </th>
            <th
              style={{
                padding: '12px',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '1rem',
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
              }}
            >
              Aktionen
            </th>
          </tr>
        </thead>
        <tbody>
          {selectedProcess.roles && selectedProcess.roles.length > 0 ? (
            selectedProcess.roles.map((processRole, index) => {
              // Passende Rolle aus der `roles`-Liste finden
              let matchedRole;
              let name;
              switch (processRole.roleType) {
                case 'COLLECTION':
                  matchedRole = collectionRoles?.find(
                    (role) => role.roleId === processRole.roleId,
                  );
                  name = `Rolle: ${matchedRole?.name}`;
                  break;
                case 'IMPLICITE_ORG_UNIT':
                  matchedRole = orgUnits.find(
                    (orgUnit) => orgUnit._id === processRole.roleId,
                  );
                  name = `Funktion: Alle Mitglieder von ${matchedRole?.name}`;
                  break;
                case 'IMPLICITE_FUNCTION':
                  matchedRole = functions.find(
                    (func) => func._id === processRole.roleId,
                  );
                  name = `Funktion: Implizite Funktion: ${matchedRole?.functionName}`;
                  break;
                default:
                  matchedRole = null;
              }
              return (
                <tr
                  key={index}
                  style={{
                    backgroundColor:
                      index % 2 === 0
                        ? theme.palette.background.default
                        : theme.palette.action.hover,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <td style={{ padding: '12px', textAlign: 'left' }}>
                    {processRole.roleName}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'left' }}>
                    {/* Platzhalter für Funktionen */}
                    <Typography variant="body2" color="textSecondary">
                      {name || 'Keine Funktionen/Rolle zugewiesen'}
                    </Typography>
                  </td>
                  <td
                    style={{
                      padding: '12px',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Tooltip title="Bearbeiten">
                      <IconButton
                        onClick={() => handleEditClick(processRole)}
                        sx={{
                          color: theme.palette.info.main,
                          '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.1)',
                            color: theme.palette.info.dark,
                          },
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Löschen">
                      <IconButton
                        onClick={() => handleDeleteClick(processRole)}
                        sx={{
                          color: theme.palette.error.main,
                          '&:hover': {
                            backgroundColor: 'rgba(211, 47, 47, 0.1)',
                            color: theme.palette.error.dark,
                          },
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={3}
                style={{
                  padding: '12px',
                  textAlign: 'center',
                  fontStyle: 'italic',
                  color: theme.palette.text.secondary,
                }}
              >
                Keine Rollen verfügbar
              </td>
            </tr>
          )}
        </tbody>
      </Box>

      {/* Button zum Hinzufügen von Rollen */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddRole}
        sx={{
          marginTop: 2,
          width: '100%',
          padding: '10px',
          fontWeight: 'bold',
          textTransform: 'none',
        }}
        startIcon={<Add />}
      >
        Rolle hinzufügen
      </Button>

      {/* Modal für Auswahl */}
      <SelectAddRoleModal
        open={addModalOpen}
        onClose={handleSelectModalClose}
        onSelectType={(type) => {
          if (type === 'explizite') {
            handleNewRoleModalOpen();
          } else if (type === 'implizite') {
            handleExistingRolesModalOpen();
          }
        }}
      />

      {/* Modal für neue Rolle */}
      <NewRoleModal open={newRoleModalOpen} onClose={handleNewRoleModalClose} />

      {/* Modal für existierende Rollen */}
      <ExistingRolesModal
        open={existingRolesModalOpen}
        collectionRoles={collectionRoles}
        onClose={handleExistingRolesModalClose}
        onSelectRole={handleSelectRole}
      />

      {/* Edit-Modal */}
      <RoleEditModal
        open={editModalOpen}
        role={selectedRole}
        onClose={handleEditModalClose}
        onSave={handleUpdateRole}
      />
    </>
  );
}
