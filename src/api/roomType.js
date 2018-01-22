import fetch from '@/utils/fetch'

let RoomTypeApi = {
    fullPage(path) {
        return "/roomType/" + path;
    },
    findAll() {
        return fetch({
            url: this.fullPage('findAll'),
            method: 'get'
        });
    }
};

export default RoomTypeApi;
