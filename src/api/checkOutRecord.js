import fetch from '@/utils/fetch'

let CheckInRecordApi = {
  fullPage: function(path) {
    return "/checkInRecord/" + path;
  },
  checkOut: function(data) {
    return fetch({
      url: this.fullPage('checkOut'),
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

export default CheckInRecordApi;
