// 在 Worker 线程执行上下文会全局暴露一个 worker 对象，直接调用 worker.onMeesage/postMessage 即可
worker.onMessage(function (res) {

  let list = res.cityList, e= res.e;
  
  var key = [];
  //一次查询循环 2553 次， 建议手动触发查询

  for (let m = 0, len_m = list.length; m < len_m; m++) {
    for (let n = 0, len_n = list[m].cityInfo.length; n < len_n; n++) {
      if (list[m].cityInfo[n].city.includes(e.detail.value)) {
        key.push(list[m].cityInfo[n]);
      }
      //   if (list[m].cityInfo[n].city === e.detail.value) {
      //     key.push(list[m].cityInfo[n]);
      //   }
    }
  }

  worker.postMessage(key);

})