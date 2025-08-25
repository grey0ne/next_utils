import { Box, Dialog, SxProps } from '@mui/material';


export function StyledModal({ children, onClose, sx }: {
    children: React.ReactNode;
    onClose?: () => void;
    sx?: SxProps;
}) {
    return (
        <Dialog
            open={true}
            onClose={onClose}
            sx={sx}
        >
            <Box>
                {children}
            </Box>
        </Dialog>
    )
}