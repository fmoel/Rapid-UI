/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiVisibleControl from './RuiVisibleControl.js';
import RuiContainer from './RuiContainer.js';
import RuiEmbeddedContainer from './RuiEmbeddedContainer.js';
export {RuiRibbon};

rui.registerClass(RuiRibbon);

export default function RuiRibbon(wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiRibbon);
  RuiVisibleControl.call(this, wOParent, name, wOptions, designTime);
  let html = this.html;

  let labelTable = document.createElement("table");
  let labelTBody = document.createElement("tbody");
  let labels = document.createElement("tr");
  let labelFill = document.createElement("td");
  labelTable.appendChild(labelTBody);
  labelTBody.appendChild(labels);
  labels.appendChild(labelFill);
  html.appendChild(labelTable);

  let tabs = new RuiEmbeddedContainer(this, "tabs", {}, designTime);
  html.appendChild(tabs.html);
  labels.classList.add("RuiRibbonLabels");
  tabs.html.classList.add("RuiRibbonTabs");
  if(designTime) labels.classList.add("RuiIdeInLayoutWindow");
  let labelList = [];
  let containerList = {};
  let backstagePages = [];

  html.classList.add("RuiRibbon");

  function addTab(tab) {
    if (tab instanceof Array) {
      for (let i = 0; i < tab.length; i++)
        this.addTab(tab[i]);
      return;
    }
    if (typeof tab == "object") {
      let name = (typeof tab.name == "string") ? tab.name: "tab" + tabs.children.length;
      let label = document.createElement("td");
      labelList.push(label);
      //label.setAttribute("data-index", labels.childNodes.length - 1);
      labels.insertBefore(label, labels.lastElementChild);
      label.style.whiteSpace = "nowrap";
      label.innerHTML = rui.xlat.getTranslated(tab.caption);
      let container, backstageObject;
      if(typeof tab.backstagePath == 'string')
        backstageObject = rui.lib.getObjectByPath(tab.backstagePath); 
      if(typeof tab.this != 'object') tab.this = {};
      if(tab.isBackstage === true && typeof backstageObject == 'object'){
        container = new RuiContainer(backstageObject, name, tab.this, designTime);
        backstagePages.push(container);
      }else{
        container = new RuiContainer(tabs, name, tab.this, designTime);
      }
      container.html.setAttribute("data-caption", rui.xlat.getTranslated(tab.caption));
      containerList[tab.name] = container;

      var captionProp = {
        caption: rui.createVariable({
          get: () => label.innerHTML,
          set: val => label.innerHTML = val,
        }),
      };
      Object.defineProperties(container, captionProp);

      this[tab.name] = container;
      label.classList.add("RuiRibbonLabel");
      if(designTime) label.classList.add("RuiIdeInLayoutWindow");
      container.html.classList.add("RuiRibbonContainer");
      //container.html.textContent = tab.caption;
      function changeTab() {
        for (let i = 0; i < backstagePages.length; i++) {
          backstagePages[i].html.classList.remove("active");
        }
        for (let tab in tabs.children) {
          tabs.children[tab].html.classList.remove("active");
        }
        for (let i = 0; i < labels.childNodes.length; i++) {
          labels.childNodes[i].classList.remove("active");
        }
        container.html.classList.add("active");
        label.classList.add("active");
      }
      label.addEventListener("click", changeTab);
      if (labels.childNodes.length == 2) changeTab();
    }
  }
  
  let props = {
    tabs: rui.createConstant(containerList),
    labels: rui.createConstant(labelList),
    activeTab: rui.createVariable({
      get: function() {
        let active = labels.querySelector("td.active");
        return (active && active.cellIndex) ? active.cellIndex : 0;
      }, 
      set: val => labels.querySelectorAll("td")[val].click(), 
    }),
    addTab: rui.createMethod(addTab),
  };

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
  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiRibbon = props;
  // and join them to the all object
  Object.assign(this.props.all, props);    

  rui.lib.applyOwnOptions(this, wOptions);
}
