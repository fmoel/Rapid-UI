/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiContainer from './RuiContainer.js';
export {RuiSvg};

rui.registerClass(RuiSvg);

export default function RuiSvg (wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiSvg);
  let self = this;
  let container = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  wOptions.container = container;
      
  RuiContainer.call(this, wOParent, name, wOptions, designTime);
  let html = this.html;
  
  html.append(container);

  html.classList.add("RuiSvg");

  rui.lib.applyOwnOptions(this, wOptions);
  this.appendNow();
}
