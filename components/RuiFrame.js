/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiContainer from './RuiContainer.js';
export {RuiFrame};

rui.registerClass(RuiFrame);

export default function RuiFrame (wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiFrame);
  RuiContainer.call(this, wOParent, name, wOptions, designTime);
  let html = this.html;

  // set properties of wOptions
  if (wOptions !== undefined && typeof wOptions !== "object") throw new TypeError("RuiObject.constructor(RuiObject wOParent[, object wOptions]) wrong parameter type: wOptions");

  html.classList.add("RuiFrame");
  html.setAttribute("data-caption", name);

  // set the object public object properties 
  let props = {
    caption: rui.createVariable({
      get: () => html.getAttribute("data-caption"),
      set: val => html.setAttribute("data-caption", rui.xlat.getTranslated(val)),
    }),
  };

  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiFrame = props;
  // and join them to the all object
  Object.assign(this.props.all, props);

  if(wOptions.preview){
    rui.lib.applyOwnOptions(this, {
      height: 48,
      width: 50,
      top: -5,
      left: -5,
      css: {
        "transform-origin": "0 0",
        transform: "scale(0.5, 0.5)"
      },
      caption: "Frame"
    });
  }else{
    rui.lib.applyOwnOptions(this, wOptions);
  }
}
