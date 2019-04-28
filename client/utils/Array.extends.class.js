/*
 * @Author: denghuaicheng 
 * @Date: 2019-03-11 13:57:33 
 * @Last Modified by: denghuaicheng
 * @Last Modified time: 2019-03-12 10:08:40
 * @Summary: 用于扩充Array的快捷函数 
 */

class ArrayExtends{

    constructor(){

    }

    firstItem(defaultValue){
        return this[0] || defaultValue;
    }

    lastItem(defaultValue){
        return this[this.length - 1] || defaultValue;
    }

};

const arrayExtends= new ArrayExtends();
const arrayExtendsList= {
    firstItem: arrayExtends.__proto__.firstItem,
    lastItem: arrayExtends.__proto__.lastItem
}

Object.keys(arrayExtendsList).forEach(v=> {
    Array.prototype[v] = arrayExtends[v];
})

