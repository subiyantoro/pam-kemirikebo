import Table, { Data } from "@/Components/Table";
import { MRT_ColumnDef } from "material-react-table";
import { useEffect, useMemo, useRef, useState } from "react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import {Box, Button, IconButton} from "@mui/material";
import { Print as PrintIcon, Create, Delete } from '@mui/icons-material'
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { reformatDate } from "../utils";
import 'dayjs/locale/id';
import axios from "axios";
import { toast } from "react-toastify";
import { NumericFormat } from "react-number-format";
import ModalToPrint from "./ModalToPrint";
import ModalToEdit from "@/Pages/Report/ModalToEdit";
import ModalToDelete from "@/Pages/Report/ModalToDelete";

const Report = ({ auth }: PageProps) => {
    const [month, setMonth] = useState(dayjs());
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [totalData, setTotalData] = useState(0);
    const [reports, setReports] = useState([]);
    const printRef = useRef();
    const editRef = useRef();
    const deleteRef = useRef();
    const columns = useMemo<MRT_ColumnDef<Data>[]>(() => [
        {
            accessorKey: 'id',
            header: 'Nomor',
        },
        {
            accessorKey: 'name',
            header: 'Nama'
        },
        {
            accessorKey: 'customer_id',
            header: 'Nomor Pelanggan',
        },
        {
            accessorKey: 'meter_before',
            header: `Meter Bulan ${month.locale('id').subtract(1, 'month').format("MMMM")}`,
        },
        {
            accessorKey: 'meter_now',
            header: `Meter Bulan ${month.locale('id').format("MMMM")}`,
        },
        {
            accessorKey: 'total',
            header: 'Total Harga',
            Cell: ({ row }) => {
                const total = ((row.original.meter_now - row.original.meter_before) * row.original.cubic_price) + row.original.admin_price;
                return Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(total)
            }
        },
    ], [month]);
    const [selectedData, setSelectedData] = useState(null)

    const handleResize = () => {
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    }

    const fetchingReportData = () => {
        const monthChoose = month.format("YYYY-MM");
        const monthBefore = month.subtract(1, 'month').format("YYYY-MM");
        const urlReq = `${route('report_data')}?row=${pagination.pageSize}&page=${pagination.pageIndex}&month=${monthChoose}&month_before=${monthBefore}`;
        axios.get(urlReq)
            .then(res => {
                setReports(res.data.data);
                setTotalData(res.data.meta.total);
            })
            .catch(e => toast.error('Terjadi Kesalahan'))
    }

    const editContent = (isExist?: boolean, idToDelete?: any) => {
        const urlReq = `${route('edit_report')}`
        axios.post(urlReq, {
            id: selectedData?.no,
            cubic: selectedData?.meter_now,
            date: selectedData?.report_date,
            cus_id: selectedData?.customer_id,
            ...isExist && { id_delete: idToDelete },
        }).then(res => {
            editRef.current?.closeWarning();
            editRef.current?.close();
            fetchingReportData();
            toast.success('Report terupdate');
        }).catch(e => toast.error('Terjadi keselahan'))
    }

    const submitEdit = () => {
        const urlReq = `${route('check_report')}?cus_id=${selectedData?.customer_id}&date=${selectedData?.report_date}`
        axios.get(urlReq)
            .then(res => {
                if (Object.keys(res.data).length !== 0) {
                    editRef.current?.openWarning()
                    setSelectedData(prev => ({
                        ...prev,
                        idToDelete: res.data.id,
                    }))
                } else {
                    editContent(false);
                    editRef.current?.close()
                }
            }).catch(e => toast.error('Terjadi Kesalahan'))
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize, false);
    }, []);

    useEffect(() => {
        fetchingReportData();
    }, [pagination.pageIndex, pagination.pageSize, month]);

    return (
        <Authenticated
            user={auth.user}
        >
            <Head title="Settings" />
            <div className="py-12">
                <div className="max-w-10xl mx-auto sm:px-6 lg:px-8">
                    <section>
                        <div className="p-4 sm:p-8 bg-white shadow">
                            <header className='flex justify-between'>
                                <DatePicker
                                    views={['month', 'year']}
                                    sx={{ width: dimensions.width < 768 ? '100%' : 300 }}
                                    onChange={val => setMonth(dayjs(val?.toString()))}
                                    defaultValue={dayjs()}
                                />
                                <Button variant={'contained'} color='primary' disabled={reports.length === 0} onClick={() => window.open(`/print?month=${dayjs(month).format('YYYY-MM')}&month_before=${dayjs(month).subtract(1, 'month').format('YYYY-MM')}`, '_blank')}>
                                    {`Print Report Bulan ${dayjs(month).format('MMMM')}`}
                                </Button>
                            </header>
                        </div>
                        <Table
                            columns={columns}
                            data={reports}
                            enableRowAction
                            state={{ pagination: pagination }}
                            onPaginationChange={setPagination}
                            totalData={totalData}
                            manualPagination
                            rowActionComponent={({ row }) => (
                                <Box width={'200px'}>
                                    <IconButton
                                        color="primary"
                                        onClick={() => printRef.current?.handleModal(row.original)}
                                    >
                                        <PrintIcon />
                                    </IconButton>
                                    <IconButton
                                        color="primary"
                                        onClick={() => {
                                            setSelectedData(reports.find(x => x.id === row.original.id));
                                            editRef.current?.open()
                                        }}
                                    >
                                        <Create />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => {
                                        setSelectedData(reports.find(x => x.no === row.original.no));
                                            deleteRef.current?.open()
                                        }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Box>
                            )}
                        />
                    </section>
                </div>
            </div>
            <ModalToPrint ref={printRef} />
            <ModalToEdit
                ref={editRef}
                data={selectedData !== null && reports.find(x => x.id === selectedData.id)}
                onSubmit={submitEdit}
                onValueChange={(type, val) => setSelectedData(prev => ({
                    ...prev,
                    [type]: val
                }))}
                onSubmitEdit={isExist => editContent(isExist, selectedData?.idToDelete)}
            />
            <ModalToDelete id={selectedData?.no} ref={deleteRef} refetchTable={fetchingReportData} />
        </Authenticated>
    )
}

export default Report;
