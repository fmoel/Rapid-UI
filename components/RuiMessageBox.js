/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiContainer from './RuiContainer.js';
import RuiButton from './RuiButton.js';
export {RuiMessageBox};

rui.registerClass(RuiMessageBox);

export default function RuiMessageBox(wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiMessageBox);
  
  let container = wOptions.container = document.createElement("div");
  
  RuiContainer.call(this, wOParent, name, wOptions, designTime);
  let self = this;
  let html = this.html;
  html.classList.add("RuiMessageBox");
  html.appendChild(container);
  let titleBar = document.createElement("div");
  let caption = document.createElement("span");
  let icon = document.createElement("div");
  let closeBtn = document.createElement("div");
  let textField = document.createElement("div");
  let iconField = document.createElement("div");

  titleBar.appendChild(icon);
  titleBar.appendChild(caption);
  titleBar.appendChild(closeBtn);
  html.appendChild(titleBar);
  container.appendChild(textField);
  container.appendChild(iconField);

  titleBar.classList.add("RuiTitleBar");
  icon.classList.add("RuiTitleIcon");
  caption.classList.add("RuiTitleCaption");
  closeBtn.classList.add("RuiTitleCloseBtn");
  container.classList.add("RuiMessageBoxContainer");
  textField.classList.add("RuiMessageBoxTextField");
  iconField.classList.add("RuiMessageBoxIcon");

  if(designTime){
    titleBar.classList.add("RuiIdeInLayoutWindow");
    icon.classList.add("RuiIdeInLayoutWindow");
    caption.classList.add("RuiIdeInLayoutWindow");
    closeBtn.classList.add("RuiIdeInLayoutWindow");
    container.classList.add("RuiIdeInLayoutWindow");
  }

  caption.innerHTML = "MessageBox Title";
  closeBtn.innerHTML = "&#x2716;";
  icon.innerHTML = "&#x2728;";
  textField.innerHTML = "MessageText";
  iconField.innerHTML = "&#10067;";

  let buttons = [];
  let buttonObjects = [];

  if(!designTime){
    html.addEventListener("click", function(e){
      e.stopImmediatePropagation();
      document.body.click.call(this, e);
      if(html.parentNode != null){
        let all = html.parentNode.querySelectorAll(".RuiMessageBox.RuiActive");
        for(let i = 0; i < all.length; i++){
          all[i].classList.remove("RuiActive");
        }
        html.classList.add("RuiActive");
      }
    });

    closeBtn.addEventListener("click", function() {
      if(resolve != null)
        resolve("closeButton");
    });
  }

  
  let resolve = null;
  async function show() {
    html.style.display = "block";
    let promise = new Promise(resolveInPromise => {
      resolve = resolveInPromise;
      while(buttonObjects.length)
        buttonObjects.pop().destroy();
      
      let used = 10;
      for(let i = 0; i < buttons.length; i++){
        if(typeof buttons[i].value != "string")
          buttons[i].value = buttons[i].caption;  
        let btn = new RuiButton(self, "btn" + buttons[i].value, {
          onClick: function(){
            resolve(this.extra);
          },
          caption: rui.xlat.getTranslated(buttons[i].caption),
          extra: buttons[i].value,
          bottom: 10,
          height: 30,
          right: used,
        });
        btn.appendNow();
        buttonObjects.push(btn);
        used += btn.getWidth + 10;
      }
    });
    return promise;
  }

  function hide(){
    html.style.display = "none";      
  }
  
  function setIcon(val) {
    let str;
    switch(val.toLowerCase()){
    case "exclamationmark": str = "&#10071;"; break;
    case "hourglass": str = "&#8987;"; break;
    case "noentry": str = "&#9940;"; break;
    case "cross": str = "&#10060;"; break;
    case "questionmark": str = "&#10067;"; break;
    case "information": str = "&#127320;"; break;
    default: str = val;
    }
    iconField.innerHTML = str;
  }
  
  function setButtons(val){
    if(!Array.isArray(val))
      throw('RuiMessageBox.buttons needs an Array, ' + (typeof val) +
            'was given');
    
    for(let i = 0; i < val.length; i++){
      if(typeof val[i] != "object" || typeof val[i].caption != "string")
        throw("RuiMessageBox.buttons Array needs objects with 'caption'" +
              " and optional 'value' property");
    }
    buttons = val;
  }
  
  let props = {
    show: rui.createMethod(show),
    hide: rui.createMethod(hide),
    caption: rui.createVariable({
      get: () => caption.innerText,
      set: val => caption.innerText = rui.xlat.getTranslated(val),
    }),
    text: rui.createVariable({
      get: () => textField.innerText,
      set: val => textField.innerText = rui.xlat.getTranslated(val),
    }),
    icon: rui.createVariable({
      get: () => iconField.innerHTML,
      set: setIcon
    }),
    buttons: rui.createVariable({
      get: () => buttons,
      set: setButtons,
    }),
  };

  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiMessageBox = props;
  // and join them to the all object
  Object.assign(this.props.all, props);    

  rui.moveable.addMoveable(titleBar, html);
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
      caption: "MessageBox"
    });
  }else{
    rui.lib.applyOwnOptions(this, wOptions);
  }
}

RuiMessageBox.create = async function(caption, text, buttons, icon){
  buttons = buttons || [{caption: "Ok"}];
  icon = icon || "information";
  let msg = new RuiMessageBox(window, "msg", {
    caption: caption,
    text: text,
    icon: icon,
    buttons: buttons
  });
  msg.appendNow();
  let result = await msg.show(); 
  msg.destroy();
  return result;
}
