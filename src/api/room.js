import fetch from '@/utils/fetch'

let RoomtApi = {
  fullPage: function(path) {
    return "/room/" + path;
  },
  findManage: function(data) {
    return fetch({
      url: this.fullPage('findManage'),
      method: 'post',
      data: data
    });
  },
  findAll: function(condition) {
    return fetch({
      url: this.fullPage('findAll'),
      method: 'post',
      data: condition
    });
  },
  enable: function(id) {
    return fetch({
      url: this.fullPage('enable/' + id),
      method: 'get'
    });
  },
  disable: function(id) {
    return fetch({
      url: this.fullPage('disable/' + id),
      method: 'get'
    });
  }
};

export default RoomtApi;
