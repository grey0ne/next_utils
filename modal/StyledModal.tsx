import { Modal, Box } from '@mui/material';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    minWidth: 600,
    p: 4,
    borderRadius: 2,
};


export function StyledModal({ children, onClose }: {
    children: React.ReactNode;
    onClose?: () => void;
}) {
    return (
        <Modal
            open={true}
            onClose={onClose}
        >
            <Box sx={modalStyle}>
                {children}
            </Box>
        </Modal>
    )
}