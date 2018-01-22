import fetch from '@/utils/fetch'

let UserApi = {
    fullPage(path) {
        return "/user/" + path;
    },
    findManage(data) {
        return fetch({
            url: this.fullPage('findManage'),
            method: 'post',
            data: data
        });
    },
    lock(id) {
        return fetch({
            url: this.fullPage('lock') + "/" + id,
            method: 'get'
        });
    },
    unlock(id) {
        return fetch({
            url: this.fullPage('unlock') + "/" + id,
            method: 'get'
        });
    }
};

export default UserApi;
