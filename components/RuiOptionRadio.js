/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiVisibleControl from './RuiVisibleControl.js';
export {RuiOptionRadio};

rui.registerClass(RuiOptionRadio);

export default function RuiOptionRadio(wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiOptionRadio);
  
  wOptions.nodeName = "label";
  RuiVisibleControl.call(this, wOParent, name, wOptions, designTime);
  let html = this.html;
  html.classList.add("RuiTextBox");
  let input = document.createElement("input");
  let label = document.createElement("span");

  html.appendChild(input);
  html.appendChild(label);

  input.setAttribute("name", wOParent.path);
  input.setAttribute("value", name);

  let props = {
    input: rui.createConstant(input),
    label: rui.createConstant(label),
    caption: rui.createVariable({
      get: () => label.innerText,
      set: val => label.innerText = rui.xlat.getTranslated(val),
    }),
    captionPosition: rui.createVariable({
      get: () => html.firstElementChild == label ? "left": "right",
      set: function(val) {
        if (val == "left")
          html.prepend(label);
        else if (val == "right")
          html.appendChild(label);
      }, 
    }),
    checked: rui.createVariable({
      get: () => input.checked,
      set: val => input.checked = val,
    }),
    value: rui.createVariable({
      get: () => input.getAttribute("value"),
      set: val => input.setAttribute("value", val),
    }),
  };
  
  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiOptionRadio = props;
  // and join them to the all object
  Object.assign(this.props.all, props);    

  rui.lib.applyOwnOptions(this, wOptions);
  input.setAttribute("type", "radio");
}
