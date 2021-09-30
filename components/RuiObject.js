/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
export {RuiObject};

rui.registerClass(RuiObject);

export default function RuiObject(wOParent, name, wOptions = {}, designTime = false) {
  let self = this;
  rui.lib.addBaseTree(this, RuiObject);
  let isEmbedded = wOptions["isEmbedded"] || false;
  delete wOptions["isEmbedded"];
  let base = this._base;
  if (base[0] === RuiObject)
    throw new TypeError("Cannot construct virtual class RuiObject");
  if(wOParent !== window){
    if(name != undefined && !wOParent.hasOwnProperty(name))
      wOParent[name] = this;
    else
      if(name != undefined)
        console.warn('Name ambiguous "' + name + '" in "' + wOParent.path + '"');
    /*if (wOParent._base.includes(RuiEmbeddedContainer)) {
    } else if (wOParent._base[0] !== RuiEmbeddedContainer) {
      wOParent[name] = this;
    }*/
  }else{
    if(!wOParent.hasOwnProperty(name))
      wOParent[name] = this;
    else
      console.warn('Name ambiguous "' + name + '" in window');
  }
  let html;
  if (typeof wOptions == "object" && typeof wOptions.nodeName == "string") {
      if (typeof wOptions.nodeNamespace == "string") {
        html = document.createElementNS(wOptions.nodeNamespace, wOptions.nodeName);
        delete wOptions.nodeNamespace;        
      }else{
        html = document.createElement(wOptions.nodeName);
      }
      delete wOptions.nodeName;        
  } else {
    html = document.createElement("DIV");
  }
  html.ruiRepresentation = this;
  
  let path;
  function refreshPathAndName(){
    path = (wOParent == window ? "": wOParent.path);
    if(typeof wOptions.skipMeInPath == "undefined" || !wOptions.skipMeInPath){
      if (isNaN(name))
        path += "." + name;
      else
        path += "[" + name + "]";
      if (path[0] == ".") path = path.slice(1);
    }
    if(self.html){
      self.html.setAttribute("data-path", path);
      self.html.setAttribute("data-name", name);
    }
  }
  refreshPathAndName();
  
  let getLayout = rui.lib.bubble(
    function(obj = {}) {
      obj.type = base[0].name;
      Object.keys(this.props.all).forEach((name) => {
        let desc = this.props.all[name];
        let org = this[name];
        switch(desc.category){
          case "method":
            // methods are not called from JSON --> not stored
            break;
          case "const":
            // const represent internal states or refernces --> not stored
            break;
          case "variable":
            // this must be stored, if differs from default
            if(org != desc.default && name != "name" && name != "isAppended"){
              if(typeof obj.this != "object") obj.this = {}
              obj.this[name] = org;
            }
            break;
          case "style":
            // are typically an empty string
            if(org != desc.default && !(name == "position" && org == "absolute")){
              if(typeof obj.this != "object") obj.this = {}
              let match = org.match(/([0-9]+)px/);
              if(match)
                obj.this[name] = match[1] * 1;
              else
                obj.this[name] = org;
            }
            break;
          case "event":
            // try to store reference, if possible (only if globally available)
            if(typeof org == "function" && typeof org.name == "string"
                && typeof window[org.name] == "function"){
              if(typeof obj.this != "object") obj.this = {}
              obj.this[name] = "!" + org.name;
            }else if(typeof org == "function"){
              if(typeof this._references[name] == "string"){
                if(typeof obj.this != "object") obj.this = {}
                obj.this[name] = this._references[name];
              }
            }
            break;
          default:
            if(typeof obj.this != "object") obj.this = {}
            obj.this[name] = "?unhandled";
            break;
        }
      });
      return obj;
    }, true);
    
  let destroy =  rui.lib.bubble(
    function() {
      try{
        delete this.parent[this.name];
        delete this.parent.children[this.name];
        if(typeof aliasIn == "object")
          delete aliasIn[this.name];
      }catch(e){}
    });
    
  let appendNow = rui.lib.bubble( () => appended = true);

  function rename(newName){
    name = newName;
    wOParent._deleteChildReference(self);
    wOParent.add(self, newName);
    wOParent[newName] = self;
    refreshPathAndName();
  }  

  let aliasIn = undefined, aliasName = name;
  function setAliasIn(val){
    if(typeof aliasIn == "object")
      delete aliasIn[aliasName];

    if(typeof val == "string")
      aliasIn = rui.lib.getObjectByPath(val);
    else if(typeof val == "object")
      aliasIn = val;
    
    if(typeof aliasIn == "object"){
      aliasIn[aliasName] = this;
    }
  }

  function setAliasName(val){
    if(typeof aliasIn == "object"){
      delete aliasIn[aliasName];
      aliasIn[val] = this;
    }
    aliasName = val;
  }
  
  let events = {}, appended = isEmbedded;
  let references = {}, extra;
  
  if (typeof wOptions[aliasName] == "string"){
    aliasName = wOptions[aliasName];
    delete wOptions[aliasName];
  }
  
  let props = {
    html: rui.createConstant(html),
    path: rui.createVariable({get: () => path}), // will be set as const later
    extra: rui.createVariable({get: () => extra, set: (val) => extra = val}),
    designTime: rui.createConstant(designTime),
    isEmbedded: rui.createConstant(isEmbedded),
    isRoot: rui.createConstant(wOParent === window),
    isAppended: rui.createVariable({get: () => appended}),
    name: rui.createVariable({get: () => name}), // will be set as const later
    _events: rui.createConstant(events, false),
    _references: rui.createConstant(references, false),
    parent: rui.createConstant(wOParent),
    getLayout: rui.createMethod(getLayout),
    destroy: rui.createMethod(destroy),
    appendNow: rui.createMethod(appendNow),
    rename: rui.createMethod(rename),
    isPreview: rui.createConstant(!!wOptions.preview),
    aliasIn: rui.createVariable({get: () => aliasIn, set:setAliasIn}),  
    aliasName: rui.createVariable({get: () => aliasName, set:setAliasName})
  };
  
  // path and name are pseudo const, they can change at designTime
  props.path.category = "const";
  if(designTime){
    props.name.set = function(val){
      rename(val);
    }
  }else{
    props.name.category = "const";
  }
  
  Object.defineProperties(this, props);
  html.setAttribute("data-path", this.path);
  let propsObj = {RuiObject: props, all: Object.assign({}, props)};
  Object.defineProperties(this, {
    props: {
      value: propsObj,
      enumerable: false,
    }
  });
  
  rui.lib.applyOwnOptions(this, wOptions);
}
