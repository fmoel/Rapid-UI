/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiObject from './RuiObject.js';
export {RuiInvisibleConrtol};

rui.registerClass(RuiInvisibleConrtol);

export default function RuiInvisibleConrtol(wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiInvisibleConrtol);
  RuiObject.call(this, wOParent, name, wOptions, designTime);
  let self = this;
  let html = this.html;

  let props = RuiInvisibleConrtol.props = {
    left: rui.createStyle(this, "left", true, "resize", html),
    top: rui.createStyle(this, "top", true, "resize", html)
  }

  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiInvisibleConrtol = props;
  // and join them to the all object
  Object.assign(this.props.all, props);
  html.classList.add("RuiInvisibleConrtol");
  html.setAttribute("data-path", (wOParent == window ? "window": wOParent.path) + "." + name);
  rui.moveable.addMoveable(this);
  if (designTime === true || wOptions.designTime) {
    try{
      wOParent.add(self, name);
    }catch(e){
      console.error("could not add " + this.path + " to " + wOParent.path, e);
    }
  }
  this.getLayout.push(
    function getLayout(obj = {}){
      Object.keys(this).forEach((name) =>{
        if(typeof this[name] == "object" &&
            typeof this[name]._base == "object" &&
            Array.isArray(this[name]._base)){
          if(this[name]._base.includes(RuiObject)){
            let layout = {};
            obj[name] = this[name].getLayout(layout);
          }
        }
      });
    }
  );
  
  rui.lib.applyOwnOptions(this, wOptions);
  
  if(wOParent == window){
    document.body.append(html);
    window[name] = this;
  }else
    wOParent.add(this, name, designTime !== true); 
}
