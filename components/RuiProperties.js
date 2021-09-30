/* Copyright 2021 Frank Moelendoerp */

import rui from './Rui.js';
import RuiContainer from './RuiContainer.js';
import RuiObject from './RuiObject.js';
import RuiTable from './RuiTable.js';
import RuiTableRow from './RuiTableRow.js';
import RuiTableCell from './RuiTableCell.js';
export {RuiProperties};

rui.registerClass(RuiProperties);

export default function RuiProperties(wOParent, name, wOptions = {}, designTime = false) {
  rui.lib.addBaseTree(this, RuiProperties);
  
  let preview = wOptions.preview;
  delete wOptions.preview;
  
  RuiContainer.call(this, wOParent, name, wOptions);
  wOptions.preview = preview;
  let self = this;
  let html = this.html;
  
  let table = new RuiTable(this, "table", wOptions);
  let thtml = table.html;
  
  html.classList.add("RuiProperties");
  let currentHelp = "";
  let defaultObject = {}, object = defaultObject;
  let viewObject;
  
  let edit = document.createElement("input");
  let select = document.createElement("select");
  let es = edit.style;
  let ss = select.style;
  ss.position = es.position = "relative";
  ss.boxSizing = es.boxSizing = "border-box";
  ss.display = es.display = "none";
  ss.zIndex = es.zIndex = 900;
  ss.padding = es.padding = "0px";
  ss.border = es.border = "0px";
  html.appendChild(edit);

  function allowOnlyDecimals(inputEvent){
    let t = this.selectionStart;
    this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    this.selectionStart = t;
  }

  function allowOnlyNumbers(inputEvent){
    return this.value.replace(/[^0-9]/g, '');
  }
  
  edit.ondblclick = function(e){e.stopPropagation(); return false;};
  
  function startEdit(){
    this.prepend(edit);
    edit.style.top = 0;
    edit.style.left = 0;
    edit.style.bottom = "calc(100% - 2px)";
    edit.style.width = "calc(100% - 5px)"; 
    var name = edit.property;
    
    if(typeof edit.group.inputLimiter == "function")
      edit.oninput = edit.group.inputLimiter;
    else if(edit.group.type(object, edit.property) == Number)
      edit.oninput = allowOnlyDecimals;
    
    let value = typeof edit.group.readValue == "function" ? edit.group.readValue(object, edit.property) : object[name];
    
    if(typeof value == "undefined"){
      edit.value = edit.group.default ? 
          edit.group.default(object, name) : "undefined";
    }else{
      edit.value = value;
    }
    edit.style.display = "unset";
    edit.select();
    edit.focus();
  }

  function stopEdit(){
    if(edit.style.display == "none") return;
    edit.style.display = "none";
    var name = edit.property;
    let val = edit.value;
    edit.value = "";
    try{
      html.append(edit);
    }catch(e){}
    if(name != "" && typeof name != "undefined"){
      if(name == "name" && object.rename != undefined)
        object.rename(val);
      else
        if(typeof edit.group.readValue == "function")
          edit.group.writeValue(object, name, val)
        else
          object[name] = val;
    }
    if(typeof object.html == "object" && typeof object.html.addResizer == "function")
      object.html.addResizer();
    updateView();
  }

  function editKeyDown(e){
    if (e.keyCode == 13) {
      stopEdit();
      return false;
    }
  }

  edit.addEventListener("blur", stopEdit);
  edit.addEventListener("keydown", editKeyDown);

  function startSelect(){
    this.prepend(select);
    select.style.top = 0;
    select.style.left = 0;
    select.style.bottom = "calc(100% - 2px)";
    select.style.width = "calc(100% - 5px)"; 
    let name = this.getAttribute("data-propName");
    let group = this.getAttribute("data-propGroup");
    
    function createOption(value){
      let el = document.createElement("option");
      el.value = value;
      el.innerHTML = value;
      select.appendChild(el);
    }
    
    select.innerHTML = "";
    if(groups[group].type != undefined){
      if(groups[group].type(object, name) === Boolean){
        ["true", "false"].forEach((el) => {createOption(el)});
      }else if(groups[group].type(object, name) === Array){
        if(Array.isArray(groups[group].list(object, name)))
          groups[group].list(object, name).forEach((el) => createOption(el));
      }  
    }else{
      if(rui.lib.getType(object[name]) === Boolean){
        ["true", "false"].forEach((el) => {createOption(el)});
      }
    }

    if(typeof object[name] == "undefined"){
      select.value = groups[group].default ? 
          groups[group].default(object, name) : "undefined";
    }else{
      select.value = object[name];
    }
    
    /*if(typeof object[name] == "undefined"){
      select.value = ;
    }else{
      select.value = object[name];
    }*/
    select.setAttribute("data-propName", name);
    select.style.display = "unset";
    select.focus();
  }

  function stopSelect(){
    if(select.style.display == "none") return;
    select.style.display = "none";
    let name = select.getAttribute("data-propName");
    select.setAttribute("data-propName", "");
    let val = select.value;
    select.value = "";
    try{
      html.append(select);
    }catch(e){}
    if(name != "" && typeof name != "undefined"){
      object[name] = val;
    }
    if(object.html != undefined && typeof object.html.addResizer == "function")
      object.html.addResizer();
    updateView();
  }
  
  function updateSelect(){
    let val = select.value;
    if(name != "" && typeof name != "undefined"){
      object[name] = val;
    }
    if(typeof object.html.addResizer == "function")
      object.html.addResizer();
  }

  function selectKeyDown(e){
    if (e.keyCode == 13) {
      stopSelect();
      return false;
    }
  }

  select.addEventListener("change", stopSelect);
  select.addEventListener("blur", stopSelect);
  select.addEventListener("keydown", selectKeyDown);

  let defaultGroups = {};
  defaultGroups[rui.xlat.getTranslated('All')] = {
    readonly: function(){return false},
    /*render: function(object, prop, tr){
      
    }*/
  };
  let groups = defaultGroups;

  let showEmtpy = true, showNonEnumerable = false;
  function updateView() {
    if((designTime || wOptions.designTime) && !preview){
      let tr = new RuiTableRow(table);
      tr.appendNow();
      let td = new RuiTableCell(tr);
      td.appendNow();
      return;
    }
    let scrollTop = html.scrollTop;
    //viewObject = {obj: object, methods: [], properties: [], events: []};
    table.visible = false;
    
    // clear table
    table.clear();
    
    // remove all tbody's
    thtml.querySelectorAll("tbody").forEach(body => body.parentNode.removeChild(body));

    // assign each group an view array
    viewObject = {};
    Object.keys(groups).map(group => {
      viewObject[group] = [];
      let body = document.createElement("tbody");
      groups[group].body = body;
      thtml.appendChild(body);
    });
    
    // copy object[props] to group in viewObject
    let keys;
    if (showNonEnumerable) {
      keys = rui.lib.getAllProperties(object);
    } else {
      keys = Object.keys(object);
    }
    keys.map(prop => {
      const descriptor = Object.getOwnPropertyDescriptor(object, prop);
      if (object.hasOwnProperty(prop) && (descriptor.enumerable || showNonEnumerable)) {
        Object.keys(groups).forEach(group => {
          if (!groups[group].filter || 
              groups[group].filter && groups[group].filter(object, prop)){
            viewObject[group].push(prop);
          }
        });
      }
    });

    // add a row per group and one row per property
    Object.keys(viewObject).map(group => {
      let tr = new RuiTableRow(table, undefined);
      tr.appendNow();
      groups[group].body.appendChild(tr.html);
      let td = new RuiTableCell(tr, undefined, {
        caption: group
      });
      td.appendNow();
      td.html.setAttribute("colspan", 2);
      td.onClick = function() {
        tr.html.parentNode.classList.toggle("RuiCollapsed");
      };
      if (groups[group].collapsed) tr.html.parentNode.classList.add("RuiCollapsed");
      viewObject[group].forEach(prop => {
        if (prop != "path" && prop != "isRoot" && prop != "parent") {
          let tr = new RuiTableRow(table, undefined);
          tr.appendNow();
          groups[group].body.appendChild(tr.html);
          let td = new RuiTableCell(tr, undefined, {
            caption: prop
          });
          td.appendNow();
          td = new RuiTableCell(tr, undefined);
          td.appendNow();
          tr[1].html.innerHTML = "&nbsp;";
          if(groups[group].render)
            groups[group].render(object, prop, tr);
          else{
            if(object[prop] != undefined)
              tr[1].caption = object[prop].toString();
            else
              tr[1].caption = "undefined";
          }
          let propType = groups[group].type ? groups[group].type(object, prop) : rui.lib.getType(object[prop]);
          tr[0].html.addEventListener("click", td_click);
          tr[1].html.addEventListener("click", td_click);
          if (!showEmtpy && tr[1].caption === "")
            tr.destroy();
          else{
            if(!groups[group].readonly || groups[group].readonly(object, prop)) {
              tr[1].html.classList.add("RuiReadOnly");
              if(typeof object[prop] == "object" && 
                  object[prop].isClass(RuiObject) &&
                  typeof setPropObject == "function"){
                tr[1].html.addEventListener("dblclick", function(){
                  setPropObject(object[prop]);
                });
              }
            }else{
              switch(propType){
                case Function:
                  break;
                case Object:
                  if(object.isClass(RuiObject) &&
                      typeof setPropObject == "function"){
                    tr[1].html.addEventListener("dblclick", function(){
                      setPropObject(setPropObject);
                    });
                  }
                  break;
                case Number:
                case String:
                  tr[1].html.addEventListener("dblclick", function(){
                    edit.object = object;
                    edit.property = prop;
                    edit.group = groups[group];
                    startEdit.call(this);
                  });
                  break;
                case Boolean:
                case Array:
                  tr[1].html.addEventListener("dblclick", startSelect);
                  break;
              }
            }
            if(groups[group].addHelp){
              groups[group].addHelp(object, prop, tr[1].html);
            }
            tr[1].html.setAttribute("data-propName", prop);
            tr[1].html.setAttribute("data-propGroup", group);
          }
        }
      });
      if (groups[group].body.children.length == 1) {
        tr.html.classList.add("RuiEmpty");
      }
    });
    html.scrollTop = scrollTop;
    table.visible = true;
  }
  
  function td_click(e){
    //let propPath = e.propagationPath()
    if(this.nodeName == "TD"){
      let html = this;
      if(this.parentNode.firstElementChild == this) 
        html = this.parentNode.lastElementChild;
      let pname = html.getAttribute("data-propName");
      let group = html.getAttribute("data-propGroup");
      if(groups[group].renderHelp)
        currentHelp = groups[group].renderHelp(object, pname);
      else
        currentHelp = pname;
      thtml.querySelectorAll(".RuiActive").forEach(
        td => td.classList.remove("RuiActive")
      );
      this.parentNode.classList.add("RuiActive");
    }
  };

  let props = {
    object: rui.createVariable({
      get: () => object,
      set: function(val) {
        if (typeof val == "object") {
          object = val;
          updateView();
        }
      },         
    }),
    currentHelp: rui.createConstant(currentHelp),
    showEmtpy: rui.createVariable({
      get: () => showEmtpy,
      set: function(val) {
        showEmtpy = val;
        updateView();
      }, 
    }),
    showNonEnumerable: rui.createVariable({
      get: () => showNonEnumerable,
      set: function(val) {
        showNonEnumerable = val;
        updateView();
      }, 
    }),
    groups: rui.createVariable({
      get: () => groups,
      set: function(val) {
        groups = val;
        updateView();
      }, 
    }),
  };
  
  // assign propertis to object
  Object.defineProperties(this, props);
  // also store the descriptor to props-accessor
  this.props.RuiProperties = props;
  // and join them to the all object
  Object.assign(this.props.all, props);    

  if(wOptions.preview){
    rui.lib.applyOwnOptions(this, {
      top: 0,
      left: 0,
      width: 140,
      css: {
        "transform-origin": "0 0",
        transform: "scale(0.5, 0.5)",
        "text-align": "left"
      },
      object: {
        Caption: "String",
        Number: 1,
        Visible: true
      }
    });
  }else{
    rui.lib.applyOwnOptions(this, wOptions);
  }
}
