/* Copyright 2021 Frank Moelendoerp */

import Rui from './Rui.js';

Rui.registerClass(TypedArray);

export default function TypedArray(type, changeCallback, changedCallback){
    let self;
    let length = 0;

    //Rui.assertFunction(type);
    Rui.lib.addBaseTree(this, TypedArray);   
    
    function push(value){
        //Cls.assertClass(value, type);
        //[].push.call(this, value);
        length++;
        self[length - 1] = value;
    }
    
    let props = {
        type: Rui.createConstant(type),
        push: Rui.createMethod(push), 
        toArray: Rui.createMethod(toArray),
        length: Rui.createVariable({
          get: () => length,
          set: (val) => {
            for(var i = length - 1; i > val; i--)
              delete self[i];
            /*for(var i = length - 1; i < val; i++)
              self[i] = undefined;*/
            length = val;
          }
        })
    };

    function toArray(){
        var result = [];
        for(var i = 0; i < self.length; i++){
            result.push(self[i]);
        }
        return result;
    }

    // assign propertis to object
    Object.defineProperties(this, props);
    // also store the descriptor to props-accessor
    let propsObj = {TypedArray: props, all: Object.assign({}, props)};
    Object.defineProperties(this, {
      props: {
        value: propsObj,
        enumerable: false,
      }
    });
    // and join them to the all object
    Object.assign(this.props.all, props); 
    self = new Proxy(this,{
        set(target, prop, val) { // to intercept property writing
            let idx = parseInt(prop);
            if(idx == idx){
                //Cls.assertClass(val, type);
                if(idx >= target.length) target.length = idx + 1;
            }
            var result = true;
            if(typeof changeCallback == "function")
              result = changeCallback.call(target, prop, target[prop], val);
            if(result)
              target[prop] = val;
            else
              console.log("Write to ", target, "[" , prop, "] = '",val, "' was blocked");
            if(typeof changedCallback == "function")
              changedCallback.call(target, target);
            return result;    
        }
    })
    return self;
}

