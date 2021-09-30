/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiVisibleControl from './RuiVisibleControl.js';
export {RuiTextArea};

rui.registerClass(RuiTextArea);

export default function RuiTextArea(wOParent, name, wOptions = {}, designTime = false) {
  
  // add to class list
  rui.lib.addBaseTree(this, RuiTextArea);
  
  // change html root node to input
  wOptions.nodeName = "textarea";

  // call base class constructor
  RuiVisibleControl.call(this, wOParent, name, wOptions, designTime);

  // html root node as local variable
  let html = this.html;
  
  // add CSS class to html root node
  html.classList.add("RuiTextArea");

  // set the object public object properties 
  let props = {
    text: rui.createVariable({
      get: () => html.value,
      set: val => html.value = html.innerHTML = val, 
    }),
    type: rui.createVariable({
      get: () => html.getAttribute("type"),
      set: val => html.setAttribute("type", val), 
    }),
    cols: rui.createAttributeProperty("cols", html),
    rows: rui.createAttributeProperty("rows", html),
    spellCheck: rui.createAttributeProperty("spellcheck", html),
  };

  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiTextArea = props;
  // and join them to the all object
  Object.assign(this.props.all, props);    

  // if in preview mode create a preview 
  if(wOptions.preview){
    wOptions = {
      top: 0,
      left: 0,
      height: 25,
      width: 60,
      css: {
        "transform-origin": "0 0",
        transform: "scale(0.5, 0.5) translateY(16px)"
      },
      text: "Text"
    };
  }

  // apply options given in wOptions
  rui.lib.applyOwnOptions(this, wOptions);
}
