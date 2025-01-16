'use client';

import { BugReport, Edit } from '@mui/icons-material';
import { Box, Tab, Tabs, useTheme } from '@mui/material';
import { JSX, useEffect, useState } from 'react';
import { Process } from '../../types/process.type';
import DebuggerView from './DebuggerSicht';
import EditorView from './EditorSicht';

interface RolesSpalteProps {
  selectedProcess: Process;
}

export default function RolesSpalte({
  selectedProcess,
}: RolesSpalteProps): JSX.Element {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'editor' | 'debugger'>('editor');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue as 'editor' | 'debugger');
  };

  useEffect(() => {
    setActiveTab(activeTab);
  }, [selectedProcess]);

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

      {activeTab === 'editor' && (
        <EditorView selectedProcess={selectedProcess} />
      )}
      {activeTab === 'debugger' && (
        <DebuggerView selectedProcess={selectedProcess} />
      )}
    </Box>
  );
}
