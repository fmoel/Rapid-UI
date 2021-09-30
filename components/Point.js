/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';

rui.registerClass(Point);

export default function Point(x, y, changeCallBack){
  
  let props = {
    x: rui.createVariable({
      get: () => x,
      set: val => {
        x = val; 
        if (typeof changeCallBack == "function")
          changeCallBack();
      }
    }),
    y: rui.createVariable({
      get: () => y,
      set: val => {
        y = val; 
        if (typeof changeCallBack == "function")
          changeCallBack.call(this);
      }
    }),
    changeCallBack: rui.createVariable({
      get: () => changeCallBack,
      set: val => {
        changeCallBack = val; 
      }
    }),    
    toString: rui.createMethod( () => "{x: " + x + ", y: " + y + "}"),
  };
  
  Object.defineProperties(this, props);    
}
