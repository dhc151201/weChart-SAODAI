//常量声明
const acCode= "0004";
const sourceType= 3;

//发布行程-领取红包
const receiveRedPacket= function(orderId){
    return this.POST(this.$url.trip.receiveRedPacket, {
        acCode: acCode,
        sourceType: sourceType,
        sourceId: orderId
    })
}

const activeRedPackets= function(orderId){
    return this.POST(this.$url.trip.activeRedPackets, {
        acCode: acCode,
        sourceType: sourceType,
        sourceId: orderId
    })
}

export {
    receiveRedPacket,
    activeRedPackets
}