import Vue from 'vue'
import moment from 'moment'

Vue.filter('timestamp2Date', function (value, format) {
  return moment(new Date(value)).format(format || "YYYY-MM-DD HH:mm:ss");
});
