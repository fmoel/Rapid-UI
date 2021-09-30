/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiVisibleControl from './RuiVisibleControl.js';
export {RuiDropDown};

rui.registerClass(RuiDropDown);

export default function RuiDropDown(wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiDropDown);
  
  wOptions.nodeName = "select";
  RuiVisibleControl.call(this, wOParent, name, wOptions, designTime);
  let html = this.html;
  html.classList.add("RuiDropDown");

  let list = [], htmlList;

  function _setList(aList) {
    list = aList;
    while (html.firstChild) html.removeChild(html.firstChild);
    if(Array.isArray(aList)){
      for (let i = 0; i < list.length; i++) {
        let el = document.createElement("option");
        let li, value, caption;
        if(typeof list[i] == "string"){
          li = list[i].split("|");
          caption = rui.xlat.getTranslated(li[0]);
          if(li.length > 1)
            value = li[1];
          else
            value = li[0];
        }else{
          value = list[i];
          caption = rui.xlat.getTranslated(list[i]);
        }
        el.appendChild(document.createTextNode(caption));
        el.setAttribute("value", value);
        html.appendChild(el);
      }
    }else{
      throw new Error("RuiDropDown.list needs an array as value. '" + (typeof aList) + "' was given.");
    }
  }
  
  let props = {
    size: rui.createVariable({
      get: () => html.getAttribute("size"),
      set: val => html.setAttribute("size", val),
    }),
    text: rui.createVariable({
      get: () => html.getAttribute("value"),
      set: val => html.setAttribute("value", val),
    }),
    value: rui.createVariable({
      get: () => html.value,
      set: val => html.value = val,
    }),
    list: rui.createVariable({
      get: () => list,
      set: val => _setList(val),
    }),
  }

  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiDropDown = props;
  // and join them to the all object
  Object.assign(this.props.all, props);    

  if(wOptions.preview){
    rui.lib.applyOwnOptions(this, {
      top: 0,
      left: 0,
      height: 25,
      width: 64,
      css: {
        "transform-origin": "0 0",
        transform: "scale(0.5, 0.5) translateY(16px)"
      }
    });
  }else{
    rui.lib.applyOwnOptions(this, wOptions);
  }
}
