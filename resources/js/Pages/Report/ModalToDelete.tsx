import Modal from "@/Components/Modal";
import { Box, Button, Typography } from "@mui/material";
import {forwardRef, useImperativeHandle, useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";

const ModalToDelete = forwardRef(({ id, refetchTable }: { id: any, refetchTable: () => void }, ref) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    
    useImperativeHandle(ref, () => ({
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
    }))
    
    const submitDelete = () => {
        const reqUrl = route('delete_report', id);
        
        axios.get(reqUrl)
            .then(res => {
                if (res) {
                    toast.success('Berhasil Menghapus')
                    refetchTable();
                    setIsOpen(false);
                }
            })
            .catch(e => toast.error('Gagal menghapus'));
    }
    
    return (
        <Modal show={isOpen} onClose={() => setIsOpen(false)} disableCloseOutside={false} maxWidth={'md'}>
            <Box style={{ justifyContent: 'center', textAlign: 'center'}}>
                <Typography mx={3} my={5} variant={'h5'}>Menghapus Report</Typography>
                Yakin ingin menghapus report ini?
            </Box>
            <div className={'mx-5 my-5 gap-4'}>
                <Button variant={'contained'} color={'inherit'} sx={{ width: '50%'}} onClick={() => setIsOpen(false)}>Tidak</Button>
                <Button variant={'contained'} color={'error'} sx={{ width: '50%'}} onClick={submitDelete}>Ya</Button>
            </div>
        </Modal>
    )
})

export default ModalToDelete;
