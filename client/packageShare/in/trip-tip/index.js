import { $sdaiMask } from "./../../../components/base/index.js";
const wxParser = require('./../../../libs/wxParser/index');
import { activeRedPackets, receiveRedPacket, queryCurrentRedpacket } from "./../../../assets/js/trip.tip.js"

Page({
    timeoutTrip: null,
    timeoutShare: null,
    data: {
        richText: "",
        tripRedPacket: {}
    },
    onShow: function () {

        receiveRedPacket.call(this, this.options.tripId);

        this.queryActivityDetail();
        this.getTripInfo();

        this.sideToIndexComp= this.selectComponent("#side-to-index");

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
    },
    queryActivityDetail(){
        this.GET(this.$url.activity.queryActivityDetail).then( res => {
            console.log("活动数据", res);
            if(!res.data || res.data.activityStatus== 3){
                return this.alert({
                    resetOnClose: true,
                    content: "活动已结束，前去其他地方逛逛吧",
                    onConfirm: (e) => {
                        wx.reLaunch({
                            url: "/pages/with-help/index/index"
                        })
                        //this.redirectTo("/pages/with-help/index/index")
                    }
                })
            }
            else if(res.data.activityStatus== 1){
                return this.alert({
                    resetOnClose: true,
                    content: "活动未开始，前去其他地方逛逛吧",
                    onConfirm: (e) => {
                        wx.reLaunch({
                            url: "/pages/with-help/index/index"
                        })
                        //this.redirectTo("/pages/with-help/index/index")
                    }
                })
            }
            this.setData({
                activityDetail: res.data
            })
            this.wxParserHtml(res.data.acDesc);
            this.queryUserByTripId();
            this.queryPartActivityUsers();
            this.queryCurrentUserPartActivity();
        })
    },
    queryUserByTripId(){
        this.POST(this.$url.activity.queryUserByTripId, this.options ).then( res => {
            this.setData({
                tripUser: res.data
            })
        })
    },
    queryPartActivityUsers(){
        this.POST(this.$url.activity.queryPartActivityUsers, { acCode: "0002"} ).then( res => {
            this.setData({
                totalUserNum: res.data.totalUserNum,
                activityUsers: res.data.users
            })
        })
    },
    queryCurrentUserPartActivity(){
        this.POST(this.$url.activity.queryCurrentUserPartActivity, { acCode: "0002"} ).then( res => {
            this.setData({
                currentUser: res.data
            })
        })
    },
    getTripInfo(){
        this.GET(this.$url.trip.queryById, { tripId: this.options.tripId}).then(res => {
            this.setData({
                myTrip: res.data.myTrip
            })
            this.queryCurrentRedpacket();
        })
    },
    queryCurrentRedpacket(){
        //return;
        queryCurrentRedpacket.call(this, this.options.tripId, this.data.myTrip).then(res => {

            console.log("发布行程红包+ 分享红包 ，入口 ::: ", res);

            //自动激活
            this.activeTipAuto(res);

            this.setData({
                tripRedPacket: Object.assign({currentDate: res.data.currentDate}, this.resetTripData(res)),
                shareRedPacket: Object.assign({
                        currentDate: res.data.currentDate,
                        shareTrip: true
                    }, this.resetShareData(res)),
                "showPage": true
            })

        })
    },
    //自动激活红包
    activeTipAuto(res){
        let trip= res.data.tripRedPacket, share= res.data.shareRedPacket;

        //红包已超时，自动激活
        if(trip.id && trip.status!= 3){
            if(res.data.currentDate- trip.createTime> 1000* 60* 10){
                activeRedPackets.call(this).then(this.queryCurrentRedpacket);
            }
            else{
                this.timeoutTrip= setTimeout(()=>{
                    activeRedPackets.call(this).then(this.queryCurrentRedpacket);
                    clearTimeout(this.timeoutTrip);
                    this.timeoutTrip= null;
                }, trip.createTime+ 1000* 60* 10- res.data.currentDate+ 500);
            }
        }

        //红包已超时，自动激活
        if(share.id && share.status!= 3){
            if(res.data.currentDate- share.createTime> 1000* 60* 10){
                activeRedPackets.call(this).then(this.queryCurrentRedpacket);
            }
            else{
                this.timeoutShare= setTimeout(()=>{
                    activeRedPackets.call(this).then(this.queryCurrentRedpacket);
                    clearTimeout(this.timeoutShare);
                    this.timeoutShare= null;
                }, share.createTime+ 1000* 60* 10- res.data.currentDate+ 500);
            }
        }

    },
    //重组行程红包数据
    resetTripData(res){
        let trip= res.data.tripRedPacket;
        if(trip.id){
            if(trip.status== 3){
                trip.isRead= 1
            }
            trip.templateDesc= trip.status== 3 ? '恭喜您，现金红包已到账' : "邀请2位好友点击，可立即获得";
        }
        else if(!res.data.amountIsOver){
            trip.templateDesc= '每日首次发捎带行程,领现金红包';
            trip.btnText= "发布行程，领取红包";
        }
        else if(res.data.amountIsOver){
            trip.templateDesc= '活动红包已经发光啦,下次早一点来吧~';
            trip.btnText= "发布行程";
            trip.status= 3
            trip.isRead= 1
        }
        return trip;
    },
    //重组分享红包数据
    resetShareData(res){
        let share= res.data.shareRedPacket;
        if(share.id){
            if(share.status== 3){
                share.isRead= 1
            }
            share.templateDesc= share.status== 3 ? '恭喜您，现金红包已到账' : "发个行程可立即开启红包";
        }
        //活动结束、 已达上限
        else{
            share.templateName= "分享现金红包"
            share.status= 3
            share.isRead= 1

            if(share.isLimit){
                share.templateDesc= "每人每天可领取4个分享红包,您今天已经领完啦，明天再来吧~"
                share.btnText= "已领完，发布行程";
            }
            else if(res.data.amountIsOver){
                share.templateDesc= "活动红包已经发光啦,下次早一点来吧~";
                share.btnText= "已结束，发布行程";
            }
        }
        return share;
    },
    cleartimeout(){
        clearTimeout(this.timeoutTrip);
        this.timeoutTrip= null;
        clearTimeout(this.timeoutShare);
        this.timeoutShare= null;
    },
    onHide(){
        this.cleartimeout();
    }
})
