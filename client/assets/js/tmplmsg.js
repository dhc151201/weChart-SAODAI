import {bus} from "./../../utils/url.config.js"


//埋点接口，用于发送模版消息
const sendTemplmsg= function(formId){
    //return;
    console.log("eventTracking::: ",formId);
    return this.GET(this.$url ? this.$url.bus.eventTracking : bus.eventTracking, {
        formId: formId,
    })
}

export {
    sendTemplmsg
}

