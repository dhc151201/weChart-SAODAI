"use strict"

import { $wuxToast, $wuxDialog, $wuxLoading } from './../libs/wux/index.js'

let toast= {
  show: (object)=> $wuxToast().show(object)
}

let dialog= {
  dialog: () => $wuxDialog(),
  alert: (object) => $wuxDialog().alert({
    resetOnClose: true,
    content: typeof object== "string" ? object : object.content,
    confirmText: "朕知道了",
    confirmType: 'primary',
    onConfirm(e) {
      typeof object == "object" && object.onConfirm instanceof Function && object.onConfirm();
    },
  }),
  confirm: (object) => $wuxDialog().confirm({
    resetOnClose: true,
    closable: object.closable || false,
    title: object.title || '',
    content: object.content,
    confirmText: object.confirmText || '确定',
    onConfirm(e) {
      object.onConfirm instanceof Function && object.onConfirm();
    },
    onCancel(e) {
      object.onCancel instanceof Function && object.onCancel();
    },
  })
}

let loading= {
  show: (object) => {
    wx.showLoading({
      title: object.text,
    });
    //$wuxLoading().show(object)
  },
  hide: () => {
    wx.hideLoading()
    //$wuxLoading().hide()
  }
}

export default {
  toast, dialog, loading
}