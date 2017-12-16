import Vue from 'vue'
import moment from 'moment'

Vue.filter('dateFormat', function (value, format) {
  return moment(value).format(format || "YYYY-MM-DD HH:mm:ss");
});
