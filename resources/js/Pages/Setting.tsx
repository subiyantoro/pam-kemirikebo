import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { FormEventHandler, useEffect } from 'react';
import { NumericFormat } from 'react-number-format';
import { toast } from 'react-toastify';

const Setting = ({ auth }: PageProps) => {
    const { data, setData, post, errors, processing } = useForm({
        cubic: 0,
        admin: 0,
    })

    const fetchSettingData = () => {
        const urlReq = route('settings_data');
        axios.get(urlReq)
            .then(res => {
                setData({
                    cubic: res.data[0].cubic_price,
                    admin: res.data[0].admin_price,
                })
            })
            .catch(e => console.log(e))
    }

    const showToast = (type, message) => {
        if (type === 'success') {
            toast.success(message);
        } else {
            toast.error(message);
        }
    }

    const handleChangeData = (type, val) => {
        setData(old => ({
            ...old,
            ...{ [type]: val }
        }))
    }

    const handleSubmitSetting: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('settings_save'), {
            onSuccess: res => showToast('success', 'Penyesuaian Harga Tersimpan'),
            onError: e => showToast('error', 'Terjadi Kesalahan')
        })
    }

    useEffect(() => {
        fetchSettingData();
    }, []);

    useEffect(() => {
        console.log(data);
    }, [data]);

    return (
        <AuthenticatedLayout
            user={auth.user}>
            <Head title="Settings" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <form onSubmit={handleSubmitSetting}>
                            <section className="max-w-xl">
                                <header>
                                    <h2 className="text-lg font-medium text-gray-900">Setting Harga</h2>
                                </header>
                                <div className="mt-6 space-y-6">
                                    <InputLabel htmlFor="price" value="Harga Per Kubik" />
                                    <NumericFormat
                                        id="cubic-price"
                                        value={data.cubic}
                                        customInput={TextInput}
                                        allowLeadingZeros
                                        thousandSeparator=","
                                        className="mt-1 block w-full"
                                        prefix="Rp. "
                                        required
                                        onValueChange={(val) => handleChangeData('cubic', val.floatValue)}
                                    />
                                </div>
                                <div className="mt-6 space-y-6">
                                    <InputLabel htmlFor="price" value="Harga Beban" />
                                    <NumericFormat
                                        id="admin-price"
                                        value={data.admin}
                                        customInput={TextInput}
                                        allowLeadingZeros
                                        thousandSeparator=","
                                        className="mt-1 block w-full"
                                        prefix="Rp. "
                                        required
                                        onValueChange={(val) => handleChangeData('admin', val.floatValue)}
                                    />
                                </div>
                                <div className="mt-6 space-y-6">
                                    <PrimaryButton type="submit" disabled={processing}>Simpan</PrimaryButton>
                                </div>
                            </section>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Setting;
