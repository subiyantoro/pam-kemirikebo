import { Divider, Typography } from "@mui/material";
import dayjs from "dayjs";
import { forwardRef } from "react";

const PreviewPrint = forwardRef<HTMLDivElement>(({ data }: any, ref) => {
    const today = dayjs().format("YYYYMM");

    return (
        <div ref={ref} className="mx-5">
            <Typography variant="overline" display="block" gutterBottom className="text-center">
                PAM Desa Kemirikebo
            </Typography>
            <Typography variant="overline" display="block" gutterBottom className="text-center">
                {`No. Nota : ${today}/${data.no < 10 ? '0' + data.no : data.no}`}
            </Typography>
            <Divider />
            <Typography variant="overline" display="block">
                <div className="flex space-x-10">
                    <div>Nama Pelanggan</div>
                    <div>: {data.name}</div>
                </div>
            </Typography>
            <Typography variant="overline" display="block">
                <div className="flex space-x-5">
                    <div>Penggunaan Meter</div>
                    <div>: {data.meter_now - data.meter_before}</div>
                </div>
            </Typography>
            <Typography variant="overline" display="block">
                <div className="flex space-x-18">
                    <div>Biaya /Meter</div>
                    <div>: {Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(data.cubic_price)}</div>
                </div>
            </Typography>
            <Typography variant="overline" display="block" gutterBottom>
                <div className="flex space-x-5">
                    <div>Biaya Pemeliharaan</div>
                    <div>: {Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(data.admin_price)}</div>
                </div>
            </Typography>
            <Divider />
            <Typography variant="overline" display="block">
                <div className="flex space-x-30">
                    <div>Total</div>
                    <div>: {Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(data.total)}</div>
                </div>
            </Typography>
        </div>
    )
})

export default PreviewPrint