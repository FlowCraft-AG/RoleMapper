'use client';

import { Add, Delete, Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { JSX, useCallback, useEffect, useState } from 'react';
import { useModal } from '../../hooks/useModal';
import { useRoleManager } from '../../hooks/useRoleManager';
import { useSnackbar } from '../../hooks/useSnackbar';
import { fetchAllFunctions } from '../../lib/api/rolemapper/function.api';
import { fetchAllOrgUnits } from '../../lib/api/rolemapper/orgUnit.api';
import {
  deleteProcess,
  getProcessById,
  updateProcess,
} from '../../lib/api/rolemapper/process.api';
import { fetchRoles } from '../../lib/api/rolemapper/roles.api';
import { FunctionString } from '../../types/function.type';
import { OrgUnit } from '../../types/orgUnit.type';
import { Process, ShortRole } from '../../types/process.type';
import { Role } from '../../types/role.type';
import DeleteProcessDialog from '../modal/processModals/DeleteProcessDialog';
import EditProcessDialog from '../modal/processModals/EditProcessDialog';
import AddRoleModal from '../modal/rolesModal/AddRoleModal';
import RoleEditModal from '../modal/rolesModal/RoleEditModal';

interface EditorViewProps {
  selectedProcess: Process;
  onRemove: () => void;
}

export default function EditorView({
  selectedProcess,
  onRemove,
}: EditorViewProps): JSX.Element {
  const theme = useTheme();
  const { showSnackbar } = useSnackbar();
  const { isOpen, openModal, closeModal } = useModal();
  const [process, setProcess] = useState<Process>(selectedProcess);

  const { roles, updateRole, addRole, removeRole } = useRoleManager(process);

  const [collectionRoles, setCollectionRoles] = useState<Role[]>([]);
  const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);
  const [functions, setFunctions] = useState<FunctionString[]>([]);
  const [editProcessDialogOpen, setEditProcessDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<ShortRole | undefined>();

  const handleEditRoleClick = (role: ShortRole) => {
    setSelectedRole(role);
    openModal('editRole');
  };

  const handleAddRoleClick = () => {
    setSelectedRole(undefined);
    openModal('addRole');
  };

  const handleAddRole = async (role: ShortRole) => {
    try {
      await addRole(role); // Rolle hinzufügen und Zustand aktualisieren
      showSnackbar('Rolle erfolgreich hinzugefügt.', 'success');
    } catch {
      showSnackbar('Fehler beim Hinzufügen der Rolle.', 'error');
    }
  };

  const handleUpdateRole = async (
    updatedRole: ShortRole,
    oldRoleId: string,
  ) => {
    try {
      await updateRole(updatedRole, oldRoleId); // Rolle aktualisieren
      showSnackbar('Rolle erfolgreich aktualisiert.', 'success');
    } catch {
      showSnackbar('Fehler beim Aktualisieren der Rolle.', 'error');
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    try {
      await removeRole(roleId); // Rolle entfernen und Zustand aktualisieren
      showSnackbar('Rolle erfolgreich gelöscht.', 'success');
    } catch {
      showSnackbar('Fehler beim Löschen der Rolle.', 'error');
    }
  };

  const handleEditProcess = async (name: string, parentId: string) => {
    try {
      await updateProcess(process._id, name, parentId, process.roles);
      showSnackbar('Prozess erfolgreich aktualisiert.', 'success');
    } catch {
      showSnackbar('Fehler beim Aktualisieren des Prozesses.', 'error');
    }
  };

  const handleDeleteProcess = async () => {
    try {
      await deleteProcess(process._id);
      onRemove();
      showSnackbar('Prozess erfolgreich gelöscht.', 'success');
    } catch {
      showSnackbar('Fehler beim Löschen des Prozesses.', 'error');
    }
  };

  // Lade den Prozess neu, wenn sich selectedProcess ändert
  const loadProcess = useCallback(async () => {
    try {
      const process = await getProcessById(selectedProcess._id);
      setProcess(process);
    } catch (err) {
      showSnackbar('Fehler beim Laden des Prozesses.', 'error');
    }
  }, [process, showSnackbar]);

  // Lade Rollen, Organisationseinheiten und Funktionen
  const loadRoles = useCallback(async () => {
    try {
      if (roles.length === 0) return;

      const [loadedRoles, loadedOrgUnits, loadedFunctions] = await Promise.all([
        fetchRoles(),
        fetchAllOrgUnits(),
        fetchAllFunctions(),
      ]);

      console.log('loadedRoles', loadedRoles);

      setCollectionRoles(loadedRoles);
      setOrgUnits(loadedOrgUnits);
      setFunctions(loadedFunctions);
    } catch (err) {
      showSnackbar('Fehler beim Laden der Rollen.', 'error');
    }
  }, [roles, showSnackbar]);

  // Aktualisiere Prozess und Rollen, wenn sich selectedProcess ändert
  useEffect(() => {
    loadProcess();
    loadRoles();
  }, [selectedProcess]);

  return (
    <>
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
        {process.name}
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
          {roles.length > 0 ? (
            roles.map((processRole, index) => {
              let matchedRole;
              let name;
              switch (processRole.roleType) {
                case 'COLLECTION':
                  matchedRole = collectionRoles?.find(
                    (role) => role._id === processRole.roleId,
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
                  name = 'Unbekannt';
              }
              console.log('processRole', processRole);
              console.log('matchedRole', matchedRole);
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
                        onClick={() => handleEditRoleClick(processRole)}
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
                        onClick={() => handleRemoveRole(processRole.roleId)}
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

      {/* Buttons */}
      <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
        {/* Rolle hinzufügen */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => openModal('addRole')}
          startIcon={<Add />}
          sx={{ flexGrow: 1 }}
        >
          Rolle hinzufügen
        </Button>

        {/* Prozess ändern */}
        <Button
          variant="outlined"
          color="info"
          onClick={() => setEditProcessDialogOpen(true)}
          startIcon={<Edit />}
          sx={{ flexGrow: 1 }}
        >
          Prozess ändern
        </Button>

        {/* Prozess löschen */}
        <Button
          variant="outlined"
          color="error"
          onClick={() => setDeleteDialogOpen(true)}
          startIcon={<Delete />}
          sx={{ flexGrow: 1 }}
        >
          Prozess löschen
        </Button>
      </Box>

      {/* Modale */}
      <AddRoleModal
        open={isOpen('addRole')}
        onClose={() => closeModal('addRole')}
        onSave={handleAddRole} // Fehler werden in handleAddRole behandelt
      />

      <RoleEditModal
        open={isOpen('editRole')}
        role={selectedRole}
        onClose={() => closeModal('editRole')}
        onSave={(role) => handleUpdateRole(role!, selectedRole?.roleId || '')}
      />

      {/* Dialoge */}
      <EditProcessDialog
        open={editProcessDialogOpen}
        onClose={() => setEditProcessDialogOpen(false)}
        processName={process.name}
        processParentId={process.parentId || ''}
        onSave={handleEditProcess}
      />

      <DeleteProcessDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={handleDeleteProcess}
      />
    </>
  );
}
