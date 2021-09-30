/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiButton from './RuiButton.js';
export {RuiImageButton};

rui.registerClass(RuiImageButton);
  
export default function RuiImageButton(wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiImageButton);
  wOptions.nodeName = "button";
  RuiButton.call(this, wOParent, name, wOptions, designTime);
  let html = this.html, imagePosition = 0;
  let label = this.label;
  let image = document.createElement("IMG");
  let imageCont = document.createElement("SPAN");
  imageCont.style.display = "block";
  imageCont.appendChild(image);
  html.appendChild(imageCont);
  html.appendChild(label);
  
  html.classList.add("RuiImageButton");

  function setImagePosition(val){
    if (val == "left") {
      //imageCont.style["width"] = this.imageWidth;
      html.appendChild(image);
      html.appendChild(label);
      label.style.display = "inline-block";
    } else if (val == "top") {
      imageCont.appendChild(image);
      html.appendChild(label);
      label.style.display = "block";
    } else if (val == "right") {
      html.appendChild(label);
      html.appendChild(image);
      label.style.display = "inline-block";
    } else if (val == "bottom") {
      imageCont.appendChild(image);
      html.appendChild(imageCont);
      label.style.display = "block";
    } else
      return imagePosition;

    imagePosition = val;
    return imagePosition;      
  }
  
  let props = {
    image: rui.createConstant(image),      
    imagePosition: rui.createVariable({
      get: () => imagePosition,
      set: val => setImagePosition(val),
    }),
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
  this.props.RuiImageButton = props;
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
