import fetch from '@/utils/fetch'

let ResourceApi = {
    fullPage(path) {
        return "/resource/" + path;
    },
    findTree() {
        return fetch({
            url: this.fullPage('findTree'),
            method: 'get'
        });
    }
};

export default ResourceApi;
