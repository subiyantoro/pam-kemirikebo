import { PageProps } from "@/types";
import { Customer } from "@/types/customer";
import MaterialReactTable, { MRT_ColumnDef, MRT_PaginationState, MRT_TableState, MRT_Updater } from "material-react-table";
import { ReactNode } from "react";

export type Data = {
    id: number,
    name: string,
    customer_id: string,
    meter_before: number,
    meter_now: number,
    total: number,
}

type OnChangeFn = React.ChangeEvent

const Table = ({
    columns,
    data,
    enableRowAction = false,
    rowActionComponent,
    state,
    onPaginationChange,
    initState,
    totalData,
    manualPagination,
    renderRowActionMenuItems
}: PageProps<{
    columns: MRT_ColumnDef[],
    data: [],
    enableRowAction: boolean,
    rowActionComponent: React.FunctionComponent,
    state: MRT_TableState,
    onPaginationChange: OnChangeFn<MRT_PaginationState>,
    initState: MRT_TableState,
    totalData: number,
    manualPagination: boolean,
    renderRowActionMenuItems: ReactNode[],
}>) => (
    <MaterialReactTable
        initialState={initState}
        columns={columns}
        data={data}
        enableRowActions={enableRowAction}
        renderRowActions={rowActionComponent}
        positionActionsColumn="last"
        state={state}
        onPaginationChange={onPaginationChange}
        rowCount={totalData}
        manualPagination={manualPagination}
        renderRowActionMenuItems={renderRowActionMenuItems}
    />
)

export default Table;
