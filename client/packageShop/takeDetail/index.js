import {sendTemplmsg} from "./../../assets/js/tmplmsg.js"

Page({
    //记录所选商品
    chose: {},
    data: {
        showNum: 4,
        showAll: false,
        spinShow: true,
        choseAll: false,
        choseNum: 0,
    },
    onLoad: function (options) {
        this.getLatlng().then(this.getDeliveryOrder)
    },
    getDeliveryOrder(data){
        this.POST(this.$url.orders.getDeliveryOrder, Object.assign({}, data, this.options)).then((res)=>{
            res.data.allAmountStr= (res.data.shopSkuAmount- res.data.rebateAmount).toFixed(2);
            this.setData({
                info: res.data,
                spinShow: false,
            })
        })
    },
    resetPrice(){
        let value= 0;
        this.data.info.details.map( v => {
            v.skus= v.skus.map( m => {
                if (m.chose) value += m.salePrice * m.skuCount;
                return m
            });
        })
        //console.log(this.data.choseNum , value)
        this.setData({
            chosePrice: value.toFixed(2),
            chosePriceReal: (value- (this.data.choseNum ? this.data.info.rebateAmount : 0)).toFixed(2),
        })
    },
    resetChoseNum(){
        let i= 0;
        this.data.info.details.map( v => {
            v.skus= v.skus.map( m => {
                if(m.chose) i++;
                return m;
            });
            return v;
        })
        this.setData({
            choseNum: i
        })
        this.resetPrice();
    },
    choseComponent({detail}){
        let i= 0, obj={choseAll: false};
        this.data.info.details.map((v, index)=> {
            if(v.orderId == detail.orderId){
                obj["info.details["+ index+ "]"]= detail;
                this.setData(obj);
            };
        })
        this.resetChoseNum();
        //console.log(this.data.info.details)
    },
    choseAllHandel(){
        this.setData({
            choseAll: !this.data.choseAll
        })
        let arr= this.data.info.details.map( v => {
            console.log(v)
            v.skus= v.skus.map( m => {
                m.chose= this.data.choseAll;
                return m;
            })
            return v;
        })
        this.setData({
            "info.details": arr
        })
        this.resetChoseNum();
    },
    submit(e){
        if(this.requesting) return;
        let reqData= {
            //shopType: this.data.info.merchantEntered,
            //merchantId: this.data.info.merchantId,
            takeDetails: this.data.info.details.map( v => {
                let arr= v.skus.map( m => {
                    if(m.chose) return m.skuId;
                }).filter(v=> v);
                if(arr.length){
                    return {
                        orderId: v.orderId,
                        skuIds: arr
                    }
                }
            }).filter(v=> v)
        }
        if(!reqData.takeDetails.length){
            this.toast("请选择已提货的商品");
            return;
        }
        this.setData({ spinShow: true });
        this.requesting= true;
        Object.assign(reqData, this.options);
        
        console.log("确认提货::: ", reqData);

        if(e.detail.formId){
            sendTemplmsg.call(this, e.detail.formId);
        }

        this.POST(this.$url.orders.take, reqData).then((res) => {
            this.alert({
                resetOnClose: true,
                content:  `提货款及捎带收入已放您的平台账户，行程完成即可提现。请向店铺支付${this.data.chosePriceReal}元`,
                onConfirm: (e)=> {
                    this.navigateBack();
                },
            })
            /*
            this.alert({
                resetOnClose: true,
                content: this.data.info.merchantEntered== 1 ? 
                    `提货款及捎带收入已放您的平台账户，行程完成即可提现。
                    请向店铺支付${this.data.chosePriceReal}元` : 
                    `该用户的商品确定提货成功，入驻商户不需要向商户付款，请在${ moment(this.data.info.tripArriveTime).format('YYYY-MM-DD HH:mm')} 前送达~~`,
                onConfirm: (e)=> {
                    this.navigateBack();
                },
            })
            */
           /*
            this.toast({
                type: 'success',
                duration: 1000,
                color: '#fff',
                text: `该用户的商品确定提货成功，入驻商户不需要向商户付款，请在${ moment(this.data.info.arriveTime).format('YYYY-MM-DD HH:mm')} 前送达~~`,
                success: () => this.navigateBack(),
            })
            */
            this.requesting= false;
            this.setData({ spinShow: false });
        }).catch(()=>{
            this.requesting= false;
            this.setData({ spinShow: false });
        })

    },
    
})