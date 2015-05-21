Ext.define("Ozone.components.dashboarddesigner.DashboardDesigner",{extend:"Ext.container.Container",alias:["widget.dashboarddesigner","widget.Ozone.components.dashboarddesigner.DashboardDesigner"],id:"dashboard-designer",mixins:{circularFocus:"Ozone.components.focusable.CircularFocus"},autoRender:true,dashboardContainer:null,dashboard:null,ownerCt:null,dashboardExists:false,dashboardStore:null,height:"100%",floating:true,allWidgets:null,buildItemsArray:function(b){if(!b||!b.items){return}if(b.items.length===0){b.paneType=b.xtype;b.xtype="dashboarddesignerpane";if(b.widgets&&b.widgets.length>0){this.allWidgets=this.allWidgets.concat(b.widgets)}}else{if(b.xtype==="dashboarddesignerpane"){b.xtype="container";b.layout="fit";b.cls=""}for(var c=0,a=b.items.length;c<a;c++){this.buildItemsArray(b.items[c])}}return b},initComponent:function(){var a=this,b=a.dashboardExists?a.dashboard.configRecord.get("layoutConfig"):a.dashboard.get("layoutConfig");a.locked=a.dashboardExists?a.dashboard.configRecord.get("locked"):a.dashboard.get("locked");a.allWidgets=[];a.layout={type:"hbox",align:"stretch"};a.items=[{itemId:"dashboard-designer-working-area",id:"dashboard-designer-working-area",xtype:"dashboarddesignerworkingarea",flex:3,layout:"fit",items:a.buildItemsArray(b?Ext.clone(b):[]),listeners:{afterrender:{fn:a.setupDropZone,options:{single:true}},destroy:{fn:a.cleanUp}}},{xtype:"dashboarddesignersidepanel",dashboardDesigner:a}];a.callParent(arguments);a.down("dashboarddesignerbaselayout").on("viewready",a.setup,a,{single:true});a.on("baselayoutselected",a.enableKeyboardDesign,a);a.on("panelayouttypeselected",a.enableKeyboardDesign,a);Ext.EventManager.onWindowResize(a.resize,a)},setup:function(){var b=this.query("dashboarddesignerpane"),a;this.dashboardContainer.dashboardDesignerManager.register(this);this.dashboardContainer.dashboardDesignerManager.bringToFront(this);if(b.length>0){a=b[0].el}else{var d=this.down("dashboarddesignerbaselayout").el.query(".layout-type")[0];a=Ext.get(d)}var c=this.down("#cancelBtn").getFocusEl();this.setupFocus(a,c)},resize:function(){this.doComponentLayout()},enableKeyboardDesign:function(l,f,m){var k=this,b=this.down("dashboarddesignerworkingarea"),j=this.query("dashboarddesignerpane"),a;if(j.length===0||j.length===1){var h=j.length===0?b:j[0];f.get("type")?k.nest(h,f):k.updatePaneType(h,f);return}a=j[0].el;a.focus();for(var e=0,g=j.length;e<g;e++){var d=j[e];d.disableEditing()}b.setupFocus(a,j[g-1].el);function c(o,s){if(o.getKey()===Ext.EventObject.ENTER){if(f.get("type")){k.nest(s,f)}else{k.updatePaneType(s,f)}}if(o.getKey()===Ext.EventObject.ENTER||o.getKey()===Ext.EventObject.ESC){b.el.un("keyup",c);b.tearDownCircularFocus();var p=k.query("dashboarddesignerpane");for(var q=0,n=p.length;q<n;q++){var r=p[q];r.enableEditing()}m.focus()}}b.el.on("keyup",c)},nest:function(g,e){var h=e.get("type"),j=Ext.getCmp(g.id),c,a,c=e.get("classes"),b;if(!j){return}b=j.ownerCt;a={xtype:"container",cls:h+" "+(j.initialConfig.cls||""),layout:{type:h,align:"stretch"},items:[{xtype:"dashboarddesignerpane",cls:c[0],flex:1,htmlText:"50%",items:[],widgets:j.isXType("dashboarddesignerworkingarea")?this.allWidgets:j.initialConfig.widgets||[],paneType:j.initialConfig.paneType||""},{xtype:"dashboardsplitter"},{xtype:"dashboarddesignerpane",cls:c[1],flex:1,htmlText:"50%",items:[],paneType:j.initialConfig.paneType||""}]};if(j.initialConfig.flex){a.flex=j.initialConfig.flex}else{if(j.initialConfig.width){a.width=j.initialConfig.width}else{if(j.initialConfig.height){a.height=j.initialConfig.height}}}if(j.isXType("dashboarddesignerpane")){for(var d=0,f=b.initialConfig.items.length;d<f;d++){if(b.initialConfig.items[d]===j.initialConfig){b.initialConfig.items[d]=a;break}}b.remove(j);b.insert(d,a)}else{delete j.initialConfig.widgets;if(j.initialConfig.paneType){j.el.removeCls(j.initialConfig.paneType)}j.add(a)}this.tearDownCircularFocus();this.setup()},updatePaneType:function(h,b){var g=b.get("paneType"),f=Ext.getCmp(h.id),c=f.initialConfig.paneType;if(g==="fitpane"){var e=[];if(f.isXType("dashboarddesignerworkingarea")){e=this.allWidgets}else{e=f.initialConfig.widgets}var a=[];for(var d=0;e&&d<e.length;d++){if(!e[d].floatingWidget&&!e[d].background){a.push(e[d])}}if(a.length>1&&(f.isXType("dashboarddesignerworkingarea")||(c!==null&&c!=="fitpane"))){this.confirmRemoveWidgets(f,a)}else{f.el.replaceCls(f.initialConfig.paneType,g);f.initialConfig.paneType=g}}else{f.el.replaceCls(f.initialConfig.paneType,g);f.initialConfig.paneType=g}},confirmRemoveWidgets:function(c,a){var b=this,d=this.dashboard.activeWidget?this.dashboard.activeWidget:a[0];d=d.floatingWidget?a[0]:d;var e=Ext.fly("dashboard-designer-side-panel").query(".x-item-selected")[0];if(!e){e=Ext.fly("dashboard-designer-side-panel").query(".layout-type")[0]}Ext.widget("alertwindow",{title:"Warning",html:"<p>You are about to set a single-widget Fit layout to a pane containing "+a.length+" widgets. On save, all widgets in the pane except for <i>"+Ext.htmlEncode(d.name)+"</i> will be removed from the dashboard.</p><br/><p>Set to Fit layout and <b>permanently</b> remove the other widgets?</p>",width:400,dashboardContainer:b.dashboardContainer,focusOnClose:e,okFn:function(){c.el.replaceCls(c.initialConfig.paneType,"fitpane");c.initialConfig.paneType="fitpane";var g=[];if(c.isXType("dashboarddesignerworkingarea")){g=b.allWidgets}else{g=c.initialConfig.items[0]?c.initialConfig.items[0].widgets:c.initialConfig.widgets}for(var f=0;f<g.length;f++){var h=g[f];if(h.floatingWidget!==true&&h.background!==true&&h.uniqueId!==d.uniqueId){g[f]=null}}g=Ext.Array.clean(g);c.initialConfig.items[0]?c.initialConfig.items[0].widgets=g:c.initialConfig.widgets=g;if(c.isXType("dashboarddesignerworkingarea")){b.allWidgets=g}}}).show()},setupDropZone:function(){this.dropZone=new Ext.dd.DropZone(this.el,{ddGroup:"dashboard-designer",getTargetFromEvent:function(a){return a.getTarget(".droppable",1)},onNodeEnter:function(d,a,c,b){Ext.fly(d).addCls("highlight-dashboard-designer-drop")},onNodeOut:function(d,a,c,b){Ext.fly(d).removeCls("highlight-dashboard-designer-drop")},onNodeOver:function(d,a,c,b){return Ext.dd.DropZone.prototype.dropAllowed},onNodeDrop:Ext.bind(this.ownerCt.onDrop,this.ownerCt)})},onDrop:function(g,a,f,d){var b=d.draggedRecord.get("type"),c=d.draggedRecord.get("paneType");if(b){this.nest(g,d.draggedRecord)}else{if(c){this.updatePaneType(g,d.draggedRecord)}}return true},reset:function(){var b=this.getComponent("dashboard-designer-working-area"),a=b.initialConfig.paneType;b.removeAll(true);b.initialConfig.items=[];if(a){b.el.removeCls(a)}this.tearDownCircularFocus();this.setup()},save:function(){var d=this,a=d.getComponent("dashboard-designer-working-area"),c=a.items.get(0),b;if(c){b=c.initialConfig}else{b={xtype:"container",flex:1,height:"100%",items:[],paneType:a.initialConfig.paneType||"",widgets:d.allWidgets}}delete b.itemId;if(d.dashboardExists){if(!Ext.isIE){d.dashboard.removeAll(true)}d.dashboard.configRecord.set("layoutConfig",b);d.dashboard.configRecord.set("locked",d.locked);d.dashboard.saveToServer(null,null,null,function(){d.dashboardContainer.dashboardStore.load({callback:function(e,f,g){if(g==true){d.dashboardContainer.updateDashboardsFromStore(e,f,g,d.dashboard.getGuid())}},scope:d})})}else{d.dashboard.set("layoutConfig",b);d.dashboard.set("locked",d.locked);d.dashboard.set("stack",null);d.dashboardContainer.saveDashboard(d.dashboard.data,"create",function(){var e=d.dashboard.get("guid");d.dashboardContainer.activateDashboard(e)})}d.cancel()},cancel:function(){Ext.EventManager.removeResizeListener(this.resize,this);this.destroy()},toggleDashboardLock:function(){var d=this,e=this.getComponent("dashboard-designer-side-panel"),c=e.getComponent("dashboard-lock");if(!this.locked){if(!this.dashboardContainer.suppressLockWarning){var b=Ext.widget("alertwindow",{title:Ozone.layout.DialogMessages.dashboardLockTitle,width:500,dashboardContainer:d.dashboardContainer,html:Ozone.layout.DialogMessages.dashboardLockWarning,focusOnClose:c,okText:Ozone.layout.MessageBoxButtonText.yes,okFn:function(){d.locked=true;var f=c.el.down("img");f.set({src:"themes/common/images/dashboard-designer/LockON.png"})},cancelText:Ozone.layout.MessageBoxButtonText.no,cancelFn:function(){}});b.show().setZIndex(this.el.getStyle("z-index")+10)}else{this.locked=true;var a=c.el.down("img");a.set({src:"themes/common/images/dashboard-designer/LockON.png"})}}else{this.locked=false;var a=c.el.down("img");a.set({src:"themes/common/images/dashboard-designer/LockOFF.png"})}},cleanUp:function(){this.dropZone.destroy()}});