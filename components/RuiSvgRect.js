/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiSvgControl from './RuiSvgControl.js';
export {RuiSvgRect};

rui.registerClass(RuiSvgRect);

export default function RuiSvgRect(wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiSvgRect);
  wOptions.nodeNamespace = "http://www.w3.org/2000/svg";
  wOptions.nodeName = "rect";
  RuiSvgControl.call(this, wOParent, name, wOptions, designTime);
  let html = this.html, caption;

  html.classList.add("RuiSvgRect");

  let props = {
    x: rui.createAttributeProperty("x", html),
    y: rui.createAttributeProperty("y", html),
    width: rui.createAttributeProperty("width", html),
    height: rui.createAttributeProperty("height", html),
    rx: rui.createAttributeProperty("rx", html),
    ry: rui.createAttributeProperty("ry", html),
  };
  
  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiSvgRect = props;
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
