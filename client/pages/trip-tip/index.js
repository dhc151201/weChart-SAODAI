import { $sdaiMask } from "./../../components/base/index.js";
const wxParser = require('./../../libs/wxParser/index');

Page({
    data: {
        richText: ""
    },
    onLoad: function (options) {
        let html = `<div style="color: #f00;">hello, wxParser!</div>`;
        this.wxParserHtml(html);
    },
    showRols(){
        $sdaiMask("#mask-tip-normel").show();
    },
    hideRols(){
        $sdaiMask("#mask-tip-normel").hide();
    },
    wxParserHtml(htmlString){
        let that = this;
        wxParser.parse({
            bind: 'richText',
            html: htmlString,
            target: that,
            enablePreviewImage: false, // 禁用图片预览功能
            tapLink: (url) => { // 点击超链接时的回调函数
                // url 就是 HTML 富文本中 a 标签的 href 属性值
                // 这里可以自定义点击事件逻辑，比如页面跳转
                // wx.navigateTo({
                //     url
                // });
            }
        });
    }
})