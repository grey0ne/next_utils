import { Box, Dialog } from '@mui/material';

const modalStyle = {
    minWidth: 600,
};


export function StyledModal({ children, onClose }: {
    children: React.ReactNode;
    onClose?: () => void;
}) {
    return (
        <Dialog
            open={true}
            onClose={onClose}
        >
            <Box sx={modalStyle}>
                {children}
            </Box>
        </Dialog>
    )
}