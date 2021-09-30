/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiVisibleControl from './RuiVisibleControl.js';
export {RuiLabel};

rui.registerClass(RuiLabel);
  
export default function RuiLabel(wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiLabel);
  RuiVisibleControl.call(this, wOParent, name, wOptions, designTime);
  let html = this.html;
  html.classList.add("RuiLabel");
  let mode = 'text';

  // set the object public object properties 
  let props = {
    caption: rui.createVariable({
      get: () => 
        mode == 'html' ? html.innerHTML : html.getAttribute("data-caption")
      ,
      set: val => {
        if(mode == 'html')
          html.innerHTML = rui.xlat.getTranslated(val);
        else
          html.setAttribute("data-caption", rui.xlat.getTranslated(val));
      }, 
    }),
    mode: rui.createVariable({
      get: () => mode,
      set: val => {
        mode = val;
        if(mode != 'html') mode = 'text';
      }
    }), 
  };

  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiLabel = props;
  // and join them to the all object
  Object.assign(this.props.all, props);

  if(wOptions.preview){
    rui.lib.applyOwnOptions(this, {
      top: 0,
      left: 0,
      height: 32,
      width: 32,
      css: {
        "transform-origin": "0 0",
        transform: "scale(0.8, 0.8) translateY(7px)"
      },
      caption: "Label"
    });
  }else{
    rui.lib.applyOwnOptions(this, wOptions);
  }
}
