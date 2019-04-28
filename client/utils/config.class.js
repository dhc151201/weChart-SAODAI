class ConfigClass{

    static BMapKey= "nk1h8AGd0h1YqW1IU2ip4gnF2QBqNL5V";
    static QQMapKey= "RVZBZ-JZ6WX-K7K4X-Z7OJU-L5W4F-JCBJN";
    static WEBVIEW= "https://rrsd.rrkd.cn";
    static ASSETSURL= "http://group2-1251487137.image.myqcloud.com/app/";
    static REQUEST = "";
    static UPLOAD = "";

    static getRequest(environment) {
        switch (environment) {
            case 'pro': return {
                    REQUEST: "https://rrsd.rrkd.cn",
                    UPLOAD: "https://rrsd.rrkd.cn"
                };
            case 'test': return {
                    REQUEST: "http://testsd.rrkd.cn:8030",
                    UPLOAD: "http://testsd.rrkd.cn:8030"
                };
            case 'zby': return {
                    REQUEST: "http://172.16.20.227:9010",
                    UPLOAD: "http://172.16.20.227:9012"
                };
            case 'dev':
            default: return {
                    REQUEST: "http://172.16.60.81:9010",
                    UPLOAD: "http://172.16.60.81:9012"
                };
        };
    };

    constructor(){
        // 开发环境 dev
        // 测试环境 test
        // 线上环境 pro
        // 本缘兄服务 zby
        this.environment= "pro";
    }

    //request base url
    getRequestBaseUrl(){
        return this.constructor.getRequest(this.environment).REQUEST;
    }
    //upload base url
    getUploadBaseUrl() {
        return this.constructor.getRequest(this.environment).UPLOAD;
    }
    //百度地图 key
    getBMapKey() {
        return this.constructor.BMapKey;
    }
    //腾讯地图 key
    getQQMapKey() {
        return this.constructor.QQMapKey;
    }
    //webview url
    getWebviewUrl() {
        return this.constructor.WEBVIEW;
    }
    //静态资源 url
    getAssetsUrl() {
        return this.constructor.ASSETSURL;
    }

}

export default ConfigClass;