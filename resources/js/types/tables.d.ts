import { FunctionComponent } from "react";

export interface Columns {
    accessorKey: string;
    header: string;
    Cell: FunctionComponent;
};
