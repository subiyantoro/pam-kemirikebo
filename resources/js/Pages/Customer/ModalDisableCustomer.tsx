import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal"
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { toast } from "react-toastify";

const ModalDisableCustomer = forwardRef(({ dataCustomer, onFetch }, ref) => {
    const [showModal, setShowModal] = useState(false);
    const { post, processing, reset, setData } = useForm({
        status: false,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`${route('customer_status')}?id=${dataCustomer.customer_id}`, {
            onSuccess: () => toast.success(`Pelanggan ${dataCustomer.name} Telah di ${dataCustomer.status ? 'Non Aktifkan' : 'Aktifkan'}`),
            onError: () => toast.error('Terjadi Kesalahan'),
            onFinish: () => {
                reset();
                onFetch();
                setShowModal(false)
            }
        })
    }

    useEffect(() => {
        setData({ status: dataCustomer.status });
        console.log(dataCustomer);
    }, [dataCustomer]);

    useImperativeHandle(ref, () => ({
        handleModal() {
            setShowModal(!showModal);
        }
    }))

    return (
        <Modal show={showModal} onClose={() => setShowModal(false)} disableCloseOutside={false}>
            <form onSubmit={handleSubmit} className="p-6">
                <header>
                    <h2 className="text-lg font-medium text-gray-900">Me-Nonaktifkan Pelanggan <b>{dataCustomer.name}</b></h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Menonaktifkan pelanggan akan berdampak pada pelaporan data yang akan disembunyikan sementara
                        sehingga data pelanggan tersebut tidak tampil pada menu laporan.
                    </p>
                </header>
                <div className="mt-6 flex justify-start">
                    <PrimaryButton type="button" onClick={() => setShowModal(false)}>Batal</PrimaryButton>
                    <DangerButton className="ml-3" type="submit" disabled={processing}>
                        {processing ? 'Memproses' : dataCustomer.status ? 'Non Aktifkan' : 'Aktifkan'}
                    </DangerButton>
                </div>
            </form>
        </Modal>
    )
})

export default ModalDisableCustomer;
