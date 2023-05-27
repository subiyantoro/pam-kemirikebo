import Modal from "@/Components/Modal";
import { MutableRefObject, Ref, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import PreviewPrint from "./PreviewPrint";
import { Button } from "@mui/material";
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from "react-to-print";

const ModalToPrint = forwardRef((props, ref) => {
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState<any>({});
    const previewPrintRef = useRef();

    const handleToPrint = useReactToPrint({
        content: () => previewPrintRef.current,
    })

    useImperativeHandle(ref, () => ({
        handleModal(customer: any) {
            setShowModal(!showModal);
            setData(customer)
        }
    }))

    return (
        <Modal show={showModal} onClose={() => setShowModal(false)} disableCloseOutside={false}>
            <div className="my-10 mx-5">
                <PreviewPrint data={data} ref={previewPrintRef} />
            </div>
            <div className="m-5">
                <Button variant="contained" disableElevation fullWidth startIcon={<PrintIcon />} onClick={handleToPrint}>
                    Print
                </Button>
            </div>
        </Modal>
    )
})

export default ModalToPrint;
