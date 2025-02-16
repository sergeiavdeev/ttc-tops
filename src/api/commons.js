export default {

  dateToString(date) {
    if (!date) {
      date = new Date();
    }
    let year = date.getFullYear();
    let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return  year + '-' + month + '-' + day;
  },

  timeToString(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
  },

  getDate(time) {
    let date = new Date()
    date.setHours(time.split(':')[0])
    date.setMinutes(time.split(':')[1])
    return date
  },

  getDurationText(startTime, endTime) {

    const start = startTime.split(':')[0] * 60 + Number(startTime.split(':')[1])
    const end = endTime.split(':')[0] * 60 + Number(endTime.split(':')[1])
    let duration = (end - start) / 60
    if (duration === 1) {
      return duration + ' час'
    }
    return duration + ' часа'
  },


}
