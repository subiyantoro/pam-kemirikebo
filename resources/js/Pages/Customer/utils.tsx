import StatusColumn from "./StatusColumn";

export const customerColumns = [
    {
        accessorKey: 'customer_id',
        header: 'Nomor Pelanggan',
    },
    {
        accessorKey: 'name',
        header: 'Nama Pelanggan'
    },
    {
        accessorKey: 'phone',
        header: 'Nomor Handphone'
    },
    {
        accessorKey: 'address',
        header: 'Alamat',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ cell }) => <StatusColumn value={cell.getValue()} />
    }
];
