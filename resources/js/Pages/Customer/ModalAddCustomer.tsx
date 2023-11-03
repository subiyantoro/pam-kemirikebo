import DangerButton from "@/Components/DangerButton";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import { TextField } from "@mui/material";
import { FormEventHandler, useEffect, useState } from "react";
import RT_RWInput from "./RTRWInput";
import { OnChangeValue } from "./type";
import { useForm } from "@inertiajs/react";
import { toast } from "react-toastify";

interface IModalAddCustomer {
    showModal: boolean;
    onCloseHandle: () => void;
    refetchTable: () => void;
}

const ModalAddCustomer = ({ showModal, onCloseHandle, refetchTable }: IModalAddCustomer) => {
    const { data, setData, processing, post, reset } = useForm({
        name: '',
        phone: '',
        address: '',
        status: true,
        rt: null,
        rw: null,
    });
    const RT_RW: number[] = Array.from({ length: 20 }, (_, i) => i + 1);

    const formHandler: OnChangeValue = (type: string, val: any) => {
        setData(old => ({
            ...old,
            ...{ [type]: val },
        }));
    }
    const submitHandler: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('customer_save'), {
            onSuccess: () => {
                toast.success('Berhasil Menambahkan Pelanggan baru')
                refetchTable();
            },
            onError: () => toast.error('Terjadi Kesalahan'),
            onFinish: () => {
                onCloseHandle();
                reset();
            },
        })
    }

    useEffect(() => {
        console.log(data);
    }, [data]);

    return (
        <Modal show={showModal} onClose={() => { }} disableCloseOutside>
            <form onSubmit={submitHandler} className="p-6">
                <header>
                    <h2 className="text-lg font-medium text-gray-900">Add New Customer</h2>
                </header>

                <div className="mt-6">
                    <div>
                        <InputLabel htmlFor="customerName" value="Nama Pelanggan" />
                        <TextInput
                            id="customerName"
                            onChange={e => formHandler('name', e.target.value)}
                            placeholder="Nama Lengkap Pelanggan"
                            required
                            className="mt-1 block w-full"
                            value={data.name}
                        />
                    </div>
                    <div className="mt-2 mb-2">
                        <InputLabel htmlFor="phone" value="Nomor Handphone" />
                        <TextInput
                            id="phone"
                            onChange={e => formHandler('phone', e.target.value)}
                            placeholder="Nomor Handphone"
                            className="mt-1 block w-full"
                            type="tel"
                            value={data.phone}
                        />
                    </div>
                    <div className="flex">
                        <div className="mt-2 mb-2 mr-2 w-full">
                            <InputLabel htmlFor="rt" value="RT" />
                            <RT_RWInput id="rt" options={RT_RW} required onChangeValue={formHandler} />
                        </div>
                        <div className="mt-2 mb-2 ml-2 w-full">
                            <InputLabel htmlFor="rw" value="RW" />
                            <RT_RWInput id="rw" options={RT_RW} required={false} onChangeValue={formHandler} />
                        </div>
                    </div>
                    <div className="mt-2 mb-2">
                        <InputLabel htmlFor="address" value="Alamat Lengkap" />
                        <TextField
                            id="address"
                            multiline
                            minRows={4}
                            required
                            className="mt-1 block w-full"
                            onChange={e => formHandler('address', e.target.value)}
                            value={data.address}
                        />
                    </div>
                    <div className="mt-6 flex justify-start">
                        <DangerButton className="mr-3" type="button" onClick={() => onCloseHandle()}>
                            Cancel
                        </DangerButton>
                        <PrimaryButton type="submit" disabled={processing}>Save</PrimaryButton>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default ModalAddCustomer;
