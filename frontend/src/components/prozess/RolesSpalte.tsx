'use client';

import { BugReport, Edit } from '@mui/icons-material';
import { Box, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { useSession } from 'next-auth/react';
import { JSX, useEffect, useState } from 'react';
import { Process } from '../../types/process.type';
import { ENV } from '../../utils/env';
import DebuggerView from './DebuggerSicht';
import EditorView from './EditorSicht';

const { ADMIN_GROUP } = ENV;

interface RolesSpalteProps {
  selectedProcess: Process;
  onRemove: () => void;
}

export default function RolesSpalte({
  selectedProcess,
  onRemove,
}: RolesSpalteProps): JSX.Element {
  const theme = useTheme();
  const { data: session } = useSession();
  const isAdmin = session?.user.roles?.includes(ADMIN_GROUP); // Prüft, ob der Benutzer Admin ist
  const [activeTab, setActiveTab] = useState<'editor' | 'debugger'>(
    isAdmin ? 'editor' : 'debugger',
  );

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue as 'editor' | 'debugger');
  };

  useEffect(() => {
    setActiveTab(activeTab);
  }, [selectedProcess, activeTab]);

  useEffect(() => {
    setActiveTab(isAdmin ? 'editor' : 'debugger'); // Tab abhängig vom Admin-Status setzen
  }, [isAdmin]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: 3,
        overflow: 'auto',
        maxHeight: 'calc(100vh - 64px)',
        borderRadius: 4,
        boxShadow: `0px 8px 16px ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Tab-Navigation */}
      {isAdmin ? (
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
          sx={{
            marginBottom: 3,
            '& .MuiTabs-flexContainer': {
              justifyContent: 'center',
            },
            '& .MuiTab-root': {
              fontWeight: 'bold',
              textTransform: 'none',
            },
          }}
        >
          <Tab
            label="Editor-Sicht"
            value="editor"
            icon={<Edit />} // Icon für den Editor-Tab
            iconPosition="start" // Icon vor dem Text
          />
          <Tab
            label="Debugger-Sicht"
            value="debugger"
            icon={<BugReport />} // Icon für den Debugger-Tab
            iconPosition="start" // Icon vor dem Text
          />
        </Tabs>
      ) : (
        <Typography
          variant="h6"
          align="center"
          sx={{ marginBottom: 3, fontWeight: 'bold' }}
        >
          Debugger-Sicht
        </Typography>
      )}

      {activeTab === 'editor' && isAdmin && (
        <EditorView selectedProcess={selectedProcess} onRemove={onRemove} />
      )}
      {activeTab === 'debugger' && (
        <DebuggerView selectedProcess={selectedProcess} session={session} />
      )}
    </Box>
  );
}
