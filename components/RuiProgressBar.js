/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiVisibleControl from './RuiVisibleControl.js';
export {RuiProgressBar};

rui.registerClass(RuiProgressBar);

export default function RuiProgressBar(wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiProgressBar);
  RuiVisibleControl.call(this, wOParent, name, wOptions, designTime);
  let html = this.html;
  let progress = document.createElement("div");
  let progress2 = document.createElement("div");
  html.classList.add("RuiProgressBar");
  html.appendChild(progress);
  progress.appendChild(progress2);
  let value = 50;
  progress.classList.add('RuiAnimated');

  let props = {
    animated: rui.createVariable({
      get: () => progress.classList.contains('RuiAnimated'),
      set: function(val) {
        val = typeof val == 'string' ? val.toLowerCase() == 'true': !!val;
        if(val)
          progress.classList.add('RuiAnimated');
        else
          progress.classList.remove('RuiAnimated');
      },        
    }),
    stopped: rui.createVariable({
      get: () => progress.classList.contains('RuiStopped'),
      set: function(val) {
        val = (typeof val == 'string') ? val.toLowerCase() == 'true': !!val;
        if(val)
          progress.classList.add('RuiStopped');
        else
          progress.classList.remove('RuiStopped');
      },        
    }),
    value: rui.createVariable({
      get: () => value,
      set: function(val) {
        value = parseFloat(val); 
        progress.style.width = value + "%";//((this.getWidth - 4) * value / 100) + "px";
        html.setAttribute("data-value", value + " %");
      },        
    }),
  };
  
  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiProgressBar = props;
  // and join them to the all object
  Object.assign(this.props.all, props);

  this.value = value;

  if(wOptions.preview){
    rui.lib.applyOwnOptions(this, {
      height: 25,
      width: 60,
      top: 8,
      left: 0,
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
