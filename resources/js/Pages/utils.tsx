import { Dayjs } from "dayjs";

export const reformatDate = (val: Dayjs) => {
    let stringDate = '';
    if (val.month() + 1 < 10) {
        stringDate = `${val.year()}-0${val.month() + 1}-01`;
    } else {
        stringDate = `${val.year()}-${val.month() + 1}-01`;
    }

    return stringDate;
}