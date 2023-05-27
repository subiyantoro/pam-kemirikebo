import { PageProps } from "@/types";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material"
import React, { useState } from "react"

interface Customer {
    id: string,
    name: string,
};

type onFormHandle = (type: any, val: any) => void;

const CustomerInput = ({
    options,
    width,
    required,
    onChangeHandle,
}: PageProps<{
    options: Customer[],
    width: string,
    required: boolean
    onChangeHandle: onFormHandle,
}>) => {
    const [open, setOpen] = useState(false);
    const loading = open && options.length === 0;

    return (
        <Autocomplete
            id="customer-list"
            sx={{ width: width }}
            open={open}
            clearOnEscape
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            options={options}
            loading={loading}
            onChange={(__, val) => onChangeHandle('customer_id', val)}
            renderInput={(params) => (
                <TextField
                    key={params.id}
                    {...params}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                    required={required}
                />
            )}
            renderOption={(props, option) => (
                <Box component="li" {...props} key={option.id}>
                    {option.name}
                </Box>
            )}
        />
    )
}

export default CustomerInput;