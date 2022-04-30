/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiVisibleControl from './RuiVisibleControl.js';
import RuiEmbeddedContainer from './RuiEmbeddedContainer.js';
import RuiContainer from './RuiContainer.js';
import RuiLabel from './RuiLabel.js';
export {RuiTabControl};

rui.registerClass(RuiTabControl);

export default function RuiTabControl(wOParent, name, wOptions = {}, designTime = false) {
  var self = this;
  // add to class list
  rui.lib.addBaseTree(this, RuiTabControl);

  // call base class constructor
  RuiVisibleControl.call(this, wOParent, name, wOptions, designTime);
  
  // html root node as local variable
  let html = this.html;
  // create container for the label row
  let labels = new RuiEmbeddedContainer(this, "labels");
  // create container for the tabs
  let tabs = new RuiEmbeddedContainer(this, "tabs");
  
  // append both containers to the root node
  html.appendChild(labels.html);
  html.appendChild(tabs.html);

  // add CSS class to html root element
  html.classList.add("RuiTabControl");
  
  // set the class for both containers
  labels.html.classList.add("RuiLabels");
  tabs.html.classList.add("RuiTabs");

  // tabPosition stores the position of the tabs
  let tabPosition = "top";
  
  // lastLabel is the last active label
  let lastLabel = null;
  // lastLabel is the last active container
  let lastContainer = null;
  
  function setTabPosition(val){
    if(val != "top" && val != "bottom" && val != "left" && val != "right") 
        return;
    tabPosition = val;
    switch(val){
      case "top":
        html.prepend(labels);
        break;
      case "bottom":
        html.append(labels);
        break;
      case "left":
      case "right":
        console.warn("RuiTabControl.tabPosition=" + val + 
          " is currently not implemented");
        break;
    }
  }
  
  function clearTabs(){
    labels.destroy();
    labels = new RuiEmbeddedContainer(this, "labels");
    tabs.destroy();
    tabs = new RuiEmbeddedContainer(this, "tabs");
    labels.html.classList.add("RuiLabels");
    if(designTime) labels.classList.add("RuiIdeInLayoutWindow");
    tabs.html.classList.add("RuiTabs");
    if(designTime) tabs.classList.add("RuiIdeInLayoutWindow");
    html.appendChild(labels.html);
    html.appendChild(tabs.html);
  }
  
  function removeTab(tabName){
    if (tabName instanceof Array) {
      for (let i = 0; i < tabName.length; i++)
        this.removeTab(tabName[i]);
      return;
    }
    if(typeof tabs[tabName] == "object"){
      tabs[tabName].destroy();
      delete tabs[tabName];
      delete self[tabName];
    }
    if(typeof labels["labelOf_" + tabName] == "object"){
      labels["labelOf_" + tabName].destroy();
      delete labels["labelOf_" + tabName];
      delete self["labelOf_" + tabName];
    }
  }
  
  function addTab(tab){
    if (tab instanceof Array) {
      for (let i = 0; i < tab.length; i++)
        this.addTab(tab[i]);
      return;
    }
    if (typeof tab == "object") {
      let name = (typeof tab.name == "string") ? 
          tab.name : "tab" + tabs.children.length;
      let label = new RuiLabel(labels, "labelOf_" + name, {
        caption: rui.xlat.getTranslated(tab.caption)
      });
      if(typeof tab.this != "object") tab.this = {};
      tab.this.isEmbedded = true;
      let container = new RuiContainer(tabs, name, tab.this, 
          designTime);
      container.html.setAttribute("data-caption", rui.xlat.getTranslated(tab.caption));
      label.html.classList.add("RuiTabLabel");
      container.html.classList.add("RuiTabContainer");
      function changeTab(event = false) {
        for (let tab in tabs.children) {
          tabs.children[tab].html.classList.remove("active");
        }
        for (let lbl in labels.children) {
          labels.children[lbl].html.classList.remove("active");
        }
        container.html.classList.add("active");
        label.html.classList.add("active");
        if(self.onTabChange != rui.emptyEvent)
            self.onTabChange();
        lastLabel = label;
        lastContainer = container;
      }
      label.html.addEventListener("click", changeTab);
      changeTab();
    }      
  }
  
  function setActiveTab(tabName){
    if(typeof labels["labelOf_" + tabName] == "object"){
      labels["labelOf_" + tabName].html.click();
    }
  }
  
  // set the object public object properties 
  let props = {
    activeTabIdx: rui.createVariable({
      get: function() {
        let active = labels.html.querySelector("div.active");
        if(active != null)
          return [...active.parentNode.children].indexOf(active);
        return null;
      }, 
      set: function(val) {
        let lbl = labels.html.querySelectorAll("div")[val];
        if(lbl) lbl.click();
      }, 
    }),
    //activeTab: rui.createReadOnly( () => lastContainer),
    activeTab: rui.createVariable({
      get: function() {
        let activeNode = labels.html.querySelector("div.active");
        var index = 0;
        if(activeNode)
          index = [...activeNode.parentNode.children].indexOf(activeNode);
        return index;
      }, 
      set: val => setActiveTab(val), 
    }),    
    tabs: rui.createConstant(tabs),
    labels: rui.createConstant(labels),
    tabPosition: rui.createVariable({
      get: () => tabPosition, 
      set: setTabPosition,
    }),
    clear: rui.createMethod(clearTabs),
    addTab: rui.createMethod(addTab),
    removeTab: rui.createMethod(removeTab),
    setActiveTab: rui.createMethod(setActiveTab),
    onTabChange: rui.createEvent.call(this, "onTabChange"),
  };

  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiTabControl = props;
  // and join them to the all object
  Object.assign(this.props.all, props);

  this.getLayout.push(
      function getLayout(obj = {}) {
        let addTab = [];
        Object.keys(tabs.children).forEach( (name) => {
          let o = {}
          tabs.children[name].getLayout(o);
          delete o.type;
          obj[name] = o;
          addTab.push({
            caption: tabs.children[name].html.getAttribute("data-caption"),
            name: name,
          });
        });
        if(typeof obj.this != "object") obj.this = {};
        obj.this.addTab = [addTab];
        return obj;
      }
    );      

  // if in preview mode create a preview for the timer
  if(wOptions.preview){
    wOptions = {
      top: 0,
      left: 0,
      height: 128,
      width: 128,
      css: {
        "transform-origin": "0 0",
        transform: "scale(0.6, 0.6)",
        "text-align": "left"
      },
      addTab:[
        [
          {
            caption: "Tab",
            name: "projectTree"
          },
          {
            caption: "Control",
            name: "properties"
          }
        ]
      ]        
    };
  }
  
  // apply options given in wOptions
  rui.lib.applyOwnOptions(this, wOptions);
}
