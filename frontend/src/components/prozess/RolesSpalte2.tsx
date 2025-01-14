/**
 * @file RolesSpalte.tsx
 * @description Stellt den Bereich für die Prozess-Details inklusive der Rollen dar.
 *
 * @module RolesSpalte
 */

'use client';

import { Add, Delete, Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid2,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { JSX, useCallback, useEffect, useState } from 'react';
import { fetchRoles, updateProcessRole } from '../../lib/api/rolemapper/roles.api';
import { Process, ShortRole } from '../../types/process.type';
import { Role } from '../../types/role.type';
import ExistingRolesModal from '../modal/processModals/AddExistingRoleModal';
import NewRoleModal from '../modal/processModals/AddNewRoleModal';
import SelectAddRoleModal from '../modal/processModals/SelectAddRoleModal';
import RoleEditModal from '../modal/rolesModal/RoleEditModal';
import { OrgUnit } from '../../types/orgUnit.type';
import { FunctionString } from '../../types/function.type';
import { fetchAllOrgUnits } from '../../lib/api/rolemapper/orgUnit.api';
import { fetchAllFunctions } from '../../lib/api/rolemapper/function.api';

interface RolesSpalteProps {
  selectedProcess: Process;
}

/**
 * Komponente für die Anzeige von Rollen eines Prozesses mit modernem Design.
 *
 * @param {RolesSpalteProps} props - Eigenschaften der Komponente.
 * @returns {JSX.Element} - JSX-Element für die Rollen-Details.
 */
export default function RolesSpalte({
  selectedProcess,
}: RolesSpalteProps): JSX.Element {
    const theme = useTheme(); // Theme verwenden
    const [selectedProcessRoles, setSelectedProcessRoles] = useState<ShortRole[] | undefined>(selectedProcess.roles);
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [newRoleModalOpen, setNewRoleModalOpen] = useState(false);
  const [existingRolesModalOpen, setExistingRolesModalOpen] = useState(false);

  const [roles, setRoles] = useState<Role[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [editModalOpen, setEditModalOpen] = useState(false);
    const [editRole, setEditRole] = useState<ShortRole | undefined>();
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });
    const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);
      const [functions, setFunctions] = useState<FunctionString[]>([]);

  const handleSaveRole = (updatedRole: Role) => {
    setRoles(
      (prev) =>
        prev?.map((role) =>
          role.roleId === updatedRole.roleId ? updatedRole : role,
        ) || [],
    );
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

      // Aktualisiere die Rolle in der `roles`-Liste
      setRoles(
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

  // Handler für das Öffnen und Schließen der Modale
  const handleAddRole = () => {
    setSelectModalOpen(true);
  };

  const handleSelectModalClose = () => {
    setSelectModalOpen(false);
  };

  const handleNewRoleModalOpen = () => {
    setSelectModalOpen(false);
    setNewRoleModalOpen(true);
  };

  const handleNewRoleModalClose = () => {
    setNewRoleModalOpen(false);
  };

  const handleExistingRolesModalOpen = () => {
    setSelectModalOpen(false);
    setExistingRolesModalOpen(true);
  };

  const handleExistingRolesModalClose = () => {
    setExistingRolesModalOpen(false);
  };

  const handleEditClick = (role: ShortRole | undefined) => {
    if (!role) return;
    setEditRole(role);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditRole(undefined);
    setEditModalOpen(false);
  };

    const loadRoles = useCallback(async () => {
      try {
        if (!selectedProcess.roles || selectedProcess.roles?.length === 0) {
          setRoles([]);
          return;
        }

        const roleIds = selectedProcess.roles?.map((role) => role.roleId);
        const [loadedRoles, loadedOrgUnits, loadedFunctions] =
          await Promise.all([
            fetchRoles(roleIds),
            fetchAllOrgUnits(),
            fetchAllFunctions(),
          ]);

        setRoles(loadedRoles);
        setOrgUnits(loadedOrgUnits);
        setFunctions(loadedFunctions);
      } catch (err) {
        console.error('Fehler beim Laden der Rollen:', err);
      } finally {
        setLoading(false);
      }
    }, [selectedProcess]);

  // Rollen dynamisch laden
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

        <Box
          sx={{
            flexGrow: 1,
            padding: 4,
            overflow: 'auto',
            maxHeight: 'calc(100vh - 64px)',
            borderRadius: 6,
            backgroundColor: theme.palette.background.default,
            boxShadow: `0px 8px 16px ${theme.palette.divider}`,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              position: 'sticky',
              top: 0,
              height: '64px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.palette.background.paper,
              zIndex: 1,
              padding: '12px 0',
              marginBottom: 3,
              borderBottom: `2px solid`,
              borderImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main}) 1`,
              borderImageSlice: 1,
            }}
          >
            Editor: {selectedProcess.name}
          </Typography>

          {/* Rollen-Anzeige */}
          <Grid2 container spacing={2}>
            {selectedProcessRoles && selectedProcessRoles.length > 0 ? (
              selectedProcessRoles.map((processRole, index) => {
                  // Passende Rolle aus der `roles`-Liste finden
                  let matchedRole;
                  let name;
                  switch (processRole.roleType) {
                      case 'COLLECTION':
                          matchedRole = roles?.find(
                              (role) => role.roleId === processRole.roleId,
                          );
                          name = matchedRole?.name;
                          break;
                      case 'IMPLICITE_ORG_UNIT':
                          matchedRole = orgUnits.find(
                              (orgUnit) => orgUnit._id === processRole.roleId,
                          );
                          name = `Alle Mitglieder von ${matchedRole?.name}`;
                      break;
                    case 'IMPLICITE_FUNCTION':
                      matchedRole = functions.find(
                        (func) => func._id === processRole.roleId,
                      );
                          name = `Implizite Funktion: ${matchedRole?.functionName}`;
                      break;
                    default:
                      matchedRole = null;
                  }

               // console.log(matchedRole);
                return (
                  <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    <Card
                      sx={{
                        boxShadow: `0px 4px 8px ${theme.palette.divider}`,
                        borderRadius: 4,
                        '&:hover': {
                          transform: 'scale(1.03)',
                          transition: 'all 0.2s',
                        },
                      }}
                      // onClick={() => handleRoleClick(role)}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 'bold', marginBottom: 1 }}
                        >
                          {processRole.roleName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Funktionen: {name || 'Keine Funktionen'}
                        </Typography>
                      </CardContent>

                      {/* Bearbeiten-Button */}
                      <Tooltip title="Bearbeiten">
                        <IconButton
                          sx={{ position: 'absolute', top: 8, right: 40 }}
                          onClick={() => handleEditClick(processRole)}
                        >
                          <Edit />
                        </IconButton>
                            </Tooltip>

                      {/* Löschen-Button */}
                      <Tooltip title="Löschen">
                        <IconButton
                          sx={{ position: 'absolute', top: 8, right: 8 }}
                         // onClick={() => handleDeleteClick(processRole)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Card>
                  </Grid2>
                );
              })
            ) : (
              <Grid2 size={{ xs: 12 }}>
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: 'center',
                    fontStyle: 'italic',
                    color: theme.palette.text.secondary,
                  }}
                >
                  Keine Rollen verfügbar
                </Typography>
              </Grid2>
            )}
          </Grid2>

          {/* Button zum Hinzufügen von Rollen */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddRole}
            sx={{
              marginTop: 4,
              width: '100%',
              padding: '12px',
              fontWeight: 'bold',
              textTransform: 'none',
              backgroundImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}
            startIcon={<Add />}
          >
            Rolle hinzufügen
          </Button>

          {/* Modale */}
          <SelectAddRoleModal
            open={selectModalOpen}
            onClose={handleSelectModalClose}
            onSelectType={(type) => {
              if (type === 'explizite') {
                handleNewRoleModalOpen();
              } else if (type === 'implizite') {
                handleExistingRolesModalOpen();
              }
            }}
          />
          <NewRoleModal
            open={newRoleModalOpen}
            onClose={handleNewRoleModalClose}
          />
          <ExistingRolesModal
            open={existingRolesModalOpen}
            onClose={handleExistingRolesModalClose}
          />

          <RoleEditModal
            open={editModalOpen}
            role={editRole}
            onClose={handleEditModalClose}
            onSave={handleUpdateRole}
          />
        </Box>
      </>
    );
}
