import fetch from '@/utils/fetch'

let CheckInRecordApi = {
    fullPage(path) {
        return "/checkInRecord/" + path;
    },
    checkIn(data) {
        return fetch({
            url: this.fullPage('checkIn'),
            method: 'post',
            data: data
        });
    },
    findManage(data) {
        return fetch({
            url: this.fullPage('findManage'),
            method: 'post',
            data: data
        });
    },
    getCheckStateEnums() {
        return fetch({
            url: this.fullPage('getCheckStateEnums'),
            method: 'get'
        });
    },
    reserveCheckIn(id) {
        return fetch({
            url: this.fullPage('reserveCheckIn/' + id),
            method: 'get'
        });
    },
    findDetail(id) {
        return fetch({
            url: this.fullPage('findDetail/' + id),
            method: 'get'
        });
    }
};

export default CheckInRecordApi;
