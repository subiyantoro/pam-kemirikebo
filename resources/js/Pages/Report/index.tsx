import Table, { Data } from "@/Components/Table";
import { MRT_ColumnDef } from "material-react-table";
import { useEffect, useMemo, useRef, useState } from "react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import { Box, IconButton } from "@mui/material";
import { Print as PrintIcon } from '@mui/icons-material'
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { reformatDate } from "../utils";
import 'dayjs/locale/id';
import axios from "axios";
import { toast } from "react-toastify";
import { NumericFormat } from "react-number-format";
import ModalToPrint from "./ModalToPrint";

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
            Cell: ({ row }) => Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(row.original.total)
        }
    ], [month]);

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

    // console.log(month.subtract(1, 'month').format("YYYY-MM"))

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
                            <header>
                                <DatePicker
                                    views={['month', 'year']}
                                    sx={{ width: dimensions.width < 768 ? '100%' : 300 }}
                                    onChange={val => setMonth(dayjs(val?.toString()))}
                                    defaultValue={dayjs()}
                                />
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
                                <Box>
                                    <IconButton
                                        color="primary"
                                        onClick={() => printRef.current?.handleModal(row.original)}
                                    >
                                        <PrintIcon />
                                    </IconButton>
                                </Box>
                            )}
                        />
                    </section>
                </div>
            </div>
            <ModalToPrint ref={printRef} />
        </Authenticated>
    )
}

export default Report;
