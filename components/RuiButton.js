/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiVisibleControl from './RuiVisibleControl.js';
export {RuiButton};

rui.registerClass(RuiButton);

export default function RuiButton(wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiButton);
  wOptions.nodeName = "button";
  RuiVisibleControl.call(this, wOParent, name, wOptions, designTime);
  let html = this.html, caption;
  let label = document.createElement("SPAN");
  html.appendChild(label);

  html.classList.add("RuiButton");
  label.innerText = name;

  // add another shade when clicked
  let clicked = false;
  html.addEventListener("mousedown", function() {
    this.classList.add("clicked"); clicked = true;
  });
  html.addEventListener("mouseup", function() {
    this.classList.remove("clicked"); clicked = false;
  });
  html.addEventListener("mouseleave", function() {
    this.classList.remove("clicked");
  });
  html.addEventListener("mouseenter", function() {
    if (clicked)this.classList.add("clicked");
  });
  
  let props = {
    label: rui.createConstant(label),
    caption: rui.createVariable({
      set: v => caption = label.innerText = rui.xlat.getTranslated(v), 
      get: ()=> caption
    }),
  };

  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiButton = props;
  // and join them to the all object
  Object.assign(this.props.all, props);   
  
  if(wOptions.preview){
    rui.lib.applyOwnOptions(this, {
      top: 0,
      left: 0,
      height: 32,
      width: 60,
      caption: "Button",
      css: {
        "transform-origin": "0 0",
        transform: "scale(0.5, 0.5) translateY(16px)"
      }
    });
  }else{
    rui.lib.applyOwnOptions(this, wOptions);
  }
}
