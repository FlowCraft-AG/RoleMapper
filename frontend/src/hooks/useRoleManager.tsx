import { useEffect, useState } from 'react';
import {
  addProcessRole,
  removeProcessRole,
  updateProcessRole,
} from '../lib/api/rolemapper/roles.api';
import { Process, ShortRole } from '../types/process.type';

export function useRoleManager(selectedProcess: Process) {
  const [roles, setRoles] = useState<ShortRole[]>(selectedProcess.roles || []);

  useEffect(() => {
    // Aktualisiere die Rollen, wenn sich der ausgewählte Prozess ändert
    setRoles(selectedProcess.roles || []);
  }, [selectedProcess]);

  const addRole = async (newRole: ShortRole) => {
    await addProcessRole(
      selectedProcess._id,
      selectedProcess.name,
      roles,
      newRole,
    );
    setRoles((prevRoles) => [...prevRoles, newRole]);
  };

  const updateRole = async (updatedRole: ShortRole, oldRoleId: string) => {
    await updateProcessRole(
      selectedProcess._id,
      selectedProcess.name,
      roles,
      updatedRole,
      oldRoleId,
    );
    setRoles((prevRoles) =>
      prevRoles.map((role) => (role.roleId === oldRoleId ? updatedRole : role)),
    );
  };

  const removeRole = async (roleId: string) => {
    await removeProcessRole(
      selectedProcess._id,
      selectedProcess.name,
      roles,
      roleId,
    );
    setRoles((prevRoles) => prevRoles.filter((role) => role.roleId !== roleId));
  };

  return { roles, addRole, updateRole, removeRole };
}
