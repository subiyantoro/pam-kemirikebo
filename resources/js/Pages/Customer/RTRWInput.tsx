import TextInput from "@/Components/TextInput";
import { Autocomplete, TextField } from "@mui/material";
import { OnChangeValue } from "./type";

type RT_RWData = {
    options: Array<Object>,
    id: string,
    required: boolean,
    onChangeValue: OnChangeValue,
}

const RT_RWInput = ({ options, id, required, onChangeValue }: RT_RWData) => (
    <Autocomplete
        disablePortal
        id={id}
        options={options}
        sx={{ width: '100%' }}
        renderInput={(params) => <TextField {...params} required={required} />}
        onChange={(__, val) => onChangeValue(id, val)}
        getOptionLabel={option => option.toString()}
    />
)

export default RT_RWInput;
