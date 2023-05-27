import Table from "@/Components/Table";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Customer as CustomerType } from "@/types/customer";
import { Head } from "@inertiajs/react";
import { Button, MenuItem } from "@mui/material";
import { MRT_ColumnDef } from "material-react-table";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { customerColumns } from "./utils";
import axios from "axios";
import ModalAddCustomer from "./ModalAddCustomer";
import ModalDisableCustomer from "./ModalDisableCustomer";

const Customer = ({ auth }: PageProps) => {
    const columns = useMemo(() => customerColumns, []);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [totalData, setTotalData] = useState(0);
    const [customers, setCustomers] = useState([]);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [customerData, setCustomerData] = useState({});
    const modalDisableRef = useRef();

    const fetchingCustomers = () => {
        const urlRequest = route('customer_data');
        const fullUrl = `${urlRequest}?page=${(pagination.pageIndex)}&row=${pagination.pageSize}`

        axios.get(fullUrl)
            .then(res => {
                setCustomers(res.data.data)
                setTotalData(res.data.meta.total)
            })
            .catch(e => console.log(e))
    }

    useEffect(() => {
        fetchingCustomers();
    }, []);

    useEffect(() => {
        fetchingCustomers();
    }, [pagination.pageIndex, pagination.pageSize])

    return (
        <Authenticated
            user={auth.user}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:py-6 lg:px-8">
                    <Button variant="contained" onClick={() => setShowModalAdd(true)}>Add Customer</Button>
                </div>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <section>
                        <Table
                            columns={columns}
                            data={customers}
                            onPaginationChange={setPagination}
                            state={{ pagination: pagination }}
                            totalData={totalData}
                            manualPagination
                            enableRowAction
                            renderRowActionMenuItems={({ row, closeMenu }) => [
                                <MenuItem key="edit" onClick={() => console.info('Edit')}>
                                    Edit
                                </MenuItem>,
                                <MenuItem key="delete" onClick={() => console.info('Delete')}>
                                    Delete
                                </MenuItem>,
                                <MenuItem key="status" onClick={() => {
                                    setCustomerData(() => {
                                        modalDisableRef.current.handleModal();
                                        closeMenu();
                                        return row.original;
                                    })
                                }}>
                                    {Boolean(row.original.status) ? 'Disable' : 'Enable'}
                                </MenuItem>
                            ]}
                        />
                    </section>
                </div>
            </div>
            <ModalAddCustomer showModal={showModalAdd} onCloseHandle={() => setShowModalAdd(!showModalAdd)} />
            <ModalDisableCustomer ref={modalDisableRef} dataCustomer={customerData} onFetch={fetchingCustomers} />
        </Authenticated>
    );
};

export default Customer;
