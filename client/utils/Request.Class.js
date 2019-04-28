/*
 * @Author: denghuaicheng 
 * @Date: 2019-03-12 11:20:42 
 * @Last Modified by: denghuaicheng
 * @Last Modified time: 2019-03-12 12:18:56
 */

class Request{

    constructor(){
        this.proxySplitMap= new Map();
    }

    config= {
        "content-type" : "application/json",
        "baseUrl": "",
        "proxyTimeout": 3000
    }

    //model处理，自行补充
    ressetModel(model, method){
        return {
            ...model,
            method,
        }
    }

    //请求处理，自行补充
    request(model, method){
        model= this.ressetModel(model, method);
        console.log(model)
    }

    proxy(model, method){

        let mapKey= JSON.stringify(model);

        if(this.proxySplitMap.has(mapKey)){
            console.error("请求已代理，连续请求已被拦截。。。。。");
        }
        else{
            this.proxySplitMap.set(mapKey, 1);
            this.request(model, method);
            this[mapKey]= setTimeout(()=>{
                console.warn("清除request proxy timeout");
                this.proxySplitMap.delete(mapKey);
                clearTimeout(this[mapKey]);
                this[mapKey]= null;
            }, model.config.proxyTimeout || this.config.proxyTimeout);
        }
    }

    get(url= '', query= {}, config= {}){

        /*
        * @url: String, 会自动检测是否带有http(https),注意baseUrl的设置
        * @query: Object, 请求数据对象
        * @config: Object
        *   - proxy: 是否代理，防止连续请求，比如用户连续点了两次，导致后一次接口报错。
        *   - proxyTimeout: 代理间隔时间
        *   - header: 设置请求的 header
        *   - dataType: 返回的数据格式
        *   - responseType: 响应的数据类型
        */

        let model= {url, query, config}, method= "GET";

        if(model.config.proxy=== true){
            this.proxy(model, method);
        }
        else{
            this.request(model, method);
        }

    };

    post(url= '', query= {}, config= {}){

        /*
        * @url: String, 会自动检测是否带有http(https),注意baseUrl的设置
        * @query: Object, 请求数据对象
        * @config: Object
        *   - proxy: 是否代理，防止连续请求，比如用户连续点了两次，导致后一次接口报错。
        *   - proxyTimeout: 代理间隔时间
        *   - header: 设置请求的 header
        *   - dataType: 返回的数据格式
        *   - responseType: 响应的数据类型
        */

        let model= {url, query, config}, method= "POST";

        if(model.config.proxy=== true){
            this.proxy(model, method);
        }
        else{
            this.request(model, method);
        } 

    };

};

/*  
//示例：

var ajax= new Request();
console.log(ajax);

ajax.post("/app/test", {name: 123}, {proxy: true});

ajax.post("/app/test", {name: 123}, {proxy: true});

setTimeout(()=>{
    ajax.post("/app/test", {name: 123}, {proxy: true});
}, 4000)

*/


