import Modal from "@/Components/Modal";
import {forwardRef, useImperativeHandle, useState} from "react";
import InputLabel from "@/Components/InputLabel";
import {DatePicker} from "@mui/x-date-pickers";
import {reformatDate} from "@/Pages/utils";
import dayjs from "dayjs";
import {Box, Button, Input, TextField, Typography} from "@mui/material";
import TextInput from "@/Components/TextInput";

type RowData = {
    id: string,
    meter_now: number,
    name: string,
    report_date: string,
}

interface IModalToEdit {
    data: RowData,
    onSubmit?: () => void,
    onValueChange: (type: string, val: any) => void,
    onSubmitEdit?: (isExist?: boolean) => void,
}

const ModalToEdit = forwardRef((props: IModalToEdit, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenWarning, setIsOpenWarning] = useState(false);

    useImperativeHandle(ref, () => ({
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        openWarning: () => setIsOpenWarning(true),
        closeWarning: () => setIsOpenWarning(false)
    }))

    return (
        <Modal show={isOpen} onClose={() => setIsOpen(false)} disableCloseOutside={true}>
            <Typography mx={3} my={5} variant={'h5'}>Edit Report</Typography>
            <Box>
                <div className="mx-5 my-5">
                    <InputLabel htmlFor="month" value="Customer" className={'w-full'} />
                    <TextField value={props.data?.name || ''} disabled={true} sx={{ width: '100%'}} variant={'outlined'} />
                </div>
                <div className="mx-5 my-5">
                    <InputLabel htmlFor="month" value="Bulan" className={'w-full'} />
                    <DatePicker
                        views={['month', 'year']}
                        sx={{ width: '100%' }}
                        onChange={val => props.onValueChange('report_date', reformatDate(dayjs(val?.toString())))}
                        defaultValue={props.data?.report_date ? dayjs(props.data.report_date) : dayjs()}
                    />
                </div>
                <div className={'mx-5 my-5'}>
                    <InputLabel htmlFor="meter" value="Meter" className="mt-2 mb-2" />
                    <TextInput
                        type="number" min="0"
                        style={{ width: '100%' }}
                        defaultValue={props.data?.meter_now}
                        onChange={e => props.onValueChange('meter_now', Number(e.target.value))}
                        required
                    />
                </div>
                <div className={'mx-5 my-5'}>
                    <Button variant={'contained'} sx={{ width: '100%'}} onClick={props.onSubmit}>Simpan</Button>
                </div>
            </Box>
            <Modal show={isOpenWarning} onClose={() => setIsOpenWarning(false)} disableCloseOutside={true}>
                <div className={'mx-5 my-5'}>
                    <Typography variant={'body2'} justifyContent={'center'} textAlign={'center'}>
                        Sudah ada data pada bulan tersebut apakah ingin menimpanya?
                    </Typography>
                </div>
                <div className={'mx-5 my-5'}>
                    <Button variant={'outlined'} sx={{ width: '50%'}} onClick={() => setIsOpenWarning(false)}>Tidak</Button>
                    <Button variant={'contained'} sx={{ width: '50%'}} onClick={() => props.onSubmitEdit!(true)}>Ya</Button>
                </div>
            </Modal>
        </Modal>
    )
})

export default ModalToEdit;
