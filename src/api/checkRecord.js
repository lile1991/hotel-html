import fetch from '@/utils/fetch'

let CheckRecordApi = {
  fullPage: function(path) {
    return "/checkRecord/" + path;
  },
  checkIn: function(data) {
    return fetch({
      url: this.fullPage('checkIn'),
      method: 'post',
      data: data
    });
  },
  findManage: function(data) {
    return fetch({
      url: this.fullPage('findManage'),
      method: 'post',
      data: data
    });
  },
  leave: function(id) {
    return fetch({
      url: this.fullPage('leave/' + id),
      method: 'get'
    });
  },
  findCheckOut: function(id) {
    return fetch({
      url: this.fullPage('findCheckOut/' + id),
      method: 'get'
    });
  },
  getCheckStateEnums: function() {
    return fetch({
      url: this.fullPage('getCheckStateEnums'),
      method: 'get'
    });
  },
  reserveCheckIn: function(id) {
    return fetch({
      url: this.fullPage('reserveCheckIn/' + id),
      method: 'get'
    });
  }
};

export default CheckRecordApi;
