import { SwapHoriz } from '@mui/icons-material';
import { Box, Switch, Tooltip, useTheme } from '@mui/material';

const ToggleSwitch = ({ useCustomStyles, setUseCustomStyles }: any) => {
  const theme = useTheme();

  return (
    <Tooltip title="Toggle Styles">
      <Switch
        checked={useCustomStyles}
        onChange={() => setUseCustomStyles(!useCustomStyles)}
        checkedIcon={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '100%',
            }}
          >
            <SwapHoriz sx={{ color: theme.palette.background.paper }} />
          </Box>
        }
        icon={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '100%',
            }}
          >
            <SwapHoriz
              sx={{
                color:
                  theme.palette.primary || theme.palette.background.default,
              }}
            />
          </Box>
        }
        sx={{
          '& .MuiSwitch-thumb': {
            backgroundColor: useCustomStyles
              ? theme.palette.custom?.navbar.secondary
              : theme.palette.custom?.primary,
          },
          '& .MuiSwitch-track': {
            backgroundColor: useCustomStyles
              ? theme.palette.custom?.navbar.secondary
              : theme.palette.custom?.primary,
          },
        }}
      />
    </Tooltip>
  );
};

export default ToggleSwitch;
