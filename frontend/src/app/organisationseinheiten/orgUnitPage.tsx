'use client';

import { useLazyQuery } from '@apollo/client';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import FunctionsSpalte from '../../components/organigramm/FunctionsSpalte';
import OrgUnitsSpalte from '../../components/organigramm/OrgUnitsSpalte';
import UserInfoSpalte from '../../components/organigramm/UserInfoSpalte';
import UsersSpalte from '../../components/organigramm/UsersSpalte';
import { MITGLIEDER } from '../../graphql/queries/get-users';
import client from '../../lib/apolloClient';
import theme from '../../theme';
import { FunctionInfo } from '../../types/function.type';
import { OrgUnitDTO } from '../../types/orgUnit.type';

export default function OrganigrammPage() {
  const [selectedOrgUnit, setSelectedOrgUnit] = useState<
    OrgUnitDTO | undefined
  >(undefined);
  const [selectedRootOrgUnit, setSelectedRootOrgUnit] = useState<
    OrgUnitDTO | undefined
  >(undefined);

  const [selectedFunctionId, setSelectedFunctionId] = useState<
    string | undefined
  >(undefined);
  const [selectedFunction, setSelectedFunction] = useState<FunctionInfo>();

  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined,
  );
  const [combinedUsers, setCombinedUsers] = useState<string[]>([]);
  const [isImpliciteFunction, setIsImpliciteFunction] =
    useState<boolean>(false);

  const [fetchMitglieder] = useLazyQuery(MITGLIEDER, {
    client,
    onCompleted: (data) => {
      setCombinedUsers(
        data.getData.data.map((user: { userId: string }) => user.userId),
      );
    },
    onError: () => {
      setCombinedUsers([]);
    },
  });

  const getMitgliederIds = async (alias: string, kostenstelleNr: string) => {
    const { data } = await fetchMitglieder({
      variables: {
        alias: alias || null,
        kostenstelleNr: kostenstelleNr || null,
      },
    });
    return data.getData.data.map((user: { userId: string }) => user.userId);
  };

  //   const isChild = (
  //     orgUnit: OrgUnitDTO,
  //     currentRootOrgUnit: OrgUnitDTO | undefined,
  //   ) => {
  //     return orgUnit.parentId === currentRootOrgUnit?.id;
  //   };

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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      {/* Erste Spalte: Organisationseinheiten */}
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
          Organisationseinheiten
        </Typography>
        <OrgUnitsSpalte
          onSelect={async (orgUnitDTO) => handleOrgUnitSelect(orgUnitDTO)}
        />
      </Box>

      {/* Zweite Spalte: Funktionen */}
      {selectedOrgUnit && (
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
            minWidth: 350,
            borderRight: `1px solid ${theme.palette.divider}`,
            paddingRight: 2,
            marginRight: 2,
            maxHeight: 'calc(100vh - 64px)',
            overflow: 'auto',
            position: 'sticky',
            top: 0, // Überschrift bleibt oben
          }}
        >
          <Box
            sx={{
              position: 'sticky',
              top: 0, // Überschrift bleibt oben
              backgroundColor: theme.palette.background.default, // Hintergrundfarbe für die Überschrift
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
                paddingTop: 1,
              }}
            >
              Benutzer
            </Typography>
          </Box>
          {
            <UsersSpalte
              selectedFunctionId={selectedFunctionId}
              selectedMitglieder={selectedFunction}
              onSelectUser={handleUserSelect}
              onRemove={handleRemove}
              isImpliciteFunction={isImpliciteFunction}
            />
          }
        </Box>
      )}
      {/* Vierte Spalte: Benutzerinformationen */}
      {selectedUserId && (
        <Box
          sx={{
            minWidth: 250,
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
