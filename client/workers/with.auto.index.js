const request = function(res){
    this.POST(res.url, res.reqdata).then((res) => {
        worker.postMessage(res.data);
    })
}

worker.onMessage(function (res, page) {
    console.log(res, page)
    switch(res.type){
        case "request" : request.call(page, res); break;
    }
})