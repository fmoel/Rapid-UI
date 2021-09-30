/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiSvgControl from './RuiSvgControl.js';
export {RuiSvgCircle};

rui.registerClass(RuiSvgCircle);

export default function RuiSvgCircle(wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiSvgCircle);
  wOptions.nodeNamespace = "http://www.w3.org/2000/svg";
  wOptions.nodeName = "circle";
  RuiSvgControl.call(this, wOParent, name, wOptions, designTime);
  let html = this.html, caption;

  html.classList.add("RuiSvgCircle");
  html.style["position"] = "absolute";

  let props = {
    x: rui.createAttributeProperty("cx", html),
    y: rui.createAttributeProperty("cy", html),
    radius: rui.createAttributeProperty("r", html),
  };
  
  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiSvgCircle = props;
  // and join them to the all object
  Object.assign(this.props.all, props);   

  rui.lib.applyOwnOptions(this, wOptions);  
}
