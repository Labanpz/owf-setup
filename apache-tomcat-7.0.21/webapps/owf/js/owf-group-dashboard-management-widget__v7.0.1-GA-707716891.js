Ext.define("Ozone.data.Dashboard",{extend:"Ext.data.Model",idProperty:"guid",fields:["alteredByAdmin","guid",{name:"id",mapping:"guid"},{name:"isdefault",type:"boolean",defaultValue:false},{name:"dashboardPosition",type:"int"},"EDashboardLayoutList","name",{name:"state",defaultValue:[]},"removed","groups","isGroupDashboard","description","createdDate","prettyCreatedDate","editedDate","prettyEditedDate",{name:"stack",defaultValue:null},{name:"locked",type:"boolean",defaultValue:false},{name:"layoutConfig",defaultValue:null},{name:"createdBy",model:"User"},{name:"user",model:"User"}],constructor:function(b,c,a){if(b.layoutConfig&&typeof b.layoutConfig==="string"&&b.layoutConfig!==Object.prototype.toString()){b.layoutConfig=Ext.JSON.decode(b.layoutConfig)}if(b.layoutConfig===Object.prototype.toString()){b.layoutConfig=""}if(!b.guid){b.guid=guid.util.guid()}this.callParent(arguments)}});Ext.define("Ozone.data.stores.AdminDashboardStore",{extend:"Ozone.data.OWFStore",model:"Ozone.data.Dashboard",alias:"store.admindashboardstore",remoteSort:true,totalProperty:"results",sorters:[{property:"dashboardPosition",direction:"ASC"}],constructor:function(a){Ext.applyIf(a,{api:{read:"/dashboard",create:"/dashboard",update:"/dashboard",destroy:"/dashboard"},reader:{root:"data"},writer:{root:"data"}});this.callParent(arguments)},reorder:function(){if(this.getCount()>0){for(var b=0;b<this.getCount();b++){var a=this.getAt(b);a.set("dashboardPosition",b+1)}}}});Ext.define("Ozone.components.admin.grid.DashboardGroupsGrid",{extend:"Ext.grid.Panel",alias:["widget.dashboardgroupsgrid"],quickSearchFields:["name"],plugins:new Ozone.components.focusable.FocusableGridPanel(),cls:"grid-dashboard",defaultPageSize:50,multiSelect:true,forceFit:true,baseParams:null,initComponent:function(){if(this.store==null){this.store=Ext.StoreMgr.lookup({type:"admindashboardstore",pageSize:this.defaultPageSize})}if(this.baseParams){this.setBaseParams(this.baseParams)}Ext.apply(this,{columnLines:true,columns:[{itemId:"guid",header:"GUID",dataIndex:"guid",flex:1,width:210,minWidth:210,sortable:true,hidden:true,renderer:function(f,c,b,g,e,d,a){return'<div class="grid-text">'+f+"</div>"}},{itemId:"name",header:"Dashboard Title",dataIndex:"name",flex:3,minWidth:200,sortable:true,renderer:function(j,b,d,g,e,k,h){var i=j;var a=d.get("EDashboardLayoutList");var c=d.get("layout");var f="grid-dashboard-default-icon-layout";return'<p class="grid-dashboard-title '+f+'">'+Ext.htmlEncode(i)+"</p>"}},{itemId:"groups",header:"Groups",dataIndex:"groups",flex:1,sortable:false,renderer:function(f,c,b,g,e,d,a){return'<div class="grid-text grid-dashboard-group-count">'+f.length+"</div>"}},{itemId:"widgets",header:"Widgets",dataIndex:"layoutConfig",flex:1,sortable:false,renderer:function(g,a,c,e,d,h,f){var b=0;if(g){var i=function(k){if(!k||!k.items){return}if(k.items.length===0){if(k.widgets&&k.widgets.length>0){b+=k.widgets.length}}else{for(var l=0,j=k.items.length;l<j;l++){i(k.items[l])}}return b};b=i(g)}return'<div class="grid-text grid-dashboard-widget-count">'+b+"</div>"}}]});Ext.apply(this,{multiSelect:true,dockedItems:[Ext.create("Ext.toolbar.Paging",{dock:"bottom",store:this.store,displayInfo:true,hidden:this.hidePagingToolbar,itemId:"dashboard-groups-grid-paging"})]});this.callParent(arguments)},getSelectedDashboards:function(){return this.getSelectionModel().getSelection()},load:function(){this.store.loadPage(1)},refresh:function(){this.store.loadPage(this.store.currentPage)},getTopToolbar:function(){return this.getDockedItems('toolbar[dock="top"]')[0]},getBottomToolbar:function(){return this.getDockedItems('toolbar[dock="bottom"]')[0]},applyFilter:function(d,a){this.store.proxy.extraParams=undefined;if(d){var c=[];for(var b=0;b<a.length;b++){c.push({filterField:a[b],filterValue:d})}this.store.proxy.extraParams={filters:Ext.JSON.encode(c),filterOperator:"OR"}}if(this.baseParams){this.setBaseParams(this.baseParams)}this.store.loadPage(1,{params:{offset:0,max:this.store.pageSize}})},clearFilters:function(){this.store.proxy.extraParams=undefined;if(this.baseParams){this.setBaseParams(this.baseParams)}this.store.load({params:{start:0,max:this.store.pageSize}})},setBaseParams:function(a){this.baseParams=a;if(this.store.proxy.extraParams){Ext.apply(this.store.proxy.extraParams,a)}else{this.store.proxy.extraParams=a}},setStore:function(b,c){this.reconfigure(b,c);var a=this.getBottomToolbar();if(a){a.bindStore(b)}}});Ext.define("Ozone.components.admin.dashboard.DashboardDetailPanel",{extend:"Ext.panel.Panel",alias:["widget.dashboarddetailpanel","widget.dashboarddetail"],viewDashboard:null,loadedRecord:null,initComponent:function(){Ext.tip.QuickTipManager.init(true,{dismissDelay:60000,showDelay:2000});this.viewDashboard=Ext.create("Ext.view.View",{store:Ext.create("Ext.data.Store",{storeId:"storeDashboardItem",fields:[{name:"name",type:"string"},{name:"layout",type:"string"},{name:"EDashboardLayoutList",type:"string"},{name:"isGroupDashboard",type:"boolean"},{name:"groups",model:"Group"},{name:"description",type:"string"},{name:"createdDate",type:"string"},{name:"prettyCreatedDate",type:"string"},{name:"editedDate",type:"string"},{name:"prettyEditedDate",type:"string"},{name:"createdBy",model:"User"},{name:"stack",model:"Stack"}]}),deferEmptyText:false,tpl:new Ext.XTemplate('<tpl for=".">','<div class="selector">','<div id="detail-info" class="detail-info">','<div class="dashboard-detail-icon-block">',"{[this.renderIconBlock(values)]}","</div>",'<div class="dashboard-detail-info-block">','<div class="detail-header-block">',"{[this.renderDetailHeaderBlock(values)]}","</div>",'<div class="detail-block">','<div><span class="detail-label">Description:</span> {description:htmlEncode}</span></div><br>','<div><span class="detail-label">Groups:</span> {[this.renderGroups(values)]}</div>','<div><span class="detail-label">Created:</span> <span {createdDate:this.renderToolTip}>{prettyCreatedDate:this.renderDate}</span></div>','<div><span class="detail-label">Author:</span> {[this.renderUserRealName(values)]}</div>','<div><span class="detail-label">Last Modified:</span> <span {editedDate:this.renderToolTip}>{prettyEditedDate:this.renderDate}</span></div>',"</div>","</div>","</div>","</div>","</tpl>",{compiled:true,renderDate:function(a){return a?a:""},renderToolTip:function(a){var b='data-qtip="'+a+'"';return b},renderUserRealName:function(a){var b=a.createdBy;return(b.userRealName?Ext.htmlEncode(b.userRealName):"")},renderGroups:function(c){var b=c.groups;var a=c.stack;var e="";if(!a&&b&&b.length>0){for(var d=-1;++d<b.length;){e+=Ext.htmlEncode(b[d].name)+", "}e=e.substring(0,e.length-2)}return e},renderIconBlock:function(b){var a="dashboard-default-icon-layout";var c='<div class="dashboard-icon '+a+'"></div>';return c},renderDetailHeaderBlock:function(a){var b=a.isGroupDashboard;var d=a.name;var c='<div class="dashboard-title-block">';c+='<div class="dashboard-title detail-title">'+Ext.htmlEncode(d)+"</div>";c+=(b)?"<div>This is a group dashboard.</div>":"";c+="</div>";return c}}),emptyText:"No dashboard selected",itemSelector:"div.selector",autoScroll:"true"});this.items=[this.viewDashboard];this.callParent(arguments)},loadData:function(a){this.viewDashboard.store.loadData([a],false);this.loadedRecord=a},removeData:function(){this.viewDashboard.store.removeAll(false);this.loadedRecord=null}});Ext.define("Ozone.components.admin.dashboard.GroupDashboardManagementPanel",{extend:"Ozone.components.admin.ManagementPanel",alias:["widget.groupdashboardmanagement","widget.groupdashboardmanagementpanel","widget.Ozone.components.admin.GroupDashboardManagementPanel"],layout:"fit",cls:"groupdashboardmanagementpanel",gridDashboards:null,pnlDashboardDetail:null,txtHeading:null,lastAction:null,guid_EditCopyWidget:null,widgetStateHandler:null,dragAndDrop:true,launchesWidgets:true,channel:"AdminChannel",defaultTitle:"Group Dashboards",minButtonWidth:80,detailsAutoOpen:true,initComponent:function(){var a=this;OWF.Preferences.getUserPreference({namespace:"owf.admin.DashboardEditCopy",name:"guid_to_launch",onSuccess:function(b){a.guid_EditCopyWidget=b.value},onFailure:function(b){a.showAlert("Preferences Error","Error looking up Dashboard Editor: "+b)}});this.gridDashboards=Ext.create("Ozone.components.admin.grid.DashboardGroupsGrid",{preventHeader:true,region:"center",border:false});this.gridDashboards.setBaseParams({adminEnabled:true,isGroupDashboard:true,isStackDashboard:false});this.gridDashboards.store.load({params:{offset:0,max:this.pageSize}});this.relayEvents(this.gridDashboards,["datachanged","select","deselect","itemdblclick"]);this.pnlDashboardDetail=Ext.create("Ozone.components.admin.dashboard.DashboardDetailPanel",{layout:{type:"fit",align:"stretch"},region:"east",preventHeader:true,collapseMode:"mini",collapsible:true,collapsed:true,split:true,border:false,width:266});this.txtHeading=Ext.create("Ext.toolbar.TextItem",{text:'<span class="heading-bold">'+this.defaultTitle+"</span>"});this.searchBox=Ext.widget("searchbox");this.items=[{xtype:"panel",layout:"border",border:false,items:[this.gridDashboards,this.pnlDashboardDetail]}];this.dockedItems=[{xtype:"toolbar",dock:"top",layout:{type:"hbox",align:"stretchmax"},items:[this.txtHeading,{xtype:"tbfill"},this.searchBox]},{xtype:"toolbar",dock:"bottom",ui:"footer",defaults:{minWidth:this.minButtonWidth},items:[{xtype:"button",text:"Create",handler:function(c,b){b.stopPropagation();a.doCreate()}},{xtype:"button",text:"Edit",handler:function(){a.doEdit()}},{xtype:"button",text:"Delete",handler:function(b){a.doDelete()}}]}];this.gridDashboards.store.on("load",function(e,c,d){if((this.pnlDashboardDetail!=null)&&(!this.pnlDashboardDetail.collapsed)&&(this.pnlDashboardDetail.loadedRecord!=null)){for(var b=0;b<c.length;b++){if(c[b].id==this.pnlDashboardDetail.loadedRecord.id){this.pnlDashboardDetail.loadData(c[b]);break}}}},this);this.on("datachanged",function(b,c){if(this.pnlDashboardDetail!=null){this.pnlDashboardDetail.collapse();this.pnlDashboardDetail.removeData()}if(!this.disableLaunchMenuRefresh){this.refreshWidgetLaunchMenu()}},this);this.on("select",function(e,b,c,d){this.pnlDashboardDetail.loadData(b);if(this.pnlDashboardDetail.collapsed&&this.detailsAutoOpen){this.pnlDashboardDetail.expand()}},this);this.searchBox.on("searchChanged",function(b,d){var c=this.gridDashboards;if(c){if(!d){this.gridDashboards.clearFilters()}else{this.gridDashboards.applyFilter(d,["name","description"])}}},this);this.on({itemdblclick:{scope:this,fn:this.doEdit}});this.gridDashboards.getView().on({itemkeydown:{scope:this,fn:function(d,c,f,e,b){switch(b.getKey()){case b.SPACE:case b.ENTER:this.doEdit()}}}});this.callParent(arguments);OWF.Eventing.subscribe("AdminChannel",owfdojo.hitch(this,function(b,d,c){if(d.domain==="Dashboard"){this.gridDashboards.getBottomToolbar().doRefresh()}}));this.on("afterrender",function(){var b=this.el.down(".x-collapse-el");b.on("click",function(){var c=this.el.down(".x-splitter-collapsed");if(c){this.detailsAutoOpen=true}else{this.detailsAutoOpen=false}},this)},this)},onLaunchFailed:function(a){if(a.error){this.showAlert("Launch Error","Dashboard Editor Launch Failed: "+a.message)}},doCreate:function(){var a=Ozone.util.toString({copyFlag:false,isCreate:true,isGroupDashboard:true});OWF.Launcher.launch({guid:this.guid_EditCopyWidget,launchOnlyIfClosed:false,data:a},this.onLaunchFailed)},doEdit:function(){var a=this.gridDashboards.getSelectedDashboards();if(a&&a.length>0){for(var b=0;b<a.length;b++){var d=a[b].getId();var c=Ozone.util.toString({id:d,copyFlag:false,isCreate:false,isGroupDashboard:true});OWF.Launcher.launch({title:"$1 - "+a[b].get("name"),titleRegex:/(.*)/,guid:this.guid_EditCopyWidget,launchOnlyIfClosed:false,data:c},this.onLaunchFailed)}}else{this.showAlert("Error","You must select at least one dashboard to edit")}},doDelete:function(){var a=this.gridDashboards.getSelectionModel().getSelection();if(a&&a.length>0){var b="This action will permanently delete ";if(a.length==1){b+='<span class="heading-bold">'+Ext.htmlEncode(a[0].data.name)+"</span>."}else{b+='the selected <span class="heading-bold">'+a.length+" dashboards</span>."}this.showConfirmation("Warning",b,function(e,g,f){if(e=="ok"){var c=this.gridDashboards.getStore();c.remove(a);var d=c.getTotalCount()-a.length;c.on({write:{fn:function(){if(c.data.items.length==0&&c.currentPage>1){var i=c.getPageFromRecordIndex(d-1);var h=(i>=c.currentPage)?c.currentPage:i;c.loadPage(h)}this.gridDashboards.getBottomToolbar().doRefresh();this.pnlDashboardDetail.removeData();if(!this.pnlDashboardDetail.collapsed){this.pnlDashboardDetail.collapse()}this.refreshWidgetLaunchMenu()},scope:this,single:true}});c.save()}})}else{this.showAlert("Error","You must select at least one dashboard to delete")}}});