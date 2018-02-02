import fetch from '@/utils/fetch'

let UserResourceApi = {
    fullPage(path) {
        return "/userResource/" + path;
    },
    grantAuth(data) {
        return fetch({
            url: this.fullPage('grantAuth'),
            method: 'post',
            data: data
        });
    }
};

export default UserResourceApi;
