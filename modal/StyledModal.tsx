import { Box, Dialog, useMediaQuery, useTheme } from '@mui/material';


export function StyledModal({
    children, onClose,
    fullscreenBreakpoint = 'sm',
    fullWidth = true,
    maxWidth = 'md'
}: {
    children: React.ReactNode;
    onClose?: () => void;
    fullWidth?: boolean;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
    fullscreenBreakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}) {
    /**
    FullscreenBreakpoint is set to md
    */
    const theme = useTheme();
    const fullScreen = fullscreenBreakpoint && useMediaQuery(theme.breakpoints.down(fullscreenBreakpoint));

    return (
        <Dialog
            open={true}
            onClose={onClose}
            fullScreen={fullScreen}
            fullWidth={fullWidth}
            maxWidth={maxWidth}
        >
            <Box>
                {children}
            </Box>
        </Dialog>
    )
}