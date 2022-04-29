/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiContainer from './RuiContainer.js';
export {RuiDialog};

rui.registerClass(RuiDialog);

export default function RuiDialog(wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiDialog);
  
  let container = wOptions.container = document.createElement("div");
  RuiContainer.call(this, wOParent, name, wOptions, designTime);
  let self = this;
  let html = this.html;
  html.classList.add("RuiDialog");
  html.appendChild(container);
  let titleBar = document.createElement("div");
  let caption = document.createElement("span");
  let icon = document.createElement("div");
  let minBtn = document.createElement("div");
  let maxBtn = document.createElement("div");
  let closeBtn = document.createElement("div");
  let enabled = true;

  titleBar.appendChild(icon);
  titleBar.appendChild(caption);
  titleBar.appendChild(minBtn);
  titleBar.appendChild(maxBtn);
  titleBar.appendChild(closeBtn);
  html.appendChild(titleBar);

  titleBar.classList.add("RuiTitleBar");
  icon.classList.add("RuiTitleIcon");
  caption.classList.add("RuiTitleCaption");
  minBtn.classList.add("RuiTitleMinBtn");
  maxBtn.classList.add("RuiTitleMaxBtn");
  closeBtn.classList.add("RuiTitleCloseBtn");
  container.classList.add("RuiDialogContainer");

  if(designTime){
    titleBar.classList.add("RuiIdeInLayoutWindow");
    icon.classList.add("RuiIdeInLayoutWindow");
    caption.classList.add("RuiIdeInLayoutWindow");
    maxBtn.classList.add("RuiIdeInLayoutWindow");
    minBtn.classList.add("RuiIdeInLayoutWindow");
    closeBtn.classList.add("RuiIdeInLayoutWindow");
    container.classList.add("RuiIdeInLayoutWindow");
  }

  caption.innerHTML = "Dialog Title";
  closeBtn.innerHTML = "&#x2716;";
  icon.innerHTML = "&#x2728;";
  maxBtn.innerHTML = "&#x26F6;";
  minBtn.innerHTML = "&#x1F5D5;";

  let windowPos = {}, isMaximized = false, isMinimized = false;
  let minimizeOnClose = true;
  let hideOnClose = false;

    html.addEventListener("click", function(e){
      if(!designTime)
        e.stopImmediatePropagation();
      document.body.click.call(this, e);
      if(html.parentNode != null){
        let all = html.parentNode.querySelectorAll(".RuiDialog.RuiActive");
        for(let i = 0; i < all.length; i++){
          all[i].classList.remove("RuiActive");
        }
        html.classList.add("RuiActive");
      }
    });

  function maximize() {
    if (!isMaximized) {
      if (!isMinimized) windowPos = {
        left: self.left, top: self.top, right: self.right, bottom: self.bottom, width: self.width, height: self.height
      };
        rui.lib.applyOwnOptions(self, {
        left: -1, top: -1, right: 1, bottom: 1, height: "100%", width: "100%"
      });
    } else {
      rui.lib.applyOwnOptions(self, windowPos);
    }
    isMaximized = !isMaximized;
    isMinimized = false;
  }
  
  function minimize() {
    if (!isMinimized) {
      if (!isMaximized) windowPos = {
        left: self.left, top: self.top, right: self.right, bottom: self.bottom, width: self.width, height: self.height
      };
      rui.lib.applyOwnOptions(self, {
        left: 0, top: "", right: "", bottom: 0, height: 21, width: 200
      });
    } else {
      rui.lib.applyOwnOptions(self, windowPos);
    }
    isMinimized = !isMinimized;
    isMaximized = false;
  }    
  
  function close() {
    if (minimizeOnClose)
      minBtn.click();
    else if (hideOnClose)
      self.hide();
    else
      self.destroy();
  };
    
  if(!designTime){
    maxBtn.addEventListener("click", maximize);
    minBtn.addEventListener("click", minimize);

    closeBtn.addEventListener("click", close);
  }

  function show() {
    html.style.display = "block";
    if(html.parentNode != null){
      let all = html.parentNode.querySelectorAll(".RuiDialog.RuiActive");
      for(let i = 0; i < all.length; i++){
        all[i].classList.remove("RuiActive");
      }
      html.classList.add("RuiActive");
    }
  }

  function hide(){
    html.style.display = "none";      
  }
  
  function setEnabled(val){
    if(val){
      container.style["user-select"] = "";
      container.style["pointer-events"] = "";
      container.style["opacity"] = 1;
    }else{
      container.style["user-select"] = "none";
      container.style["pointer-events"] = "none";
      container.style["opacity"] = 0.4;
    }
  }
  
  let props = {
    show: rui.createMethod(show),
    maximize: rui.createMethod(maximize),
    minimize: rui.createMethod(minimize),
    close: rui.createMethod(close),
    hasMaximizeButton: rui.createVariable({
      get: () => maxBtn.style.display != "none",
      set: val => maxBtn.style.display = val ? "block" : "none",
    }),
    hasMinimizeButton: rui.createVariable({
      get: () => minBtn.style.display != "none",
      set: val => minBtn.style.display = val ? "block" : "none",
    }),
    hasCloseButton: rui.createVariable({
      get: () => closeBtn.style.display != "none",
      set: val => closeBtn.style.display = val ? "block" : "none",
    }),
    hide: rui.createMethod(hide),
    minimizeOnClose: rui.createVariable({
      get: () => minimizeOnClose,
      set: val => minimizeOnClose = val,
    }),
    hideOnClose: rui.createVariable({
      get: () => hideOnClose,
      set: val => hideOnClose = val,
    }),
    caption: rui.createVariable({
      get: () => caption.innerText,
      set: val => caption.innerText = rui.xlat.getTranslated(val),
    }),
    enabled: rui.createVariable({
      get: () => enabled,
      set: setEnabled,
    }),
  }

  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiDialog = props;
  // and join them to the all object
  Object.assign(this.props.all, props);    

  rui.moveable.addMoveable(titleBar, html);
  if(!designTime)
    rui.resizeable.makeResizable(this);
  if(wOptions.preview){
    rui.lib.applyOwnOptions(this, {
      height: 120,
      width: 120,
      top: 0,
      left: 0,
      css: {
        "transform-origin": "0 0",
        transform: "scale(0.25, 0.25)"
      },
      caption: "Dialog"
    });
  }else{
    rui.lib.applyOwnOptions(this, wOptions);
  }
}
