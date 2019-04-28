import { $wuxSelect } from "./../../libs/wux/index.js";
import {shares} from "./../../utils/shop.configs.js";
import { $sdaiMask } from "./../../components/base/index.js";
import {getStartDestName} from "./../../utils/public.tool.js";

import {
    receiveRedPacket,
    queryCurrentRedpacket,
    activeRedPackets
} from "./../../assets/js/trip.tip.js"

Page({
    timeoutTrip: null,
    timeoutShare: null,
    tipAutoTime: 10,
    pageConfig: {
        pageNum: 1,
        pageSize: 10
    },
    data: {
        shopIndex: 0,
        scrollY: true,
        tripStatusStr: ["接单中", "暂停接单", "取消行程"],
        customer: [],
        spinShow: true,

        allNum: 0,
        allPrice: 0,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        //$sdaiMask("#mask-tip-normel").show();
        console.warn("onLoad options:: ", options);

        wx.showShareMenu();
        if (options.scene){
            //console.log("options.scene:::", options.scene, " ::: ", decodeURIComponent(options.scene));
            let scene = {};
            decodeURIComponent(options.scene || "").split(",").map((v, i) => {
                if (v) {
                    switch(i){
                        case 0: scene.tripId= v; break;
                        case 1: scene.from = v; break;
                        case 2: scene.share = v; break;
                    }
                }
            })
            options = Object.assign(options, scene);
        }
        console.log("onLoad options:: ", options);

        this.restTripInfo();
        this.setData({
            share: options.share || '',
            from: options.from || '',
            tripId: options.tripId || '',
            profession: (this.data.$state.user.profession || '').split(",").filter(v=> v)
        })

        this.queryCustomerHeadImageByTripId();
        this.getIsFirstOrderByDays();

        this.dialogPhoneWxml= this.selectComponent("#dialog-phone");

        // if(!this.data.$state.user.phone && this.options.from== 'create'){
        //     this.dialogPhoneWxml.show();
        // }

    },
    onShow(){
        console.log("share options:: ", this.options);
        this.sideToIndexComp= this.selectComponent("#side-to-index");

    },
    querySimpleUserInfoByUserId(){
        this.GET(this.$url.trip.querySimpleUserInfoByUserId, {
            userId: this.data.tripInfo.userId,
            }).then((res) => {
                res.data.profession= (res.data.profession || '').split(",").filter(v=> v);
            this.setData({
                "SimpleUser": res.data
            })
        })
    },
    queryMainOrderCountByIncidentallyId(){
        this.GET(this.$url.orders.queryMainOrderCountByIncidentallyId, {
            incidentallyId: this.data.tripInfo.userId,
            }).then((res) => {
            this.setData({
                "incidentallyNum": res.data
            })
        })
    },
    restTripInfo(){
        this.pageConfig.pageNum= 1;
        Promise.all([
            this.GET(this.$url.trip.queryById, { tripId: this.options.tripId}),
            this.GET(this.$url.shop.getShopsByTripId, { tripId: this.options.tripId }),
            this.GET(this.$url.goods.queryAcceptMainOrdersByTripId, { tripId: this.options.tripId })
        ]).then( ([res_0, res_1, res_2]) => {
            res_1.data = this.getProptry(res_1, "data", []);
            if(res_0.data.myTrip){
                wx.setNavigationBarTitle({
                    title: '我的捎带微店'
                })
            }
            this.shopId || (this.shopId = res_1.data[0].id);
            this.setData({
                spinShow: false,
                tripInfo: getStartDestName( Object.assign(res_0.data, {
                    crosscityCharge: +(res_0.data.crosscityCharge || 0)
                }) ),
                shopList: res_1.data.map((v, i) => {
                    return {
                        name: v.shopShortName,
                        id: v.id,
                        active: i == this.data.shopIndex,
                        tagList: v.tagList,
                        address: v.address,
                        logoImageUrl: v.logoImageUrl,
                        category: v.category,
                        categorys: v.categorys,
                        discountRate: v.discountRate,
                        discountName: v.discountName
                    }
                }),
                tripStac: res_2.data,
            })

            this.shopId && this.getSkuSpuBySpuForC();
            this.querySimpleUserInfoByUserId();
            this.queryMainOrderCountByIncidentallyId();

            //自己的行程，领取并查询红包状态
            this.receiveRedPacket();

            wx.createSelectorQuery().select(".left").boundingClientRect().exec((res)=> {
                this.setData({"innerScrollHeight": res[0].height+ 'px' })
            })

        })

    },
    getSkuSpuBySpuForC(){
        this.POST(this.$url.goods.getSkuSpuBySpuForC, Object.assign({}, this.pageConfig, { shopId: this.shopId } ) ).then((res)=>{
            this.setPageList("goodsList", res.data.data, this.pageConfig);
            this.pageRequestAfter(res);
        })
    },
    getIsFirstOrderByDays(){
        this.GET(this.$url.orders.isFirstOrderByDays).then((res)=>{
            if(res.data){
                this.setData({
                    maxDiscountsVel: res.data
                })
            }
        })
    },
    scrolltolower(){
        if (!this.pageRequestBefore()) return;
        this.pageConfig.pageNum++;
        this.getSkuSpuBySpuForC();
    },
    //切换
    changeShopHandel(e){
        this.shopId = e.currentTarget.dataset.id;
        this.setData({ shopIndex: e.currentTarget.dataset.index });
        this.restTripInfo();
    },
    //修改行程状态 picker
    showOtherStatus(){
        if(this.data.tripInfo.tripStatus== 2){
            return;
        }
        $wuxSelect().open({
          value: this.data.tripStatusStr[this.data.tripInfo.tripStatus],
          options: this.data.tripStatusStr,
          onConfirm: (value, index, options) => {
              if(value != this.data.tripStatusStr[this.data.tripInfo.tripStatus])
                this.initiativeUpdateStateByTripId(index);
          },
        })
    },
    startTrip(){
        this.GET(this.$url.user.initiativeUpdateStateByTripId, {
            tripId: this.options.tripId,
            state: 0
            }).then((res) => {
            this.setData({
                "tripInfo.tripStatus": status
            })
        })
    },
    //修改行程状态 request
    initiativeUpdateStateByTripId(status){
        this.GET(this.$url.user.initiativeUpdateStateByTripId, {
            tripId: this.options.tripId,
            state: status
            }).then((res) => {
                this.toast(["已开始接单", "已暂停接单", "取消行程成功"][status]);
                this.setData({
                    "tripInfo.tripStatus": status
                })
        })
    },
    //查询下单用户list
    queryCustomerHeadImageByTripId(){
        this.GET(this.$url.trip.queryCustomerHeadImageByTripId, {
            tripId: this.options.tripId
        }).then((res) => {
            this.setData({
                customer: res.data.map(v => {
                    return {headPortraitUrl: v}
                })
            })
            console.log(this.data.customer)
        })
    },
    submit({detail}){
        if(this.requesting) return;
        if(!detail.length){
          return this.toast("请选择需要捎带的商品");
        };
        //有捎带者id，直接下单
        if(this.options.tripId){
          this.creatOrder(detail);
        }
        //没有则跳转选择捎带者
        else this.navigateTo("/packageTrip/list/index?shopId="+ this.options.shopId+ "&skus="+ JSON.stringify(detail) );
    },
    //快捷下单
    creatOrder(detail){

        this.requesting= true;
        this.setData({spinShow: true});
        this.POST(this.$url.orders.create, {
            userId: this.data.$state.user.id,
            tripId: this.options.tripId,
            skus: detail
        }, { proxy: true }).then((res)=>{
            this.requesting= false;
            this.setData({spinShow: false});
            this.toast({
                type: 'success',
                duration: 3000,
                color: '#fff',
                text: '下单成功',
                success: () => this.navigateTo("/packageOrder/update/with-auto/index?orderId="+ res.data)
            })
        }).catch(()=>{
            this.requesting= false;
            this.setData({spinShow: false});
        })
    },
    editPhone({detail}){

        let _up = ()=>{
            this.getUserInfo().then(()=>{
                this.setData({spinShow: false});
                this.dialogPhoneWxml.hide();
                this.toast({
                    type: 'success',
                    duration: 1000,
                    color: '#fff',
                    text: '手机号修改成功'
                });
                this.setData({
                    phone: this.data.$state.user.phone
                });
            });
        }

        

        this.setData({spinShow: true});
        if(detail.code == -100){
            _up();
            return;
        }
        this.POST(this.$url.user.updatePhoneById, {
            checkCode: +detail.code,
            phone: +detail.phone
        }, { proxy: true }).then((res)=>{

            _up();

        })
    },
    onPullDownRefresh: function () {
        this.setData({ scrollY: false })
    },
    onReachBottom: function () {
        this.setData({ scrollY: true })
    },
    onPageScroll: function ({ scrollTop }){
        this.data.scrollY && this.setData({ scrollY: false })
    },
    onShareAppMessage: function (e) {
        if(e.from== 'button' && e.target.dataset.type== 'trip-tip'){
            return {
                title: "我在人人捎带领了红包，快帮我开启一下红包吧，您也有红包领哦~~",
                path: `/packageShare/in/trip-tip/index?tripId=${e.target.dataset.sourceid}&share=true`,
                imageUrl: this.data.$state.assetsUrl+ "img_fxxc@2x.png",
            }
        }
        let shareText= shares[ this.data.shopList[0].category ].text;
        if(this.data.shopList[0].category.includes('地方特色')){
            shareText= this.data.tripInfo.startLocalName_comp+ shareText;
        }
        return {
            title: shareText,
            path: `/packageTrip/detail/index?scene=${this.options.tripId},auto,true`,
        }
    },
    onshareHandel(e){

        if(e.detail.index== 1) return;

        this.navigateTo("/packageShare/out/trip/index", {
            tripId: this.options.tripId,
            category: this.data.shopList[0].category,
            from: "auto"
        })

    },
    showRemarks(){
        this.alert(this.data.tripInfo.remarks)
    },
    showstartAddress(){
        $sdaiMask().show();
        //this.alert(this.data.tripInfo.startAddress+ ' - '+ this.data.tripInfo.destAddress);
    },
    hidestartAddress(){
        $sdaiMask().hide();
    },

    //发布行程领取红包
    receiveRedPacket(){
        
        if(!this.data.tripInfo.myTrip || this.selectTip ) return;
        
        this.selectTip= true;
        
        if(this.options.from== 'create'){
            receiveRedPacket.call(this, this.options.tripId).then(res=>{
                console.log(res)
            }).then(this.queryCurrentRedpacket)
        }else{
            this.queryCurrentRedpacket();
        }
        
    },
    //查询红包状态
    queryCurrentRedpacket(){
        queryCurrentRedpacket.call(this, this.options.tripId, this.data.tripInfo.myTrip).then(res=>{
            
            console.log("发布行程红包+ 分享红包 ::: ", res);

            if((!res.data.tripRedPacket.id || res.data.tripRedPacket.isRead== 1) && !res.data.shareRedPacket.id){
                this.tripTip= true;
                this.shareTip= true;
                this.openPhonedialog();
                return;
            }

            if(res.data.tripRedPacket && res.data.tripRedPacket.id && !res.data.tripRedPacket.isRead){

                if(this.data.tripInfo.myTrip){
                    res.data.tripRedPacket.templateDesc= res.data.tripRedPacket.status== 3 ? '恭喜您，现金红包已到账' : "邀请2位好友点击，可立即获得";
                }

                //行程红包已超时
                if( res.data.tripRedPacket.status!= 3 && res.data.currentDate- res.data.tripRedPacket.createTime> 1000* 60* this.tipAutoTime ){
                    activeRedPackets.call(this);
                }
                //行程红包未超时，未读
                else if( !res.data.tripRedPacket.isRead || res.data.tripRedPacket.status != 3 ){
                    this.setData({
                        tripRedPacket: Object.assign({currentDate: res.data.currentDate}, res.data.tripRedPacket)
                    })
                    $sdaiMask("#mask-tip-trip").show();

                    if(res.data.tripRedPacket.status!= 3){
                        this.timeoutTrip= setTimeout(()=>{
                            activeRedPackets.call(this).then(()=>{
                                this.queryCurrentRedpacket();
                            });
                            $sdaiMask("#mask-tip-trip").hide();
                            this.cleartimeout();
                        }, res.data.tripRedPacket.createTime+ 1000* 60* this.tipAutoTime- res.data.currentDate+ 500);//往后偏移500ms
                    }

                }

            }else{
                this.tripTip= true;
            }

            //分享红包
            if(res.data.shareRedPacket && res.data.shareRedPacket.id){
                if(!res.data.shareRedPacket.isRead){
                    this.setData({ shareRedPacket: res.data.shareRedPacket })
                    $sdaiMask("#mask-tip-share").show();
                }
            }else{
                this.shareTip= true;
            }
            
            

        })
    },
    //红包已读
    readUserTemplate(id){
        this.POST(this.$url.activity.readUserTemplate, { id } ).then(res=> {
            this.alert({
                resetOnClose: true,
                content: "已领取到平台账户内, 可提现到微信钱包",
                onConfirm: (e) => {
                    this.openPhonedialog();
                }
            });
            this.queryCurrentRedpacket();
        });
    },
    //行程红包领取
    tripTipSureHandel({detail}){
        $sdaiMask("#mask-tip-trip").hide();
        this.readUserTemplate(this.data.tripRedPacket.id);
    },
    tripTipCloseHandel(){
        $sdaiMask("#mask-tip-trip").hide(); 
        this.tripTip= true;
        if(this.data.tripRedPacket.status== 3){
            this.readUserTemplate(this.data.tripRedPacket.id);
        }
        else{
            this.openPhonedialog();
        }
    }, 
    //分享红包领取
    shareTipSureHandel(){
        this.shareTipCloseHandel();
        this.readUserTemplate(this.data.shareRedPacket.id);
    },
    shareTipCloseHandel(){
        $sdaiMask("#mask-tip-share").hide();
        this.shareTip= true;
    },
    //检查手机号并弹窗
    openPhonedialog(){
        if(!this.data.$state.user.phone && this.options.from== 'create' && this.tripTip && this.shareTip){
            this.dialogPhoneWxml.show();
        }
    },
    cleartimeout(){
        clearTimeout(this.timeoutTrip);
        this.timeoutTrip= null;
        clearTimeout(this.timeoutShare);
        this.timeoutShare= null;
    },
    onUnload(){
        this.cleartimeout();
    },

    tripOrder(){
        if(!this.data.tripInfo.myTrip || this.data.from == "create") return;
        this.navigateTo("/packageOrder/list/trip/index", {
            tripId: this.data.tripInfo.id,
            tabChose: "waitingPay",
            shopIds: JSON.stringify(this.data.shopList.map(v=> v.id))
        })
    }

})
