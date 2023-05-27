import { PageProps } from "@/types";
import { Chip } from "@mui/material";

const StatusColumn = ({ value }: PageProps<{ value: number }>) => {
    return (
        <Chip label={Boolean(value) ? 'Aktif' : 'Tidak Aktif'} color={Boolean(value) ? 'success' : 'error'} />
    );
};

export default StatusColumn;
