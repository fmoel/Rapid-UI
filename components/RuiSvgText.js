/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiSvgControl from './RuiSvgControl.js';
export {RuiSvgText};

rui.registerClass(RuiSvgText);

export default function RuiSvgText(wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiSvgText);
  wOptions.nodeNamespace = "http://www.w3.org/2000/svg";
  wOptions.nodeName = "text";
  RuiSvgControl.call(this, wOParent, name, wOptions, designTime);
  let html = this.html, caption;

  html.classList.add("RuiSvgText");

  let props = {
    x: rui.createAttributeProperty("x", html),
    y: rui.createAttributeProperty("y", html),
    dx: rui.createAttributeProperty("dx", html),
    dy: rui.createAttributeProperty("dy", html),
    textAnchor: rui.createAttributeProperty("text-anchor", html),
    rotate: rui.createAttributeProperty("rotate", html),
    textLength: rui.createAttributeProperty("textLength", html),
    caption: rui.createVariable({
      get: () => html.innerHTML,
      set: (val) => html.innerHTML = val,
    }),
  };
  
  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiSvgText = props;
  // and join them to the all object
  Object.assign(this.props.all, props);   
  
  
  if(wOptions.preview){
    rui.lib.applyOwnOptions(this, {
      top: 0,
      left: 0,
      height: 32,
      width: 60,
      caption: "Rect",
      css: {
        "transform-origin": "0 0",
        transform: "scale(0.5, 0.5) translateY(16px)"
      }
    });
  }else{
    rui.lib.applyOwnOptions(this, wOptions);
  }
}
