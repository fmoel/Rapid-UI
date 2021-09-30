/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiVisibleControl from './RuiVisibleControl.js';
export {RuiCheckBox};

rui.registerClass(RuiCheckBox);

export default function RuiCheckBox(wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiCheckBox);
  
  wOptions.nodeName = "label";
  RuiVisibleControl.call(this, wOParent, name, wOptions, designTime);
  let html = this.html;
  html.classList.add("RuiTextBox");
  let input = document.createElement("input");
  let label = document.createElement("span");

  html.appendChild(input);
  html.appendChild(label);

  let props = {
    input: rui.createConstant(input),
    label: rui.createConstant(label),
    caption: rui.createVariable({
      set: v => label.innerText = rui.xlat.getTranslated(v),
      get: () => label.innerText
    }),
    captionPosition: rui.createVariable({
      get: () => html.firstElementChild == label ? "left": "right",
      set: val => {
        if(val == "left") 
          html.prepend(label); 
        else 
          html.appendChild(label);
      }
    }),
    value: rui.createVariable({
      get: () => input.checked,
      set: val => input.checked = val
    }),
    indeterminate: rui.createVariable({
      get: () => input.indeterminate,
      set: val => input.indeterminate = val
    })
  };
  
  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiCheckBox = props;
  // and join them to the all object
  Object.assign(this.props.all, props);    

  if(wOptions.preview){
    rui.lib.applyOwnOptions(this, {
      top: 0,
      left: 0,
      caption: "Check",
      value: true,
      css: {
        "transform-origin": "0 0",
        transform: "scale(0.8, 0.8) translateY(3px)"
      }
    });
  }else{
    rui.lib.applyOwnOptions(this, wOptions);
  }
  input.setAttribute("type", "checkbox");
}
