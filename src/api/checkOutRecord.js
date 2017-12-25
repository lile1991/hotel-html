import fetch from '@/utils/fetch'

let CheckOutRecordApi = {
  fullPage: function(path) {
    return "/checkOutRecord/" + path;
  },
  checkOut: function(data) {
    return fetch({
      url: this.fullPage('checkOut'),
      method: 'post',
      data: data
    });
  }
};

export default CheckOutRecordApi;
