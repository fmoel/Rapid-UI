/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiContainer from './RuiContainer.js';
export {RuiRibbonGroup};

rui.registerClass(RuiRibbonGroup);

export default function RuiRibbonGroup (wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiRibbonGroup);
  RuiContainer.call(this, wOParent, name, wOptions, designTime);
  let html = this.html;

  html.classList.add("RuiRibbonGroup");
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
  this.props.RuiRibbonButton = props;
  // and join them to the all object
  Object.assign(this.props.all, props);   
  
  rui.lib.applyOwnOptions(this, wOptions);
}
