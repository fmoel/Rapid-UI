/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiSvgControl from './RuiSvgControl.js';
export {RuiSvgPath};

rui.registerClass(RuiSvgPath);

export default function RuiSvgPath(wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiSvgPath);
  wOptions.nodeNamespace = "http://www.w3.org/2000/svg";
  wOptions.nodeName = "path";
  RuiSvgControl.call(this, wOParent, name, wOptions, designTime);
  let html = this.html, caption;

  html.classList.add("RuiSvgPath");

  let props = {
    d: rui.createAttributeProperty("d", html),
  };
  
  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiSvgPath = props;
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
