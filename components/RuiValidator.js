/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiInvisibleControl from './RuiInvisibleControl.js';
export {RuiValidator};

rui.registerClass(RuiValidator);

export default function RuiValidator(wOParent, name, wOptions = {}, designTime = false) {

  // add to class list
  rui.lib.addBaseTree(this, RuiValidator);

  // call base class
  RuiInvisibleControl.call(this, wOParent, name, wOptions, designTime);

  let validateRules = {}
  let eMailRegex = new RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
  
  function validateCallback(e){
    let path = this.path;
    if(typeof validateRules == "object" && 
        typeof validateRules[path] == "object"){
      let valid = true;
      if(typeof validateRules[path][e.name] == "object"){
        let rule = validateRules[path][e.name];
        let value = this[rule.property];
        let valid = true;
        for(let key in rule){
          let ruleValue = rule[key];
          switch(key){
            case "int": 
              valid = (Number.isInteger(value * 1) == ruleValue);
              break;
            case "float": 
              valid = (Number.isFinite(value * 1) == ruleValue);
              break;1
            case "below": 
              valid = (value < ruleValue);
              break;
            case "above": 
              valid = (value > ruleValue);
              break;
            case "belowEqual": 
              valid = (value <= ruleValue);
              break;
            case "aboveEqaul": 
              valid = (value >= ruleValue);
              break;
            case "string": 
              valid = ((typeof value == "string") == ruleValue);
              break;
            case "email": 
              valid = (((value + "").match(eMailRegex) != null) == ruleValue);
              break;
          }
          if(!valid) break;
        }
        if(valid && typeof validateRules[path].valid == "object"){
          rui.lib.applyOwnOptions(this, validateRules[path].valid, true)
        }else if(!valid && typeof validateRules[path].invalid == "object"){
          rui.lib.applyOwnOptions(this, validateRules[path].invalid, true)
        }
      }
    }
  }
  
  function registerValidation(){
    if(typeof validateRules == "object"){
      for(let path in validateRules){
        let obj = rui.lib.getObjectByPath(path);
        if(typeof obj == "object"){
          for(let ruleType in validateRules[path]){
            if(ruleType == "valid" || ruleType == "invalid") continue;
            obj[ruleType] = validateCallback;
          }
        }
      }
    }      
  }

  function unregisterValidation(){
    if(typeof validateRules == "object"){
      for(let path in validateRules){
        let obj = rui.lib.getObjectByPath(path)
        if(typeof obj == "object"){
          for(let ruleType in validateRules[path]){
            if(ruleType == "valid" || ruleType == "invalid") continue;
            delete obj[ruleType][validateCallback];
          }
        }
      }
    }      
  }

  // define object properties
  let props = {
    validateRules: rui.createVariable({
      get: () => validateRules,
      set: val=> validateRules = val, 
    }),
    registerValidation: rui.createMethod(registerValidation),
    unregisterValidation: rui.createMethod(unregisterValidation),
  };
  
  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiTimer = props;
  // and join them to the all object
  Object.assign(this.props.all, props);    
  
  // this function changes the this context to the timer
  
  // add to the destructor chain ...
  this.destroy.push(
    function destroy() {
      // stop this timer
      unregisterValidation();
    }
  );
  
  // if in preview mode create a preview for the timer
  if(wOptions.preview){
    wOptions =  {
      top: 0,
      left: 0,
      height: "29px",
      width: "29px",
      designTime: true
    };
  }
  if (designTime || (typeof wOptions == "object" && wOptions.designTime === true)) {
    let html = this.html;
    html.innerHTML = "&check;";
  }
  
  // apply options given in wOptions
  rui.lib.applyOwnOptions(this, wOptions);
}
