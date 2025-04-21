'use client'
import React, { useState } from 'react'
import { Button, Dialog, DialogTitle } from '@mui/material';

type ModalContentProps = {
    onClose: () => void;
}

type ModalButtonProps = {
    title: string;
    color?: 'primary' | 'secondary';
}


export function ModalButton<P extends React.FC<ModalContentProps & any>>(
    props: { component: P; contentProps?: Omit<React.ComponentProps<P>, 'onClose'>; } & ModalButtonProps
){
    const { title, component, contentProps, color = 'primary' } = props;
    const [showModal, setShowModal] = useState(false);
    const handleOpen = () => {
        setShowModal(true);
    }
    const handleClose = () => {
        setShowModal(false);
    }
    let modalContent;
    const result = component({ onClose: handleClose, ...contentProps });
    if (result instanceof Promise) {
        // This contraption is needed to handle the case
        // when the component returns a promise to make typescript happy
        result.then((c) => { modalContent = c} );
    } else {
        modalContent = result;
    }

    return (
        <>
            <Button 
                variant="contained" 
                color={ color }
                onClick={ handleOpen }
            >
                { title }
            </Button>
            
            <Dialog open={showModal} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{ title }</DialogTitle>
                { modalContent } 
            </Dialog>
        </>
    )
}