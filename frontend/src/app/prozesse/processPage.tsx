'use client';

import { Box, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useFacultyTheme } from '../../theme/ThemeProviderWrapper';

export default function ProcessPage() {
  console.log('PROCESS PAGE');
  
  const theme = useTheme(); // Dynamisches Theme aus Material-UI
  const { setFacultyTheme } = useFacultyTheme(); // Dynamisches Theme nutzen

  useEffect(() => {
    console.log('Aktualisiertes Theme:', theme.palette);
  }, [setFacultyTheme, theme.palette]);
/*
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

  const handleRemove = (userId: string, functionId: string) => {
    if (userId === selectedUserId) {
      setSelectedUserId(undefined);
    }
    if (functionId === selectedFunctionId) {
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
*/

return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      {/* Erste Spalte: Prozesse */}
      <Box
        sx={{
          minWidth: 350,
          borderRight: `1px solid ${theme.palette.divider}`,
          paddingRight: 2,
          marginRight: 2,
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
          Prozesse
        </Typography>
        {/*
        <OrgUnitsSpalte
          onSelect={async (orgUnitDTO) => handleOrgUnitSelect(orgUnitDTO)}
        />
        */}
      </Box>
    </Box>
  );
}