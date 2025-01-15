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

interface EditorViewProps {
  selectedProcess: Process;
}

export default function EditorView({
  selectedProcess,
}: EditorViewProps): JSX.Element {
  const theme = useTheme();
  const [selectedProcessRoles, setSelectedProcessRoles] = useState<
    ShortRole[] | undefined
  >(selectedProcess.roles);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newRoleModalOpen, setNewRoleModalOpen] = useState(false);
  const [existingRolesModalOpen, setExistingRolesModalOpen] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<ShortRole | undefined>();

  const [collectionRoles, setCollectionRoles] = useState<Role[] | undefined>(
    undefined,
  );
  const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);
  const [functions, setFunctions] = useState<FunctionString[]>([]);

  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const handleEditClick = (role: ShortRole | undefined) => {
    if (!role) return;
    setSelectedRole(role);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setSelectedRole(undefined);
    setEditModalOpen(false);
  };

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

  const handleAddRole = () => {
    console.log('Add role clicked');
    setAddModalOpen(true);
  };

  const handleSelectModalClose = () => {
    setAddModalOpen(false);
  };

  const handleNewRoleModalOpen = () => {
    setAddModalOpen(false);
    setNewRoleModalOpen(true);
  };

  const handleNewRoleModalClose = () => {
    setNewRoleModalOpen(false);
  };

  const handleExistingRolesModalOpen = () => {
    setAddModalOpen(false);
    setExistingRolesModalOpen(true);
  };

  const handleExistingRolesModalClose = () => {
    setExistingRolesModalOpen(false);
  };

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

  const handleUpdateRole = async (
    updatedRole: ShortRole | undefined,
    oldRoleId: string,
  ) => {
    if (!updatedRole) return;

    try {
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

  const handleSelectRole = (role: Role | null) => {
    if (role) {
      console.log('Ausgewählte Rolle:', role);
    }
  };

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
  }, [selectedProcess]);

  useEffect(() => {
    loadRoles();
  }, [selectedProcess, selectedProcessRoles, loadRoles]);

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
