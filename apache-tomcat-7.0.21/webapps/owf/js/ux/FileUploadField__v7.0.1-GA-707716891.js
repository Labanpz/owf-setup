Ext.form.FileUploadField=Ext.extend(Ext.form.TextField,{buttonText:"Browse...",buttonOnly:false,buttonOffset:3,readOnly:true,autoSize:Ext.emptyFn,initComponent:function(){Ext.form.FileUploadField.superclass.initComponent.call(this);this.addEvents("fileselected")},onRender:function(c,a){Ext.form.FileUploadField.superclass.onRender.call(this,c,a);this.wrap=this.el.wrap({cls:"x-form-field-wrap x-form-file-wrap"});this.el.addCls("x-form-file-text");this.el.dom.removeAttribute("name");this.fileInput=this.wrap.createChild({id:this.getFileInputId(),name:this.name||this.getId(),cls:"x-form-file",tag:"input",type:"file",size:1});var b=Ext.applyIf(this.buttonCfg||{},{text:this.buttonText});this.button=new Ext.Button(Ext.apply(b,{renderTo:this.wrap,cls:"x-form-file-btn"+(b.iconCls?" x-btn-icon":"")}));if(this.buttonOnly){this.el.hide();this.wrap.setWidth(this.button.getEl().getWidth())}this.fileInput.on("change",function(){var d=this.fileInput.dom.value;this.setValue(d);this.fireEvent("fileselected",this,d)},this)},getFileInputId:function(){return this.id+"-file"},onResize:function(a,b){Ext.form.FileUploadField.superclass.onResize.call(this,a,b);this.wrap.setWidth(a);if(!this.buttonOnly){var a=this.wrap.getWidth()-this.button.getEl().getWidth()-this.buttonOffset;this.el.setWidth(a)}},preFocus:Ext.emptyFn,getResizeEl:function(){return this.wrap},getPositionEl:function(){return this.wrap},alignErrorIcon:function(){this.errorIcon.alignTo(this.wrap,"tl-tr",[2,0])}});Ext.reg("fileuploadfield",Ext.form.FileUploadField);