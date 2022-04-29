/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiContainer from './RuiContainer.js';
import RuiOptionRadio from './RuiOptionRadio.js';
export {RuiOptionGroup};

rui.registerClass(RuiOptionGroup);

export default function RuiOptionGroup(wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiOptionGroup);
  RuiContainer.call(this, wOParent, name, wOptions, designTime);

  this.html.classList.add("RuiOptionGroup");

  // set the object public object properties 
  let props = {
    value: rui.createVariable({
      get: function() {
        let checkedInput = document.querySelector('input[name *= "' + this.path + '"]:checked');
        return (checkedInput !== null) ? checkedInput.value: "";
      },
      set: function(val) {
        let input = document.querySelector('input[name *= "' + this.path + '"][value="' + val + '"]');
        if(input != null) input.checked = true;
      }, 
    }),
  };

  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiOptionGroup = props;
  // and join them to the all object
  Object.assign(this.props.all, props);    
  
  if(wOptions.preview){
    rui.lib.applyOwnOptions(this, {
      height: 60,
      width: 60,
      top: 0,
      left: 0,
      css: {
        "transform-origin": "0 0",
        transform: "scale(0.5, 0.5)",
        border: "2px solid darkgray"
      },
    });
    new RuiOptionRadio(this, "opt1", {
      "left": 5,
      "top": 5,
      "caption": "Opt1"
    });
    new RuiOptionRadio(this, "opt2", {
      "left": 5,
      "top": 30,
      "caption": "Opt2"
    });
  }else{
    rui.lib.applyOwnOptions(this, wOptions);
  }
}
