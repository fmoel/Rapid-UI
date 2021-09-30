/* Copyright 2021 Frank Moelendoerp */

let designTimeItems = {
  RuiObject:{
    parent:{
      help: "Returns the parent object reference",
    },
    _references:{
      help: "holds all resolved references",
    },
    html:{
      help: "Stores reference to the main html element",
    },
    path: {
      help: "Stores the path from window context to this object",
    },
    extra: {
      help: "Stores extra information this object. The value is not evaluated" +
            " by the object.",
    },
    designTime: {
      help: "Is set, if the component is loaded at design time",
    },
    isEmbedded: {
      help: "Is set, if the component part of another component",
    },
    isRoot: {
      help: "Returns if this is the root object",
    },
    isAppended: {
      help: "Returns if this is part of the DOM",
    },
    name: {
      help: "Returns the name of this object",
    },
    _events: {
      help: "holds all event handlers",
    },    
    getLayout: {
      help: "Generates the layout description starting. It traverse the " +
            "children as well. The generated object can be used to generate" +
            " the layout.json",
      arguments:{
        object: {
          type: Object,
          default: {},
          help: "(optional) can be used to extend an existing object",
        },
      },
      returnValue: "Returns the layout description in an js object format" ,
      returnType: Object,
    },
    destroy:{
      help: "Destructor. Gets called, if the ruiObject is deleted. It " +
            "removes itself from the parent container, cleans the dom and " +
            "removes event handlers",
    },
    appendNow:{
      help: "This call appends the html dom element to it's parent. This " +
            "speeds up the loading process, because every inital " +
            "modification to the dom is as small posibile and will not be " +
            "rendered immidiately.",
      example:  "let btn = new rui.cls.RuiButton(Parent, \"Button1\");\n" +
                "\r\n btn.appendNow();",      
    },
    rename:{
      help: "Renames the object and publish the new name to its parent " +
      "container",
    },
  },
  RuiButton:{
    label: {
      category: "const"
    },
    caption: {
      category: "variable",
      help: "Change the caption of the button"
    }
  },
  RuiInvisibleControl:{
    left: {
      help: "Quick access to this css property. Write access can omit 'px'." +
      " Use getLeft for the numeric value",
      category: "style",
    },
    top: {
      category: "style",
      help: "Quick access to this css property. Write access can omit 'px'." +
            " Use getTop for the numeric value",
    }
    
  },
  RuiVisibileControl:{
    tooltip: {
      help: "Stores a tooltip text, that will be shown on hover the element",
      example: "let label = new rui.cls.RuiLabel(parent, 'My Label');\n" +
               "label.tooltip = 'I\'m a Label';\n" +
               "label.tooltipPosition = 'bottom';",
    },
    tooltipPosition: {
      help: "The position the tooltip will be shown. Allowed values: ['', " +
            "'left', 'right', 'top', 'bottom']",
      list: ['','left', 'right', 'top', 'bottom'],
      example: "let label = new rui.cls.RuiLabel(parent, 'My Label');\n" +
               "label.tooltip = 'I\'m a Label';\n" +
               "label.tooltipPosition = 'bottom';",
    },
    css: {
      help: "Set a couple of styles for the root element at once. An Object " +
            "must be provided with the name of the css-property as object-" +
            "property name and the value as a string",
      example: "let label = new rui.cls.RuiLabel(parent, 'My Label', " +
               "{css: {border: '1px soldid black' }});\n" +
               "label.css = {'min-width': '100px', 'z-index': 1000};"
    },
    getLeft: {
      help: "Return the current left in pixels offset from the container " +
            "left container edge to the left edge of the control",
      example: "let label = new rui.cls.RuiLabel(parent, 'My Label', " +
               "{left: 20 %});\n" +
               "console.log(label.getLeft) // logs eg. 100 ",
    },
    getTop: {
      help: "Return the current top in pixels offset from the container " +
            "top container edge to the top edge of the control",
      example: "let label = new rui.cls.RuiLabel(parent, 'My Label', " +
               "{top: 20 %});\n" +
               "console.log(label.getTop) // logs eg. 100 ",
    },
    getHeight: {
      help: "Return the current height of the control in pixels",
      example: "let label = new rui.cls.RuiLabel(parent, 'My Label', " +
               "{height: 20 %});\n" +
               "console.log(label.getHeight) // logs eg. 100 ",
    },
    getWidth: {
      help: "Return the current width of the control in pixels",
      example: "let label = new rui.cls.RuiLabel(parent, 'My Label', " +
               "{width: 20 %});\n" +
               "console.log(label.getWidth) // logs eg. 100 ",
    },
    getRight: {
      help: "Return the current right in pixels offset from the container " +
            "right container edge to the right edge of the control",
      example: "let label = new rui.cls.RuiLabel(parent, 'My Label', " +
               "{right: 20 %});\n" +
               "console.log(label.getRight) // logs eg. 100 ",
    },
    getBottom: {
      help: "Return the current bottom in pixels offset from the container " +
            "bottom container edge to the bottom edge of the control",
      example: "let label = new rui.cls.RuiLabel(parent, 'My Label', " +
               "{bottom: 20 %});\n" +
               "console.log(label.getBottom) // logs eg. 100 ",
    },
    visible: {
      help: "Sets and returns the current visibility of the control. Uses" +
            "CSS display property with none for invisible. ",
      example: "let label = new rui.cls.RuiLabel(parent, 'My Label'); \n" +
               "label.visible = false; // make controle invisible \n" +
               "label.visible = true; // and visible again ",
    },
  },
  RuiCheckBox:{
    input: {
      help: "Reference to the input HTML Node",
    },
    label: {
      help: "Reference to the label HTML Node",
    },
    caption: {
      help: "Set the caption of the Checkbox",
    },
    captionPosition: {
      help: "Set the position of the caption",
    },
    value: {
      help: "Set the value of the Checkbox",
    },
    indeterminate: {
      help: "Set the value of the Checkbox to indeterminate",
    }
  },
  RuiContainer:{
    children: {
      help: "returns the children object",
    },
    add: {
      help: "adds a component to the container",
    },
    removeByObject: {
      help: "adds a component to the container",
    },
    removeByName: {
      help: "adds a component to the container",
    },
    _deleteChildReference: {
      help: "adds a component to the container",
    },
  },
  RuiDialog:{
    show: {
      help: "shows the dialog",
      example: "dialog.show()"        
    },
    maximize: {
      help: "maximize the dialog",
      example: "dialog.maximize()"        
    },
    minimize: {
      help: "minimize the dialog",
      example: "dialog.minimize()"        
    },
    close: {
      help: "close the dialog, with respect to minimizeOnClose and hideOnClose",
      example: "dialog.close()"        
    },
    hasMaximizeButton: {
      help: "Makes the Maximize Button in-/visible",
    },
    hasMinimizeButton: {
      help: "Makes the Minimize Button in-/visible",
    },
    hasCloseButton: {
      help: "Makes the Close Button in-/visible",
    },
    hide: {
      help: "hides the dialog",
      example: "dialog.hide()"        
    },
    minimizeOnClose: {
      help: "On true, click on close button minimize the window instead of closing and unloading",
    },
    hideOnClose: {
      help: "On true, click on close button hide the window instead of closing and unloading",
    },
    caption: {
      help: "Set the caption of the Dialog title bar",
    },
  },
  RuiDropDown:{
    size: {
      help: "Gets/Sets the size of the drop down box",
    },
    text: {
      help: "Gets/Sets the text of the box",
    },
    list: {
      help: "Access to the list elements",
    },    
  },
  RuiEmbeddedContainer:{
    children:{
      help: "Reference to the input HTML Node",
    },
    add: {
      arguments: {
        wOChild:{
          type: Object,
          help: "Child to append",
        },
        name:{
          type: String,
          help: "Name of the new child",
        },
        wOChild:{
          type: Boolean,
          help: "True, if child is invisible after add",
        }
      },
      help: "Adds an element to the dialog. If already in the tree it will be moved",
      example: "dialog.add(myChildElement, 'newElement', false);\r\n"+
               "dialog.newElement.visible = true;",
    },
    removeByName: {
      arguments: {
        nameToRemove:{
          type: String,
          help: "Name of child that will be removed",
        },
      },
      help: "Removes and destroys a child of dialog",
      example: "dialog.removeByName('newElement');",
    },
    removeByObject: {
      arguments: {
        objectToRemove:{
          type: Object,
          help: "Child that will be removed from the dialog",
        },
      },
      help: "Removes and destroys a child of dialog",
      example: "dialog.removeByObject(dialog.newElement);",
    },
    _deleteChildReference: {
      arguments: {
        objectToRemove:{
          type: Object,
          help: "Child that will be removed from the dialog",
        },
      },
      help: "Removes the child reference from the dialog without destroying it.",
      example: "dialog._deleteChildReference(dialog.newElement);",
    },
  },
  RuiFrame:{
    caption: {
      help: "Set or get the caption of this cell",
    },
  },
  RuiGrid:{
    gridTemplateColumns: {},
    gridTemplateRows: {},
    gridTemplateAreas: {},      
  },
  RuiImageButton: {
    image: {
      help: "Reference to the image HTML Node",
    },      
    imagePosition: {
      help: "Set the position of the image",
    },
    imageUrl: {
      help: "URL or data-blob for the image",
    },
    imageWidth: {
      help: "set the image width",
    },
    imageHeight: {
      help: "set the image height",
    },
  },
  RuiIndexContainer:{
    children:{
      help: "Reference to the input HTML Node",
    },
    add: {
      arguments: {
        wOChild:{
          type: Object,
          help: "Child to insert",
        },
        position:{
          type: Number,
          help: "Position of the new child",
        },
        targetHtml:{
          type: Object,
          help: "Optional. Where to position the child in the node tree",
        }
      },
      help: "Adds an element to the dialog. If already in the tree it will be moved",
      example: "container.add(myLabel, 1);\r\n"+
               "container[1].caption = 'At index 1';",
    },
    removeByIndex: {
      arguments: {
        indexToRemove:{
          type: Number,
          help: "Position of child that will be removed",
        },
      },
      help: "Removes and destroys a child of dialog",
      example: "dialog.removeByIndex(1);",
    },
    removeByObject: {
      arguments: {
        objectToRemove:{
          type: Object,
          help: "Child that will be removed from the dialog",
        },
      },
      help: "Removes and destroys a child of dialog",
      example: "dialog.removeByObject(dialog.newElement);",
    },
    length:{
      help: "Reference to the input HTML Node",
    },
    _deleteChildReference: {
      arguments: {
        objectToRemove:{
          type: Object,
          help: "Child that will be removed from the dialog",
        },
      },
      help: "Removes the child reference from the dialog without destroying it.",
      example: "dialog._deleteChildReference(dialog.newElement);",
    },
    clear: {
      help: "Removes all children",
      example: "container.clear();",
    },			
  },
  RuiLabel:{
    caption:{
      help: "Set or get the caption",
    },
    mode:{
      help: "Set or get the mode for caption. Valid are 'text' and 'html'."
    }
  },
  RuiMessageBox:{
    show: {
      help: "shows the MessageBox",
      example: "result = await MessageBox.show();"        
    },
    hide: {
      help: "hides the MessageBox",
    },
    caption: {
      help: "Set the caption of the MessageBox title bar",
    },
    text: {
      help: "Set the text of the MessageBox",
    },
    icon: {
      help: "Set the caption of the MessageBox title bar",
    },
    buttons: {
      help: "Set the caption of the MessageBox title bar",
    },
  },
  RuiOptionGroup:{
    value:{
      help: "Set or get the value of this group",
    },
  },
  RuiOptionRadio:{
    input: {
      help: "Reference to the input HTML Node",
    },
    label: {
      help: "Reference to the label HTML Node",
    },
    caption: {
      help: "Set the caption of the Checkbox",
    },
    captionPosition: {
      help: "Set the position of the caption",
    },
    checked: {
      help: "Set the value of the OptionRadio",
    },
    value:{
      help: "Set/Get the value of the OptionRadio",
    },
  },
  RuiProgressBar: {
    animated:{
      help: "Set/Get the if the ProgressBar is animated",
    },
    stopped:{
      help: "Set/Get the if the ProgressBar shows stop animation",
    },
    value:{
      help: "Set/Get the value of the ProgressBar",
    },
  },
  RuiProperties:{
    object: {
      help: "Set/Get the object to display",
    },
    currentHelp: {
      help: "Returns the help of the current select item, if available",
    },
    showEmtpy: {
      help: "True, let the Treeview also show empty entries",
    },
    showNonEnumerable: {
      help: "True, let the Treeview also show non enumerable entries",
    },
    groups: {
      help: "Groups for the entries. See long help",
    },
  },  
  RuiRibbon:{
    tabs: {
      help: "Reference to the tab container HTML Node",
    },      
    labels: {
      help: "Reference to the label container HTML Node",
    },      
    activeTab: {
      help: "Index of currently active tab",
    },
    addTab: {
      help: "Adds a tab to the Ribbon",
      arguments:{
        tab:{
          type: Object,
          help: "Array of or objets to insert. See long help."
        }
      },
      example: "ribbon.addTab(ribbonTab)",
    },
  },
  RuiRibbonGroup:{
    caption: {
      help: "Set or get the caption of this cell",
    },
  },
  RuiScrollBar:{
    min: {
      help: "Set or get the min value of the scrollbar",
    },
    max: {
      help: "Set or get the max value of the scrollbar",
    },
    value: {
      help: "Set or get the current value of the scrollbar",
    },
    size:{
      help: "Set or get the size of the handle",
    },
    direction: {
      help: "Set or get the direction of the scrollbar",
    },
  },
  RuiTabControl:{
    activeTabIdx: {
      help: "Index of currently active tab",
    },
    activeTab: {
      help: "Reference to active tab",
    },
    tabs: {
      help: "Reference to the tab container HTML Node",
    },
    labels: {
      help: "Reference to the labels container HTML Node",
    },
    tabPosition: {
      help: "Set or get the position of the tabulators",
    },
    clear: {
      help: "clears all tabs",
      example: "tabsControl.clear()"        
    },
    addTab: {
      help: "Adds a tab to the tabcontrol",
      arguments:{
        tab:{
          type: Object,
          help: "Array of, or objets to insert. See long help."
        }
      },
      example: "ribbon.addTab(ribbonTab)"        
    },
    onTabChange:{        
      help: "Handles the tab change event",
    },
  },
  RuiTable:{
    head: {
      help: "Reference to the head HTML Node",
    },
    body: {
      help: "Reference to the body HTML Node",
    },
    foot: {
      help: "Reference to the foot HTML Node",
    },
  },
  RuiTableCell:{
    caption: {
      help: "Set or get the caption of this cell",
    },
  },
  RuiTextBox:{
    text: {
      help: "Set or get the string in the text box",
    },
    type: {
      help: "Set or get the input type of the text box. More informaiton at" +
            "https://www.w3schools.com/tags/att_input_type.asp",        
    },
  },
  RuiTimer:{
    interval: {
      help: "Time in milli seconds until/between the timer event occours.",
    },
    periodic: {
      help: "Controls if the timer event is periodically fired or only." + 
            "single shot.",
    },
    running: {
      help: "Is true, if the timer is currently running. Use stop function " +
            "to change setting like interval or periodic."
    },
    start: {
      help: "Starts the timer with the given settings.",
    },
    stop: {
      help: "Stop the timer."
    },
    onTimeOut: {
      help: "Is called when the timer event occurs.",
      callbackArguments:{
        times: {
          type: Number,
          help: "How often does the event occurs since last start trigger",
        },
        periodic: {
          type: Boolean,
          help: "Is this event periodic",
        },
        interval: {
          type: Number,
          help: "The current interval between to event/ from start to event",            
        },
      },
    },
  },
  RuiTreeView:{
    depthFilter: {
      help: "This is a callback placeholder for a function that allows to " +
            "cancel deeper recursion in to the object. A return value " + 
            "evaluates to false skips the next level. True let it continue.",
      callbackArguments:{
        object:{
          type: Object,
          help: "Holds the current object reference",
        },
        propertyName:{
          type: String,
          help: "The name of the property holding the next deeper object " + 
                "reference",
        },
        recursionArray:{
          type: Array,
          help: "Hold all higher level object references",
        }
      },
      example: "function depthFilter(object, propertyName, depth, recursionFilter)" +
               "{\n" +
               "  if(propertyName == 'debug') return false;\n" +
               "  if(object === window) return false;\n" +
               "  if(recursionFilter.includes('myProp')) return false;\n" +
               "  if(depth > 10) return false;\n" +
               "  return true;\n" +
               "}\n" + 
               "myTree.depthFilter = depthFilter;",
    },
    propertyFilter: {
      help: "This is a callback placeholder for a function that allows to " +
            "cancel named properties of an object. A return value " + 
            "evaluates to false skips this property. True let it continue.",
      callbackArguments:{
        object:{
          type: Object,
          help: "Holds the current object reference",
        },
        propertyName:{
          type: String,
          help: "The name of the property, that needs to be tested",
        },
      },
      example: "function propertyFilter(object, propertyName)" +
               "{\n" +
               "  if(propertyName == 'debug') return false;\n" +
               "  if(object === window) return false;\n" +
               "  return true;\n" +
               "}\n" + 
               "myTree.depthFilter = depthFilter;",
    },
    object: {
      help: "Holds the object, which is represented in the tree view. " + 
            "Setting this value will force a rerendering of the tree. " +
            "Cyclic references will be skipped",
    },
    selectedPath: {
      help: "Get or set the path of the currently select element.",
    },
    selectedKey: {
      help: "Get the property name of the currently select element. This is " +
       " readonly",
    },
    selectedValue: {
      help: "Get the value of the currently select element. This is readonly.",
    },
  },
  RuiValidator:{
    validateRules: {
      help: "Rules set to validate against",
    },
    registerValidation: {
      help: "Register all validation rules."
    },
    unregisterValidation: {
      help: "Unegister all validation rules."
    },
  },
};

(function(w){
  let designTimeLoaded = false;
  
  Object.defineProperties(w, {
    loadDesignTime: {
      get: function(){
        return function(){
          if(designTimeLoaded) return;
          designTimeLoaded = true;
          for(let className in Object.keys(designTimeItems)){
            let cls = [rui.cls.className];
            if(typeof cls == "object"){
              if(typeof cls.props != "object") cls.props = {};
              let props = cls.props;
              for(let propName in Object.keys(designTimeItems[className])){
                if(typeof props[propName] != "object") props[propName] = {};
                let oldProp = props[propName];
                let newProp = designTimeItems[className][propName];
                for(let infoName in Object.keys(newProp)){
                  oldProp[infoName] = newProp[infoName];
                }
              }
            }
          }
        }
      }
    }
  });
})(window);