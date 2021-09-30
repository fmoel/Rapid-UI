/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiSvgControl from './RuiSvgControl.js';
export {RuiSvgLine};

rui.registerClass(RuiSvgLine);

export default function RuiSvgLine(wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiSvgLine);
  wOptions.nodeNamespace = "http://www.w3.org/2000/svg";
  wOptions.nodeName = "line";
  RuiSvgControl.call(this, wOParent, name, wOptions, designTime);
  let html = this.html, caption;

  html.classList.add("RuiSvgLine");

  let props = {
    x1: rui.createAttributeProperty("x1", html),
    y1: rui.createAttributeProperty("y1", html),
    x2: rui.createAttributeProperty("x2", html),
    y2: rui.createAttributeProperty("y2", html),
  };
  
  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiSvgLine = props;
  // and join them to the all object
  Object.assign(this.props.all, props);     
  
  if(wOptions.preview){
    rui.lib.applyOwnOptions(this, {
      top: 0,
      left: 0,
      height: 32,
      width: 60,
      caption: "Line",
      css: {
        "transform-origin": "0 0",
        transform: "scale(0.5, 0.5) translateY(16px)"
      }
    });
  }else{
    rui.lib.applyOwnOptions(this, wOptions);
  }
}
