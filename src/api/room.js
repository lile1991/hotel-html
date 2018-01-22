import fetch from '@/utils/fetch'

let RoomtApi = {
    fullPage(path) {
        return "/room/" + path;
    },
    findManage(data) {
        return fetch({
            url: this.fullPage('findManage'),
            method: 'post',
            data: data
        });
    },
    findAll(condition) {
        return fetch({
            url: this.fullPage('findAll'),
            method: 'post',
            data: condition
        });
    },
    enable(id) {
        return fetch({
            url: this.fullPage('enable/' + id),
            method: 'get'
        });
    },
    disable(id) {
        return fetch({
            url: this.fullPage('disable/' + id),
            method: 'get'
        });
    }
};

export default RoomtApi;
