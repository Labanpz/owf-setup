Ext.define("Ozone.components.tab.WidgetTab",{extend:"Ozone.components.widget.WidgetPanel",alias:["widget.widgettab","widget.Ozone.components.tab.WidgetTab"],activeCls:"active",onRender:function(){var a=this;a.callParent(arguments);a.el.setStyle("cursor","pointer");a.mon(a.el,{scope:a,click:a.onClick});if(a.active){a.activate(true)}a.keyMap=new Ext.util.KeyMap(a.el,[{key:Ext.EventObject.ENTER,handler:a.onEnterKey,scope:a},{key:Ext.EventObject.DOWN,handler:a.onDown,scope:a}])},onClick:function(a){this.activate()},enable:function(a){var b=this;b.callParent(arguments);b.removeClsWithUI(b.position+"-disabled");return b},disable:function(a){var b=this;b.callParent(arguments);b.addClsWithUI(b.position+"-disabled");return b},onDestroy:function(){var a=this;Ext.destroy(a.keyMap);delete a.keyMap;a.callParent(arguments)},setClosable:function(a){var b=this;a=(!arguments.length||!!a);if(b.closable!=a){b.closable=a;if(b.card){b.card.closable=a}b.syncClosableUI();if(b.rendered){b.syncClosableElements();b.doComponentLayout();if(b.ownerCt){b.ownerCt.doLayout()}}}},setCard:function(a){var b=this;b.card=a;b.setTitle(b.title||a.title)},onCloseClick:function(){var a=this;if(a.fireEvent("beforeclose",a)!==false){a.fireEvent("close",a)}},onEnterKey:function(a,c){var b=this;b.fireEvent("click",this,c)},onDown:function(){this.card.focus(null,null,true,true)},activate:function(b){var a=this;a.active=true;a.addClsWithUI([a.activeCls]);if(b!==true){a.fireEvent("activate",a)}},deactivate:function(b){var a=this;a.active=false;a.removeClsWithUI([a.activeCls]);if(b!==true){a.fireEvent("deactivate",a)}}});