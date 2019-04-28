//常量声明
const acCode= "0002";
const sourceType= 2;

//发布行程-领取红包
const receiveRedPacket= function(tripId){
    return this.POST(this.$url.trip.receiveRedPacket, {
        acCode: acCode,
        sourceType: sourceType,
        sourceId: tripId
    })
}

//查询发布行程领取红包-到期状态/时间
const queryCurrentRedpacket= function(tripId, isSelf){
    return this.POST(this.$url.trip.queryCurrentRedpacket, {
        acCode: acCode,
        sourceType: sourceType,
        tripId: tripId,
        isSelf: isSelf
    })
}

//超时接口（10min），领取红包
const activeRedPackets= function(tripId, isSelf){
    return this.POST(this.$url.trip.activeRedPackets, {
        acCode: acCode
    })
}





export {
    receiveRedPacket,
    queryCurrentRedpacket,
    activeRedPackets
}