"use strict"

/*
  获取对象中的某个属性值，可传入默认值，可解决接口数据中字符串split遇到undefined或null的情况
*/
const getProptry= function (obj, props, def) {
  if ( obj == null || props == null || typeof props !== 'string') return def;
  const temp = props.split('.'),
  fieldArr = [].concat(temp);
  temp.forEach((e, i) => {
    if (/^(\w+)\[(\w+)\]$/.test(e)) {
      const matchs = e.match(/^(\w+)\[(\w+)\]$/),
      field1 = matchs[1],
      field2 = matchs[2],
      index = fieldArr.indexOf(e);
      fieldArr.splice(index, 1, field1, field2);
    }
  })
  return fieldArr.reduce((pre, cur) => {
    const target = pre[cur] || def;

    if (target instanceof Array) {
      return [].concat(target);
    }
    if (target instanceof Object) {
      return Object.assign({}, target)
    }
    return target;
  }, obj)
};
//var c = {a: {b : [1,2,3] }}
//get(c ,'a.b')     // [1,2,3]
//get(c, 'a.b[1]')  // 2
//get(c, 'a.d', 12)  // 12

//黑科技深拷贝
const deepCopy= function(data){
  if(data instanceof Object || data instanceof Array)
    return JSON.parse(JSON.stringify(data));
  else
    return data;
};

//节点信息查询
const query = function(select){
  return new Promise((solove, reject) => {
    if (!select) return solove({});
    wx.createSelectorQuery().select(select).boundingClientRect().exec((res) => {
      return solove(res)
    })
  })
};

//是否全中文
const isChinese = function (obj){
  var reg = /^[\u0391-\uFFE5]+$/;
  if (obj != "" && !reg.test(obj)) {
    //alert('必须输入中文！');
    return false;
  }
  return true;
};

//手机号检测
const isPhoneNum = function (str) {
  return /^(0|86|17951)?(1)[0-9]{10}$/.test(str)
};

//全局过滤器
const filters= {
  //人民币格式化 return String '0.00'/'1.55'/'10.00'
  money: function(value= 0){
    value = (+value).toFixed(2);
    value = value.toString();
    if (!value) return "0.00";
    if (value.includes('.')) return value;
    else return value + '.00';
  },
  //日期与本地或服务器日期比较 格式化输出 //return: 今天+时分 / 明天+时分 / 其他(月日时分)
  getDayName(endTime, serviceTime) {
    //endTime:目标时间戳, serviceTime:服务器时间戳

    endTime = endTime || (new Date()).getTime() + 1000 * 60;

    var now_y = (new Date(endTime)).getFullYear(),
        now_m = (new Date(endTime)).getMonth()+ 1,
        now_d = (new Date(endTime)).getDate(),
        now_h = (new Date(endTime)).getHours(),
        now_s = (new Date(endTime)).getMinutes();

    now_m = now_m < 10 ? ('0' + now_m) : now_m;
    now_d = now_d < 10 ? ('0' + now_d) : now_d;
    now_h = now_h < 10 ? ('0' + now_h) : now_h;
    now_s = now_s < 10 ? ('0' + now_s) : now_s;

    var endTime_self = new Date([now_y, now_m, now_d].join("-")+ ' 00:01').getTime();
    var localTime_self = serviceTime || (new Date()).getTime();

    var dayname = (endTime_self - localTime_self) / (1000 * 60 * 60 * 24);

    let YMD = now_m+ "月" + now_d + "日";
    let time = now_h + ":" + now_s;

    if (dayname >= 2) dayname = YMD + time;
    else if (dayname >= 1) dayname = "后天" + time;
    else if (dayname >= 0) dayname = "明天" + time;
    else if (dayname >= -1) dayname = "今天" + time;
    else dayname = YMD + time;

    return dayname;

  },
  //距离格式化
  distance: function(number){
    if(!number || number < 100) return "附近";
    if(number < 1000) return number.toFixed(0)+ 'm';
    return (number/1000).toFixed(2)+ 'km';
  }
};

//对象转换成数组 每一项的值：key=value
const objectToArrayKeyValue= function(object= {}){
  let arr= [];
  for (let key in object){
    arr.push(key + '=' + object[key]);
  }
  return arr;
};

//获取节点dataset
const getDataset= function(e){
  return e ? e.currentTarget.dataset : {};
};

//调起拨号 节点dataset需存在data-phone
const makePhoneCall= function(e){
  
  if (!getDataset(e).phone){
    try{
      let pages = getCurrentPages();
      pages.lastItem().alert("联系人号码有误，请联系客服");
    }catch(e){ }finally{
      return console.error("节点dataset需存在有效的手机号data-phone");
    }
  }
  
  wx.makePhoneCall({
    phoneNumber: getDataset(e).phone
  })

};

//路由跳转query组装序列化
const queryUrlString = function (query = {}) {
  let arr = [];
  for (let k in query) {
    arr.push(`${k}=${query[k]}`);
  }
  return arr.length ? `?${arr.join("&")}` : "";
};

const wx_pay= function(res){
  return new Promise((reslove, reject)=>{
    let pay_data= Object.assign({
      package: "prepay_id="+ res.data.prepayId,
      success: (res)=> { 
          reslove(res);
      },
      fail: (res)=> { 
          console.error(res);
          reject(res);
      }
    }, res.data);
    //console.log("支付参数：", pay_data)
    wx.requestPayment(pay_data);
  })
}


const getStartDestName= function(v){
  // 空对象数据
  if(!v) return {};
  // 无数值
  if(!v.destCityName || !v.startCityName){
    v.destLocalName_comp= v.destCityName || '';
    v.startLocalName_comp= v.startCityName || '';
    return v;
  }
  // 不同城
  if(v.destCityName != v.startCityName) {
    v.destLocalName_comp= v.destCityName;
    v.startLocalName_comp= v.startCityName;
  }
  // 不同区
  else if(v.destRegionValue != v.startRegionValue){
    v.destLocalName_comp= v.destRegionValue || v.destCityName;
    v.startLocalName_comp= v.startRegionValue || v.startCityName;
  }
  // 同区
  else{
    v.destLocalName_comp= (v.destRegionValue || v.destCityName)+ "...";
    v.startLocalName_comp= (v.startRegionValue || v.startCityName)+ "...";
  }
  
  return v;
}

const getGoodsPuttype= function(){
  return ['希望送货上门', '同城邮'];
}


export {
  getProptry,
  deepCopy,
  query,
  isChinese,
  isPhoneNum,
  filters,
  objectToArrayKeyValue,
  getDataset,
  makePhoneCall,
  queryUrlString,
  wx_pay,
  getStartDestName,
  getGoodsPuttype
}
