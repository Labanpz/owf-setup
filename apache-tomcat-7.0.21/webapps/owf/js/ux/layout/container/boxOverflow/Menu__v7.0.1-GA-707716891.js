Ext.define("Ozone.ux.layout.container.boxOverflow.Menu",{extend:"Ext.layout.container.boxOverflow.Menu",alternateClassName:"Ext.layout.container.boxOverflow.StyleableMenu",createMenu:function(a,c){var k=this,h=k.layout,l=h.parallelBefore,e=h.parallelPrefix,b=c[e],g=a.boxes,d=0,j=g.length,f;if(!k.menuTrigger){k.createInnerElements();k.menu=Ext.create("Ext.menu.Menu",{componentCls:k.componentCls?k.componentCls:"widgetmenubar",listeners:{scope:k,beforeshow:k.beforeMenuShow}});k.menuTrigger=Ext.create("Ext.button.Button",{ownerCt:k.layout.owner,iconCls:k.layout.owner.menuTriggerCls,ui:h.owner instanceof Ext.toolbar.Toolbar?"default-toolbar":"default",menu:k.menu,getSplitCls:function(){return""},renderTo:k.afterCt})}k.showTrigger();b-=k.afterCt.getWidth();k.menuItems.length=0;for(;d<j;d++){f=g[d];if(f[l]+f[e]>b){k.menuItems.push(f.component);f.component.hide()}}}});