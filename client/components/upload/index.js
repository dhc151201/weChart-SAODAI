// components/upload/index.js
import config from "./../../utils/global.config.js"
//console.log(config.REQUEST + "/upload/v1/cos/image")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    max: {
      type: Number,
      value: -1,
      observer: 'updated',
    },
    count: {
      type: Number,
      value: 9,
      observer: 'updated',
    },
    sizeType: {
      type: Array,
      value: ['original', 'compressed'],
    },
    sourceType: {
      type: Array,
      value: ['album', 'camera'],
    },
    url: {
      type: String,
      value: '',
    },
    name: {
      type: String,
      value: 'file',
    },
    header: {
      type: Object,
      value: {},
    },
    formData: {
      type: Object,
      value: {},
    },
    uploaded: {
      type: Boolean,
      value: true,
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    progress: {
      type: Boolean,
      value: false,
    },
    listType: {
      type: String,
      value: 'text',
    },
    defaultFileList: {
      type: Array,
      value: [],
    },
    fileList: {
      type: Array,
      value: [],
      observer(newVal) {
        if (this.data.controlled) {
          this.setData({
            uploadFileList: newVal,
          })
        }
      },
    },
    controlled: {
      type: Boolean,
      value: false,
    },
    showUploadList: {
      type: Boolean,
      value: true,
    },
    showRemoveIcon: {
      type: Boolean,
      value: true,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    uploadUrl: config.UPLOAD + "/upload/v1/cos/image",
    header: {
      "chartset": "utf-8",
      "content-type": 'application/x-www-form-urlencoded'
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(info = {}) {
      this.triggerEvent('change', info)
    },
    onSuccess: function(info = {}){
      var url = JSON.parse(info.detail.file.res.data);
      this.triggerEvent('success', { 
        url: "http://" + url.data.cdnHttp + '/' + url.data.fileName 
      });
    },
    onFail: function (info = {}) {
      this.triggerEvent('fail', info);
    },
    onProgress: function (info = {}){
      console.log(info)
      this.triggerEvent('progress', info)
    },
    onComplete: function (info= {}) {
      this.triggerEvent('complete', info)
    },
  }
})
