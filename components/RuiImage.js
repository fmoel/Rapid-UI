/* Copyright 2022 Frank Moelendoerp */

import rui from './Rui.js';
import RuiVisibleControl from './RuiVisibleControl.js';
export {RuiImage};

rui.registerClass(RuiImage);
  
export default function RuiImage(wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiImage);
  wOptions.nodeName = "div";
  RuiVisibleControl.call(this, wOParent, name, wOptions, designTime);
  let html = this.html;
  let image = document.createElement("IMG");
  
  html.classList.add("RuiImage");
  html.appendChild(image);

  let props = {
    image: rui.createConstant(image),      
    imageUrl: rui.createVariable({
      get: () => image.getAttribute("src"),
      set: val => image.setAttribute("src", val),
    }),
    imageWidth: rui.createVariable({
      get: () => image.getAttribute("width"),
      set: val => image.setAttribute("width", val),
    }),
    imageHeight: rui.createVariable({
      get: () => image.getAttribute("height"),
      set: val => image.setAttribute("height", val),
    }),
  };

  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiImage = props;
  // and join them to the all object
  Object.assign(this.props.all, props);
  
  this.imageHeight = 16;
  this.imageWidth = 16;
  this.imagePosition = "left";

  if(wOptions.preview){
    rui.lib.applyOwnOptions(this, {
      caption: "Btn",
      imageUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAYUlEQVQoU42Qyw3AMAhDzV5dhelYpXtR4UBFkPrhksg8bIQAcPwoSTBemJmrKv+jnKCZUZ9QDKaOzXG6AOxHLccmdLZ2JzPBrZkG1DpYzh1mbAcr8nFwNfx4v6Scd/TnyS/QwiUBsrscjAAAAABJRU5ErkJggg=="
    });
  }else{
    rui.lib.applyOwnOptions(this, wOptions);
  }
}
