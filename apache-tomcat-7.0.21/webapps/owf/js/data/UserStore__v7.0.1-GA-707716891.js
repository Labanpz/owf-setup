Ext.namespace("Ozone.data");Ozone.data.UserStore=Ext.extend(Ozone.data.OWFStore,{constructor:function(a){Ozone.data.UserStore.superclass.constructor.call(this,Ext.apply(a,{api:{read:"/user",create:"/user",update:"/user",destroy:"/user"},autoDestroy:true,sortInfo:{field:"userRealName",direction:"ASC"},fields:[{name:"id"},{name:"userRealName"},{name:"email"},{name:"username"},{name:"lastLogin"},{name:"totalWidgets"},{name:"totalGroups"}],listeners:{load:{fn:function(d,c,e){var g=d.getRange();for(var f=0;f<g.length;f++){var b=g[f];b.data.userRealName=Ext.util.Format.htmlEncode(b.data.userRealName);b.data.username=Ext.util.Format.htmlEncode(b.data.username);b.data.email=Ext.util.Format.htmlEncode(b.data.email)}},scope:this}}}))}});Ext.reg("userstore",Ozone.data.UserStore);