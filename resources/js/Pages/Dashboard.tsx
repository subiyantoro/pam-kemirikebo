import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import InputLabel from '@/Components/InputLabel';
import CustomerInput from '@/Components/CustomerInput';
import { FormEventHandler, useEffect, useState } from 'react';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers';
import "dayjs/locale/id"
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { reformatDate } from './utils';

export default function Dashboard({ auth }: PageProps) {
    const [customerList, setCustomerList] = useState([]);
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const { data, setData, reset, processing } = useForm({
        customer_id: null,
        month: dayjs().format('YYYY-MM-DD'),
        cubic: 0,
    })
    const fetchCustomerOption = async () => {
        const urlReq = route('customer_option');

        axios.get(urlReq)
            .then(res => {
                setCustomerList(res.data.map(x => ({
                    id: x.customer_id,
                    name: x.name,
                })))
            })
            .catch(e => console.log(e))
    }

    const handleResize = () => {
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    }

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        const urlRequest = route('report_add');

        if (data.customer_id === null) {
            toast.error('Mohon Pilih pelanggan dahulu');
        } else {
            axios.post(urlRequest, data)
                .then(res => {
                    toast.success(res.data);
                    reset();
                })
                .catch(e => toast.error('Terjadi Kesalahan'))
        }
    }

    const handleFormChange = (type: any, val: any) => {
        setData(old => ({
            ...old,
            ...{ [type]: val }
        }))
    }

    useEffect(() => {
        fetchCustomerOption();
        window.addEventListener('resize', handleResize, false);
    }, []);

    useEffect(() => {
        console.log(data);
    }, [data]);

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Dashboard" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <section className="max-w-xl">
                            <header>
                                <h2 className="text-lg font-medium text-gray-900">Input Report</h2>
                            </header>
                        </section>

                        <form className="mt-6 space-y-12" onSubmit={handleSubmit}>
                            <div>
                                <InputLabel htmlFor="customer" value="Pelanggan" className='mt-2 mb-2' />
                                <CustomerInput
                                    auth={auth}
                                    options={customerList}
                                    width={dimensions.width >= 768 ? '50%' : '100%'} required
                                    onChangeHandle={(type, val) => handleFormChange(type, val.id)}
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="month" value="Bulan" className='mt-2 mb-2' />
                                <DatePicker
                                    views={['month', 'year']}
                                    sx={{ width: dimensions.width >= 768 ? '50%' : '100%' }}
                                    onChange={val => handleFormChange('month', reformatDate(dayjs(val?.toString())))}
                                    defaultValue={dayjs()}
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="meter" value="Meter" className="mt-2 mb-2" />
                                <TextInput
                                    type="number" min="0"
                                    style={{ width: dimensions.width >= 768 ? '50%' : '100%' }}
                                    value={data.cubic}
                                    onChange={e => handleFormChange('cubic', Number(e.target.value))}
                                    required
                                />
                            </div>
                            <div>
                                <PrimaryButton type="submit" disabled={processing}>{processing ? 'Memproses' : 'Simpan'}</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
