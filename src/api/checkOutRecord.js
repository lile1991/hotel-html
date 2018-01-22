import fetch from '@/utils/fetch'

let CheckOutRecordApi = {
    fullPage(path) {
        return "/checkOutRecord/" + path;
    },
    checkOut(data) {
        return fetch({
            url: this.fullPage('checkOut'),
            method: 'post',
            data: data
        });
    }
};

export default CheckOutRecordApi;
