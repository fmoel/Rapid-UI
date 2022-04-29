/* Copyright 2021 Frank Moelendoerp */

window.Undefined = obj => obj === undefined ? undefined : false;
window.Null = obj => obj === null ? null : false;

let rui;

if(Object.isClass == undefined){
  Object.defineProperty(Object.prototype, "isClass", {
    value: function(constructor){
        if(this.constructor == constructor)
            return true;
        if(this._base && Array.isArray(this._base) && this._base.includes(constructor))
            return true;
            return true;
        return false;
    },
    configurable: true,
    enumerable: false,
  })
}


if(typeof window.rui != 'object')
  window.rui = new (function(){
    let gridSize = 5, lib = {}, cls = {}, moveable = {}, resizeable = {};
    let xlat = {};
    const allowEval = true;
    
    // rui.lib implementation
    Object.defineProperties(lib, {
      getBool: createMethod(function(v){
        return isNaN(+v)?!!(v+'').toLowerCase().replace(!1,''):!!+v; 
      }),
      addScriptTag: createMethod(function(scriptContent, name){
        let script = document.createElement("script");
        script.setAttribute("data-filename", name);
        script.textContent = scriptContent;
        try{
          document.body.append(script);
        }catch(e){
          throw new ReferenceError("Error loading component " + name);
        }
      }),
      getType: createMethod(function (val){
        switch(typeof val){
          case "object":
            if(val === null) return Null;
            if(Array.isArray(val)) return Array;
            return Object;
          case "string":
            return String;
          case "number":
            return Number;
          case "boolean":
            return Boolean;
          case "function":
            return Function;
          case "object":
            return Object;
          case "undefined":
            return Undefined;
        }
      }),
      getFiles: createMethod(async function(urlArray, charset = "UTF-8"){
        let promiseArray = [];
        urlArray.forEach(url => promiseArray.push(this.getFile(url, charset)));
        return await Promise.all(promiseArray);
      }),
      getFile: createMethod(async function(url, charset = "UTF-8"){
        return new Promise((resolve, reject) =>{
          let request = new XMLHttpRequest();
          request.open('GET', url, true); 
          request.overrideMimeType('text/plain; charset=' + charset);
          request.send(null);

          request.onreadystatechange = function(){
            if (request.readyState === 4){
              if (request.status === 200){
                resolve(request.responseText);
              }else{
                reject(request);
              }
            }
          }
        })
      }),
      httpRequestGet: createMethod(async function(url, charset = "UTF-8", mimeType = 'text/plain'){
        return new Promise((resolve, reject) =>{
          let request = new XMLHttpRequest();
          request.open("GET", url, true); 
          request.overrideMimeType(mimeType + '; charset=' + charset);
          request.send(null);

          request.onreadystatechange = function(){
            if (request.readyState === 4){
              if (request.status === 200){
                resolve(request.responseText);
              }else{
                reject(request);
              }
            }
          }
        })
      }),
      httpRequestPost: createMethod(async function(url, postString, charset = "UTF-8", mimeType = 'text/plain'){
        return new Promise((resolve, reject) =>{
          let request = new XMLHttpRequest();
          request.open("POST", url, true); 
          request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          request.overrideMimeType(mimeType + '; charset=' + charset);
          request.send(postString);

          request.onreadystatechange = function(){
            if (request.readyState === 4){
              if (request.status === 200){
                resolve(request.responseText);
              }else{
                reject(request);
              }
            }
          }
        })
      }),
      isTouchDevice: createMethod(function() {
        return /(iphone|ipod|ipad|android|iemobile|blackberry|bada)/
          .test(window.navigator.userAgent.toLowerCase());
      }),
      bubble: createMethod(function(func, reverse = false){
        let bubble = function(){
          let ret;
          if(!reverse)
            for(let i = bubble.arr.length; i--;){
              ret = bubble.arr[i].apply(this, arguments);
            }
          else
            for(let i = 0; i < bubble.arr.length; i++){
              ret = bubble.arr[i].apply(this, arguments);
            }
          return ret;
        }
        bubble.arr = [func];
        Object.defineProperty(bubble, "push", {value: function(val){
          if(typeof val != "function")
            throw new TypeError("rui.lib.bubble.push expects a function as argument");
          bubble.arr.push(val)
        }});
        return bubble;
      }),
      addBaseTree: createMethod(function(obj, type){
        if(typeof obj != "object")
          throw new TypeError("rui.lib.addBaseTree expects an object as first argument");
        if(typeof type != "function")
          throw new TypeError("rui.lib.addBaseTree expects a constructor as second argument");
        if(!Array.isArray(obj._base)){
          Object.defineProperties(obj, {
            _base: {
              value: [],
              enumerable: false,
              configurable: false,
            }
          })
        } 
        obj._base.push(type);    
      }),
      getAllProperties: createMethod(function(obj) {
        if(typeof obj != "object")
          throw new TypeError("rui.lib.getAllProperties expects an object as argument");
        let allProps = [], curr = obj;
        do {
          let props = Object.getOwnPropertyNames(curr);
          props.forEach((prop) => {
            if (allProps.indexOf(prop) === -1)
              allProps.push(prop);
          });
          curr = Object.getPrototypeOf(curr);
        }while (curr);
        return allProps;
      }),
      applyOwnOptions: createMethod(function(self, wOptions, noDelete = false) {
        if(typeof self != "object" || typeof self != "object")
          throw new TypeError("rui.lib.applyOwnOptions expects an first and second object as argument");
        for (let prop in wOptions) {
          if (self.hasOwnProperty(prop)) {
            if(prop == "_references"){
              for (let ref in wOptions._references) {
                self._references[ref] = wOptions._references[ref];
              }
            }else{
              if(typeof self[prop] == "function" && self[prop] != emptyEvent)
                self[prop].apply(self, [wOptions[prop]]);
              else{
                self[prop] = wOptions[prop];
              }
            }
            if(!noDelete)
              delete wOptions[prop];
          }
        }
      }),
      getObjectByPath: createMethod(function (pathStr, obj = window) {
        if(typeof pathStr != "string")
          throw new TypeError("rui.lib.getObjectByPath first argument must be a string");
        if(typeof obj != "object")
          throw new TypeError("rui.lib.getObjectByPath second argument must be an object");        
        pathStr = pathStr.replaceAll("[", ".").replaceAll("]", "")
        let path = pathStr.split(".");
        while (path.length) {
          if (typeof obj[path[0]] != "undefined")
            obj = obj[path[0]];
          else
            break;
          path.shift();
        }
        return obj;
      }),
      getRuiObjectFromHTML: createMethod(function (html) {
        if(html instanceof HTMLElement)
          throw new TypeError("rui.lib.getRuiObjectFromHTML first argument must be a html element");
        while (!html.hasAttribute("data-path") && html.parentNode != document.body) {
          html = html.parentNode;
        }
        if (html.hasAttribute("data-path")) {
          let path = html.getAttribute("data-path").split(".");
          return this.getRuiObjectByPath(path);
        }
        return false;
      }),
      deepCopyObj: createMethod(function deepCopyObj(obj, originalMap = [], copyMap = []) {
        if (null == obj || "object" != typeof obj) return obj;
        
        var indexOfCopy = originalMap.indexOf(obj);
        if(indexOfCopy > -1)
          return copyMap[indexOfCopy];1
        
        if (obj instanceof Date) {
          var copy = new Date();
          copy.setTime(obj.getTime());
          originalMap.push(obj);
          copyMap.push(copy);
          return copy;
        }
        if (obj instanceof Array) {
          var copy = [];
          for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = deepCopyObj(obj[i], originalMap, copyMap);
            originalMap.push(obj[i]);
            copyMap.push(copy[i]);
          }
          return copy;
        }
        if (obj instanceof Object) {
          var copy = {};
          originalMap.push(obj);      
          copyMap.push(copy);
          for (var attr in obj)
            if (obj.hasOwnProperty(attr))
              copy[attr] = deepCopyObj(obj[attr], originalMap, copyMap);
          return copy;
        }
        throw new Error("Unable to copy obj this object.");
    }),
      addPxIfNeeded: createMethod(function (value) {
        if(typeof value != "string" && typeof value != "number")
          throw new TypeError("rui.lib.addPxIfNeeded first argument must be a string or a number");
        const units = ["%", "cm", "mm", "in", "px", "pt", "pc", "em", "ex", "ch", "rem", "vmin", "vmax"];
        if (typeof value == "string") {
          for (let i = 0; i < units.length; i++)
            if (value.endsWith(units[i])) return value;
          let val = parseFloat(value) + "px";
          if (val == "NaNpx") return value;
          return val;
        } else {
          if (isNaN(value)) return "";
          return value + "px";
        }
      }),
    });

      
    // xlat lib
    {
      let language = "de", xlatTbl;
      let untranslatedTbl = {}
      Object.defineProperties(xlat, {
        loadLanguageFile: createMethod(async function(file){
          var content = await rui.lib.getFile(file);
          xlatTbl = JSON.parse(content);
        }),
        language: createVariable({
          get: () => language, 
          set: val => language = val
        }),
        getTranslated: createMethod(function(value) {
          if(typeof xlatTbl == "object" && typeof value == "string"){
            if(typeof xlatTbl[language] == "object" && 
                typeof xlatTbl[language][value] == "string")
              return xlatTbl[language][value];
            else{
              if(typeof untranslatedTbl[language] != "object")
                untranslatedTbl[language] = {};
              untranslatedTbl[language][value] = ""; 
            }
          }
          return value;
        }),
        UntranslatedTable: createReadOnly(() => untranslatedTbl),
        xlatTbl: createReadOnly(() => xlatTbl)
      });
    }
    
    
    
    // moveable lib
    {
      let startX, startY, dragging, abortOnPageLeave = true;
      function startMoving(e) {
        if(e.which == 1){
          if(this.moving instanceof HTMLElement){
            let htmlStyle = window.getComputedStyle(this.moving);
            startX = e.clientX - parseInt(htmlStyle.getPropertyValue("left"));
            startY = e.clientY - parseInt(htmlStyle.getPropertyValue("top"));
          }else if(this.moving instanceof SVGElement){
            var svgRoot = this.moving.parentNode;
            while(svgRoot.nodeName != "svg") svgRoot = svgRoot.parentNode;
            var rootBbox = svgRoot.getBoundingClientRect();
            var bbox = this.moving.getBoundingClientRect();
            startX = e.clientX - bbox.x + rootBbox.x;
            startY = e.clientY - bbox.y + rootBbox.y;
          }
          dragging = this;
          e.stopPropagation();
        }
      }

      function moving(e) {
        if (dragging != null) {
          let grid = rui.grid;
          if(e.ctrlKey) grid = 1;
          e.stopPropagation();
          if(dragging.moving instanceof HTMLElement){
            dragging.moving.style.left = parseInt((e.clientX - startX) / grid) * grid + "px";
            dragging.moving.style.top = parseInt((e.clientY - startY) / grid) * grid + "px";
          }else if(dragging.moving instanceof SVGElement){
            var x = parseInt((e.clientX - startX) / grid) * grid;
            var y = parseInt((e.clientY - startY) / grid) * grid;
            dragging.moving.style.transform = "translate(" + x + "px, " + y + "px)";
          }
        }
      }

      function abortMoving(e) {
        e = e ? e: window.event;
        let from = e.relatedTarget || e.toElement;
        if (from && from.nodeName == "HTML") {
          if(dragging != undefined && dragging.moving != undefined && 
            typeof dragging.moving.addResizer == "function") dragging.moving.addResizer();
          dragging = null;
        }
      }
      
      function endMoving(e) {
        if (dragging != null) {
          if(typeof dragging.moving.addResizer == "function") dragging.moving.addResizer();
          dragging = null;
          e.stopImmediatePropagation();
          e.preventDefault();
        }
      }

      function installMoveableEvents(){
        document.body.addEventListener("mouseup", endMoving);
        document.addEventListener("mouseout", abortMoving);       
        document.body.addEventListener("mousemove", moving);
      }
      if (document.readyState === "complete" 
        || document.readyState === "loaded" 
        || document.readyState === "interactive") {
          installMoveableEvents();
      }else{
        window.addEventListener("DOMContentLoaded", installMoveableEvents);
      }
      

      
      function getHtml(obj){
        if(obj.isClass(cls.RuiObject) && obj.html){
          return obj.html;
        }else if(obj instanceof HTMLElement || obj instanceof SVGElement){
          return obj;
        }
        return false;
      }

      window.addEventListener("mouseexit", endMoving);
      
      Object.defineProperties(moveable, {
        abortOnPageLeave: createVariable({
          get: () => abortOnPageLeave,
          set: (val) => {
            abortOnPageLeave = !!val;
            if(val){
              window.addEventListener("mouseexit", endMoving);
            }else{
              window.removeEventListener("mouseexit", endMoving);            
            }
          }}),
        addMoveable: createMethod(function(grabber, moving){
          let typeErrorString = "rui.moveable.addMoveable needs a RuiObject or an HTMLElement as first and second argument. Second argument can be undefined. This will make grabber and moving as the same HTMLElement. grabber is of type '" + (typeof grabber) + "'. moving is of type '" + (typeof moving);
          grabber = getHtml(grabber);
          if(moving == undefined) 
            moving = grabber;
          else
            moving = getHtml(moving);
          if(!moving || !grabber)
            throw new TypeError(typeErrorString);
          grabber.moving = moving;
          moving.style.position = "absolute";
          grabber.addEventListener("mousedown", startMoving);
          grabber.addEventListener("mousemove", moving);
          grabber.addEventListener("mouseup", endMoving);
        }),
        removeMoveable: createMethod(function(grabber){
          grabber = getHtml(grabber);
          if(!grabber)
            throw new TypeError(typeErrorString);
          delete grabber.moving;
          grabber.removeEventListener("mousedown", startMoving);
          grabber.removeEventListener("mousemove", moving);
          grabber.removeEventListener("mouseup", endMoving);
        }),
      });
    }
    
    // Resize lib
    {
      // currentResizer: may be boxResizer or borderResizer
      // currentSelf: object to be resized
      let currentResizer, currentSelf;
      // borderContainer holds a 5x5 table to form the border and corners
      let borderContainer = document.createElement("table");
      borderContainer.classList.add("RuiResizeBorderContainer");
      let borderTBody = document.createElement("tbody");
      borderContainer.append(borderTBody);
      for(let y = 0; y < 5; y++){
        let tr = document.createElement("tr");
        for(let x = 0; x < 5; x++){
          let td = document.createElement("td");
          if(y == 0)
            td.setAttribute("top", "1");
          else if(y == 4)
            td.setAttribute("bottom", "1");
          else{
            if(x == 0 || x == 4){
              if(y <= 1)
                td.setAttribute("top", "1");
              else if(y >= 3)
                td.setAttribute("bottom", "1");              
            }              
          }
          if(x == 0)
            td.setAttribute("left", "1");
          else if(x == 4)
            td.setAttribute("right", "1");
          else{
            if(y == 0 || y == 4){
              if(x <= 1)
                td.setAttribute("left", "1");
              else if(x >= 3)
                td.setAttribute("right", "1");              
            }              
          }
          
          tr.append(td);
          td.addEventListener("mousedown", resizeStart);
        }
        borderTBody.append(tr);
      }
      
      function resizeStartTable(e){
        
      }
      
      // box resizing
      let resizing = false;
      let left, top, right, bottom;
      let borderSelf, boxSelf;
      let boxContainer = document.createElement("div");
      boxContainer.classList.add("RuiResizeBoxContainer");
      for(let i = 0; i < 8; i++){
        let box = document.createElement("div");
        box.classList.add("RuiResizeBox");
        if(i < 3)
          box.setAttribute("top", "1");
        if(i == 0 || i == 3 || i == 5)
          box.setAttribute("left", "1");
        if(i == 2 || i == 4 || i == 7)
          box.setAttribute("right", "1");
        if(i > 4)
          box.setAttribute("bottom", "1");
        box.addEventListener("mousedown", resizeStart);
        boxContainer.append(box);
      }

      let mouseX, mouseY;
      let selfTop, selfLeft, selfHeight, selfWidth;
      let resizerTop, resizerLeft, resizerHeight, resizerWidth;

      function resizeInit(){
        document.body.append(borderContainer);
        document.body.append(boxContainer);
        document.addEventListener("mousedown", startResizeOnClick);
        document.addEventListener("mousemove", resizeEvent);
        document.addEventListener("mouseup", resizeEnd);
      }

      function resizeStart(e){
        currentResizer = this.nodeName == "DIV" ? boxContainer : borderContainer;
        if (currentResizer.notResizeable) return;
        currentSelf = this.nodeName == "DIV" ? boxSelf : borderSelf;
        top = this.hasAttribute("top");
        bottom = this.hasAttribute("bottom");
        left = this.hasAttribute("left");
        right = this.hasAttribute("right");
        resizing = top || bottom || left || right;
        document.body.style["user-select"] = "none";
        mouseX = e.screenX;
        mouseY = e.screenY;
        let s = currentResizer.style;
        let selfRect = window.getComputedStyle(currentSelf.html);
        selfTop = parseInt(selfRect.getPropertyValue("top"));
        selfLeft = parseInt(selfRect.getPropertyValue("left"));
        selfWidth = parseInt(selfRect.getPropertyValue("width"));
        selfHeight = parseInt(selfRect.getPropertyValue("height"));
        resizerTop = parseInt(s.top);
        resizerLeft = parseInt(s.left);
        resizerWidth = parseInt(s.width);
        resizerHeight = parseInt(s.height);          
        let abort = false;
        if(typeof onResizeStartCallBack == "function")
          abort = onResizeStartCallBack(currentSelf);
        if(abort) resizing = false;
        //e.stopPropagation();
      }
      
      function startResizeOnClick(e){
        if(resizing) return;
        let el = e.target;
        while(el != document.body && el != document &&
          (!el.hasAttribute("data-path") || el.hasAttribute("noTarget")))
            el = el.parentNode;
        if(typeof el.addResizer == "function"){
          el.addResizer();
        } 
      }
      
      function resizeMouseEnter(e){
        if(resizing) return;
        let el = e.target;
        if(typeof el.hasAttribute != "function") return;
        while((!el.hasAttribute("data-path") ||
            el.hasAttribute("noTarget")) &&
            el != document.body) el = el.parentNode;
        if(typeof el.addResizer == "function") el.addResizer();
        //e.stopPropagation();
      }
    
      function resizeEnd(e){
        if(resizing){
          if(typeof onResizeEndCallBack == "function")
            onResizeEndCallBack(currentSelf);
          //e.stopPropagation();
        }
        resizing = false;
        document.body.style["user-select"] = "";
      }

      function resizeEvent(e){
        if(resizing){
          let self = currentSelf;
          let s = currentResizer.style;
          let dx = e.screenX - mouseX;
          let dy = e.screenY - mouseY;
          let grid = 5;
          if (e.ctrlKey) grid = 1;
          e.stopImmediatePropagation();
          if(top){
            self.top = parseInt((selfTop + dy) / grid) * grid + "px";
            s.top = parseInt((resizerTop + dy) / grid) * grid + "px";
            self.height = parseInt((selfHeight - dy) / grid) * grid + "px";
            s.height = parseInt((resizerHeight - dy) / grid) * grid + "px";
          }else if(bottom){
            self.height = parseInt((selfHeight + dy) / grid) * grid + "px";
            s.height = parseInt((resizerHeight + dy) / grid) * grid + "px";
          }
          if(left){
            self.left = parseInt((selfLeft + dx) / grid) * grid + "px";
            s.left = parseInt((resizerLeft + dx) / grid) * grid + "px";
            self.width = parseInt((selfWidth - dx) / grid) * grid + "px";
            s.width = parseInt((resizerWidth - dx) / grid) * grid + "px";
          }else if(right){
            self.width = parseInt((selfWidth + dx) / grid) * grid + "px";
            s.width = parseInt((resizerWidth + dx) / grid) * grid + "px";
          }
          let selfRect = window.getComputedStyle(self.html);
          s.width = parseInt(selfRect.getPropertyValue("width")) + "px";
          s.height = parseInt(selfRect.getPropertyValue("height")) + "px";
          let abort = false;
          if(typeof onResizeCallBack == "function")
            abort = onResizeCallBack(currentSelf);
          if(abort) resizing = false;
        }
        //e.stopPropagation();
      }

      function showResizeBoxes(){
        boxContainer.style.display = "block";
      }
      
      function hideResizeBoxes(){
        boxContainer.style.display = "none";
      }
      
      function addResizer(e){
        this.addResizer();
        //e.stopPropagation();
      }

      Object.defineProperties(resizeable, {
        init: createMethod(resizeInit),
        makeResizable: createMethod(function(self, useResizeBoxes, parentForBoxes = document.body){
          let html = self.html;
          if(typeof html.addResizer == "function")
            throw new Error("rui.moveable.makeResizable can not be combined with makeSelectable nor called twice on the same object");
          let usedResizer = useResizeBoxes ? boxContainer : borderContainer;
          if(!useResizeBoxes)
            html.addEventListener("mouseenter", resizeMouseEnter);
          html.addResizer = function(){
            let rect = html.getBoundingClientRect();
            if(useResizeBoxes)
              parentForBoxes.append(usedResizer);            
            if(usedResizer.parentElement == null )
              self.html.append(usedResizer);
            let parentRect = usedResizer.parentElement.getBoundingClientRect();
            usedResizer.style.display = useResizeBoxes ? "block" : "table";
            usedResizer.style.left = (rect.left - parentRect.left) + "px";
            usedResizer.style.top = (rect.top - parentRect.top) + "px";
            usedResizer.style.height = rect.height + "px";
            usedResizer.style.width = rect.width  + "px";
            currentResizer = usedResizer;
            if(useResizeBoxes)
              boxSelf = self;
            else
              borderSelf = self;
          };
          html.addEventListener("mousedown", addResizer)
        }),      
        makeSelectable: createMethod(function(self){
          let html = self.html;
          if(typeof html.addResizer == "function")
            throw new InternalError("rui.moveable.makeSelectable can not be combined with makeResizable nor called twice on the same object");
          html.addResizer = function(){
            let rect = html.getBoundingClientRect();
            boxContainer.style.display = "block";
            boxContainer.style.left = rect.left + "px";
            boxContainer.style.top = rect.top + "px";
            boxContainer.style.height = rect.height + "px";
            boxContainer.style.width = rect.width + "px";
            boxContainer.notResizeable = true;
            currentResizer = boxContainer;
            boxSelf = self;
          };
          html.addEventListener("mousedown", addResizer);
        }),
      });
    }
    
    // member creation helper
    function createStyle(self, name, correctPx, triggerEvent, html){
      if(typeof self != "object" || !(self.html instanceof HTMLElement || self.html instanceof SVGElement))
        throw new TypeError("rui.createStyle first argument must be a derived RuiObject");
      if(typeof name != "string")
        throw new TypeError("rui.createStyle second argument must be a string");
      if(typeof triggerEvent != "string" && triggerEvent != undefined)
        throw new TypeError("rui.createStyle forth argument must be a string or undefined");
      if(html != undefined && !(html instanceof HTMLElement || html instanceof SVGElement))
        throw new TypeError("rui.createStyle fifth argument must be a html element or undefined");

      return {
        category: "style",
        type: String,
        get: function(){
          if(!html) html = self.html;
          return html.style[name];
        },
        set: function(val){
          if(!html) html = self.html;
          if(correctPx)
            html.style[name] = rui.lib.addPxIfNeeded(val);
          else
            html.style[name] = val;
          if(typeof (triggerEvent) == "string")
            html.dispatchEvent(new Event(triggerEvent));
        },
        enumerable: true,
        default: "",
      };
    }

    function createConstant(value, enumerable = true){
      if(typeof enumerable != "boolean")
        throw new TypeError("rui.createConstant second argument must be a boolean or undefined");
      return {
        category: "const",
        type: lib.getType(value),
        value: value,
        writable: false,
        enumerable: enumerable,
      };
    }

    function createReadOnly(getter, enumerable = true){
      if(typeof enumerable != "boolean")
        throw new TypeError("rui.createConstant second argument must be a boolean or undefined");
      return {
        category: "const",
        type: lib.getType(getter()),
        get: getter,
        enumerable: enumerable,
      };
    }

    function createAttributeProperty(name, html, enumerable = true){
      if(typeof name != "string")
        throw new TypeError("rui.createAttributeProperty first argument must be a string");
      if(typeof enumerable != "boolean")
        throw new TypeError("rui.createAttributeProperty second argument must be a boolean or undefined");
      return {
        category: "variable",
        type: String,
        get: function(){
          return html.getAttribute(name);
        },
        set: function(val){
          if(typeof val == ""){
            html.removeAttribute(name);
          }else{
            html.setAttribute(name, xlat.getTranslated(val));
          }
        },
        enumerable: true,
        default: null,
      };
    }

    function createVariable(setGet, enumerable = true){
      if(typeof setGet != "object")
        throw new TypeError("rui.createVariable first argument must be an object");
      if(typeof setGet.get != "function")
        throw new TypeError("rui.createVariable first argument must be an object containing a function as property 'get'");
      if(typeof enumerable != "boolean")
        throw new TypeError("rui.createVariable second argument must be a boolean or undefined");
      return {
        category: "variable",
        type: lib.getType(setGet.get()),
        get: setGet.get,
        set: setGet.set,
        default: setGet.get(),
        enumerable: enumerable,
        configurable: true,
      };
    }

    function createMethod(func, enumerable = true){
      if(typeof func != "function")
        throw new TypeError("rui.createMethod first argument must be a function");
      if(typeof enumerable != "boolean")
        throw new TypeError("rui.createMethod second argument must be a boolean or undefined");
      return {
        category: "method",
        type: Function,
        value: func,
        enumerable: enumerable,
        writable: false,
      };
    }

    let emptyEvent;
    
    function createEvent(eventType, enumerable = true){      
      if(typeof eventType != "string")
        throw new TypeError("rui.createEvent first argument must be a string");
      if(typeof enumerable != "boolean")
        throw new TypeError("rui.createEvent second argument must be a boolean or undefined");
      let self = this;
      return {
        set: function(val){
          if(typeof self._events != "object") 
            self._events = {};
          if(typeof self._events[eventType] != "function") {
            self._events[eventType] = function callEvents(e){
              if(!self.isAppended) return;
              for(let event of Object.keys(self._events[eventType])){
                if(typeof e != "object")
                  e = {};
                e.name = eventType; 
                self._events[eventType][event].call(self, e);
              }
            };
            if(!self.designTime){
              let eventName = eventType.substr(2).toLowerCase();
              self.html.addEventListener(eventName, self._events[eventType]);
            }
          }
          self._events[eventType][val] = val;
        },
        get: () => {
          emptyEvent = function(){console.warn("No event handler set for ", eventType, self)};
          return this._events[eventType] ? this._events[eventType] : emptyEvent;
        },
        enumerable: enumerable,
        type: Function,
        category: "event",
      };
    }  

    // todo: error handling
    function createReference(thisObj){
      if(typeof thisObj != "object")
        throw new TypeError("rui.createReference first argument must be an object");
      let references = {}
      for(let name in thisObj) {
        if (thisObj.hasOwnProperty(name) && typeof thisObj[name] == "string") {
          if(thisObj[name].startsWith("\\!"))
            thisObj[name] = thisObj[name].slice(1);
          else if(thisObj[name].startsWith("!")){
            references[name] = thisObj[name];
            try{
              if(allowEval)
                eval("thisObj[name]=" + thisObj[name].slice(1));
              else{
                let obj = lib.getObjectByPath(thisObj[name].slice(1))
                thisObj[name] = obj;
              }
            }catch(e){
              throw new ReferenceError("refrence not valid: '" + thisObj[name] + "'")
            }
          }
        }
      }
      if(Object.keys(references).length)
        thisObj._references = references;
    }
    
    function loadDependencies(deps){
      
    }
    
    function loadLayout(layoutObj, parent = window, designTime = false){
      var layout = lib.deepCopyObj(layoutObj);
      return loadLayoutDestructive(layout, parent, designTime)
    }

    // todo: error handling  
    function loadLayoutDestructive(layoutObj, parent = window, designTime = false){
      let lastParent;
      if(typeof layoutObj != "object")
        throw new TypeError("rui.loadLayout first argument must be an object");
      if(typeof parent != "object" && 
          (parent != window && !(parent.isClass(RuiObject))))
        throw new TypeError("rui.loadLayout second argument must be an derived RuiObject or undefined");
      if(typeof layoutObj != "object")
        throw new TypeError("rui.loadLayout third argument must be a boolean");
      for (let name in layoutObj) {
        if (layoutObj.hasOwnProperty(name) && name != "type" && 
            name != "this" && !name.startsWith("!")) {
          let newParent;
          let cur = layoutObj[name];
          let curDesignTime = designTime || 
              (typeof cur.this == "object" && cur.this.designTime) ||
              (parent != window && parent.designTime);
          if(layoutObj[name].hasOwnProperty("type")){
            if(!curDesignTime && typeof cur.this == "object")
              createReference(cur.this);
            if(typeof cur.this != "object") cur.this = {};
            if(!isNaN(name)) name = parseInt(name);
            //try{
              if(typeof cls[cur.type] != "function")
                console.error("Layout uses unknown type '" + cur.type + "'. Abort");
              newParent = new cls[cur.type](parent, name, cur.this, curDesignTime);
              lastParent = newParent;
                
            /*}catch(e){
              console.log("class list", cls);
              throw new TypeError("Could not create class '" + cur.type + "' for '" + name + "'");
            }*/
          }else{
            newParent = parent[name];
            if(newParent == undefined)
              throw new Error("newParent can not be assigned for parent '" + parent.path + "' with name '" + name + "'");
          }
          loadLayoutDestructive(cur, newParent, curDesignTime);
          if(typeof newParent.appendNow == "function")
            newParent.appendNow();
        }else if(name == "!dependencies"){
          loadDependencies(layoutObj[name]);
        }
      }
      return lastParent;
    }
    
    function registerClass(constructor){
      if(typeof constructor != "function")
        throw new TypeError("rui.registerClass: needs a named function as argument, '" +
          (typeof constructor) + "' was given");
      let name = constructor.name;
      if(name == "") 
        throw new TypeError("rui.registerClass: needs a named function as argument, '" +
          "' an anpnymous function was given");
      if(cls[name] != undefined)
        throw new TypeError("rui.registerClass: class name already registered");
      cls[name] = constructor;
    }
    
    let currentDragObject;
    
    let publics = {
      grid: createVariable({
        get: function(){return gridSize;},
        set: function(val){gridSize = val;}
      }),
      createAttributeProperty: createMethod(createAttributeProperty),
      createConstant: createMethod(createConstant),
      createEvent: createMethod(createEvent),
      emptyEvent: createReadOnly(() => emptyEvent),
      createMethod: createMethod(createMethod),
      createReadOnly: createMethod(createReadOnly),
      createStyle: createMethod(createStyle),
      createVariable: createMethod(createVariable),
      loadLayout: createMethod(loadLayout),
      registerClass: createMethod(registerClass),
      lib: createConstant(lib),
      cls: createConstant(cls),
      xlat: createConstant(xlat),
      moveable: createConstant(moveable),
      resizeable: createConstant(resizeable),
      currentDragObject: createVariable({
        get: () => currentDragObject,
        set: val => currentDragObject = val,
      }),
    };
    
    Object.defineProperties(this, publics);
    
  })();

rui = window.rui;

export default window.rui;


