import {forwardRef, useEffect, useState} from "react";
import {Box, CircularProgress, Container, Grid, Stack} from "@mui/material";
import PreviewPrint from "@/Pages/Report/PreviewPrint";
import axios from "axios";

const PreviewPrintAll = (props: any) => {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const fetchReport = () => {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        const urlReq = `${route('print_report_all')}?month=${params.month}`
        axios.get(urlReq)
            .then(res => setData(res.data))
            .catch(e => console.log(e))
            .finally(() => setIsLoading(false))
    }

    useEffect(() => {
        fetchReport();
    }, []);

    useEffect(() => {
        if (!isLoading && data.length !== 0) {
            window.print()
        }
    }, [isLoading, data]);
    if (isLoading) {
        return (
            <Box style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <Stack>
                    <CircularProgress color={'primary'} />
                    Loading...
                </Stack>
            </Box>
        )
    }
    return (
        <Container style={{ paddingTop: 20}}>
            <Stack spacing={5} direction={"row"} useFlexGap flexWrap="wrap">
                {data.map((item, index) => (
                    <Box style={{ borderWidth: 1}}>
                        <PreviewPrint data={item} />
                    </Box>
                ))}
            </Stack>
        </Container>
    )
}

export default PreviewPrintAll;
