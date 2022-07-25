sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, Fragment, Filter) {
        "use strict";

        return Controller.extend("com.kpmg.fidocpost.controller.View1", {
            onInit: function () {
                this.fromItem = false;
                this.selectedRow = "";
                this.out = [];
                this.backrevertH = [];
                this.backrevertI = [];
                this.vModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(this.vModel,"valueHelp");
                this.headerModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(this.headerModel, "headerModel");
                this.itemModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(this.itemModel, "itemModel");
                this.editModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(this.editModel, "editable");
                var editData = {
                    "headerEditable":false,
                    "itemEditable" : false,
                    "headerEdit":false,
                    "headerEditItem" : false
                    };
                this.editModel.setData(editData);	
                },
    
                onEditH:function(){
                    this.backrevertH = JSON.parse(JSON.stringify(this.headerModel.getData().items));
                    var data =  this.editModel.getData();
                    data.headerEditable = true;
                    data.headerEdit = false;
                    this.editModel.setData(data);
                },
                onEditI:function(){
                    this.backrevertI = JSON.parse(JSON.stringify(this.itemModel.getData().items));
                    var data =  this.editModel.getData();
                    data.itemEditable = true;
                    data.headerEditItem = false;
                    this.editModel.setData(data);
                },
                onCancelH:function(){
                    this.headerModel.setData({
                        items: this.backrevertH
                    });
                    var data =  this.editModel.getData();
                    data.headerEditable = false;
                    data.headerEdit = true;
                    this.editModel.setData(data);
                },
                onCancelI:function(){
                    this.itemModel.setData({
                        items: this.backrevertI
                    });
                    var data =  this.editModel.getData();
                    data.itemEditable = false;
                    data.headerEditItem = true;
                    this.editModel.setData(data);
                },
                onSaveH : function(){
                    var data =  this.editModel.getData();
                    data.headerEditable = false;
                    data.headerEdit = true;
                    this.editModel.setData(data);
                    var headerData =  this.headerModel.getData();
                    var itemData = this.itemModel.getData();
                    for(var i = 0; i < headerData.items.length ; i++){
                        for(var j = 0; j < itemData.items.length ; j++){
                            if( headerData.items[i].Counter == itemData.items[j].Counter){
                                itemData.items[j].Bukrs	= headerData.items[i].Bukrs ;
                                itemData.items[j].BKTXT	= headerData.items[i].BKTXT ;
                                itemData.items[j].XBLNR	= headerData.items[i].XBLNR ;
                                itemData.items[j].BLDAT	= headerData.items[i].BLDAT ;
                                itemData.items[j].BUDAT	= headerData.items[i].BUDAT ;
                                itemData.items[j].BLART = headerData.items[i].BLART ;                                
                            }
                        }
                    }
                    this.itemModel.setData(itemData);
                },
                onSaveI:function(){
                    var data =  this.editModel.getData();
                    data.itemEditable = false;
                    data.headerEditItem = true;
                    this.editModel.setData(data);
                },
                setHeaderEmpty : function(){
                    return {
                        "Bukrs" : "",
                        "BKTXT" : "",
                        "XBLNR" : "",
                        "BLDAT" : "",
                        "BUDAT" : "",
                        "BLART" : "",
                        "Counter":""
                    };
                },
                setHeaderEmptyItem:function(){
                    return {
                        "Bukrs" : "",
                        "BKTXT" : "",
                        "XBLNR" : "",
                        "BLDAT" : "",
                        "BUDAT" : "",
                        "BLART" : "",
                        "Counter":"",
                        "SGTXT" : "",
                        "LIFNR" : "",
                        "KUNNR" : "",
                        "HKONT" : "",
                        "WRBTR_S": "",
                        "WRBTR_H":"",
                        "WAERS":"",
                        "MWSKZ":""

                    };
                },
                onAddHeader:function(){
                    var data = this.headerModel.getData();
                    data.items.push(this.setHeaderEmpty());
                    this.headerModel.setData(data);
                    var table = this.getView().byId("idTable");
                    table.removeSelections();
                },
                addHeaderItem:function(){
                    var data = this.itemModel.getData();
                    data.items.push(this.setHeaderEmptyItem());
                    this.itemModel.setData(data);
                    var table = this.getView().byId("idItemTable");
                    table.removeSelections();
                },
                onDeleteHeader:function(){
                    var table = this.getView().byId("idTable");
                    var path = table.getSelectedContextPaths();
                    var data = this.headerModel.getData();
                    if(path.length <= 0){
                        new sap.m.MessageToast.show("Please select one row!!");
                    }
                    else{
                        for(var i=path.length - 1;i>=0;i--){
                             data.items.splice(path[i].split("items/")[1],1);
                        }
                        this.headerModel.setData(data);
                        table.removeSelections();
                    }
                },
                onDeleteHeaderItem:function(){
                    var table = this.getView().byId("idItemTable");
                    var path = table.getSelectedContextPaths();
                    var data = this.itemModel.getData();
                    if(path.length <= 0){
                        new sap.m.MessageToast.show("Please select one row!!");
                    }
                    else{
                        for(var i=path.length - 1;i>=0;i--){
                             data.items.splice(path[i].split("items/")[1],1);
                        }
                        this.itemModel.setData(data);
                        table.removeSelections();
                    }
                },
                onUpload: function (e) {             
                    this._import(e.getParameter("files") && e.getParameter("files")[0]);
                },
                setDate : function(dateObj){
                    var month = dateObj.getMonth() + 1; //months from 1-12
                    if(month < 10){
                        month = "0"+month;
                    }
                    if(day < 10){
                        day = "0" + day;
                    }
                    var day = dateObj.getDate();
                    var year = dateObj.getFullYear();

                    return day + "/" + month + "/" + year ;
                },

        
                _import: function (file) {
                    var data =  this.editModel.getData();
                    data.headerEdit = true;
                    data.headerEditItem = true;
                    this.editModel.setData(data);
                    var that = this;
                    var excelData = {};
                    if (file && window.FileReader) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            var data = e.target.result;
                            var workbook = XLSX.read(data, {
                                type: 'binary'
                            });
                            workbook.SheetNames.forEach(function (sheetName) {
                                // Here is your object for every sheet in workbook
                                excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        
                            });
                            that.itemModel.setData({
                                items: excelData
                            });
                     /*       for (var b = 0; b < excelData.length; b++) {
                                if(excelData[b].BLDAT == "Today"){
                                excelData[b].BLDAT = that.setDate(new Date());
                                 }else{
                                    excelData[b].BLDAT = that.setDate(new Date(excelData[b].BLDAT));
                                 }
                                 if(excelData[b].BUDAT == "Today"){
                                excelData[b].BUDAT = that.setDate(new Date());
                                }
                                else{
                                    excelData[b].BUDAT = that.setDate(new Date(excelData[b].BUDAT));
                                }
                            }*/
                            that.itemModel.refresh(true);
                            // Setting the data to the local model 
                            
                            for (var i = 0, l = excelData.length; i < l; i++) {
                                var unique = true;
                                for (var j = 0, k = that.out.length; j < k; j++) {
                                    if ((excelData[i].Bukrs === that.out[j].Bukrs) && (excelData[i].BKTXT === that.out[j].BKTXT ) && (excelData[i].XBLNR === that.out[j].XBLNR )
                                    && (excelData[i].BLDAT === that.out[j].BLDAT ) && (excelData[i].BUDAT === that.out[j].BUDAT ) && (excelData[i].BLART === that.out[j].BLART ) ) {
                                        unique = false;
                                    }
                                }
                                if (unique) {
                                    that.out.push(excelData[i]);                             
                                }
                            }
                            that.headerModel.setData({
                                items: that.out
                            });
                            that.headerModel.refresh(true);
                        };
                        reader.onerror = function (ex) {
                            console.log(ex);
                        };
                        reader.readAsBinaryString(file);
                    }
                },
                setDay:function(sDate){
                    if(sDate == "Today"){
                        return new Date();
                    }
                    else{
                        if (sDate && sDate !== null) {
                            return new Date(sDate);
                        } else {
                            return sDate;
                        }
                    }
                },
                onPost:function(){
                    var oModel = this.getView().getModel();
                    oModel.setUseBatch(true);
                    var that = this;
                    this.errorCount = 0;
                    this.counter = 0;
                    
                    var headerData =  this.headerModel.getData();
                    var itemData = this.itemModel.getData();
                    for(var i = 0; i < headerData.items.length ; i++){
                        for(var j = 0; j < itemData.items.length ; j++){
                            if( headerData.items[i].Counter == itemData.items[j].Counter){
                                itemData.items[j].Bukrs	= headerData.items[i].Bukrs ;
                                itemData.items[j].BKTXT	= headerData.items[i].BKTXT ;
                                itemData.items[j].XBLNR	= headerData.items[i].XBLNR ;
                                itemData.items[j].BLDAT	= headerData.items[i].BLDAT ;
                                itemData.items[j].BUDAT	= headerData.items[i].BUDAT ;
                                itemData.items[j].BLART = headerData.items[i].BLART ;                                
                            }
                        }
                    }                        
                    this.itemModel.setData(itemData);
                    
                    
                    for (var i = 0; i < this.itemModel.getData().items.length; i++) {   
                        this.itemModel.getData().items[i].BLDAT = this.setDay(this.itemModel.getData().items[i].BLDAT);
                        this.itemModel.getData().items[i].BUDAT = this.setDay(this.itemModel.getData().items[i].BUDAT);
                        oModel.create("/sendFISet", this.itemModel.getData().items[i], {
                            method: "POST",
                            success: jQuery.proxy(function(oData, response) {
                                //sap.m.MessageBox.alert("success sent!");
                            }, this),
                            error: function(oError) {
                               // sap.m.MessageBox.alert("Error Saving Entries!!");

                               if( JSON.parse(oError.responseText).error.code == '00/001' && that.counter == 0){
                                   for(var i=1;i < JSON.parse(oError.responseText).error.message.value.split("Document").length;i++){
                                    sap.m.MessageBox.success("Document :" + JSON.parse(oError.responseText).error.message.value.split("Document")[i]);
                                   }
                    ;
                                   that.counter = that.counter + 1;
                                   
                               }
                               else if(that.errorCount == 0 && JSON.parse(oError.responseText).error.code != '00/001'){
                                sap.m.MessageBox.error(JSON.parse(oError.responseText).error.message.value);
                                that.errorCount = that.errorCount + 1;
                               }
                               
                            }
                        });
                    }
        
                    oModel.submitChanges({
                        success: function(oData, response) {
                      //      sap.m.MessageBox.success("Success Saving Entries!");
                        },
                        error: function(oError) {
                        //    sap.m.MessageBox.error("Error Saving Entries!!");
                        }
                    });
                },
                onCheck:function(){
                    
                    var headerData =  this.headerModel.getData();
                    var itemData = this.itemModel.getData();
                    for(var i = 0; i < headerData.items.length ; i++){
                        for(var j = 0; j < itemData.items.length ; j++){
                            if( headerData.items[i].Counter == itemData.items[j].Counter){
                                itemData.items[j].Bukrs	= headerData.items[i].Bukrs ;
                                itemData.items[j].BKTXT	= headerData.items[i].BKTXT ;
                                if(headerData.items[i].XBLNR == undefined){
                                    itemData.items[j].XBLNR	="";
                                }
                                else{
                                    itemData.items[j].XBLNR	= headerData.items[i].XBLNR ;
                                }
                                itemData.items[j].BLDAT	= this.setDay(headerData.items[i].BLDAT) ;
                                itemData.items[j].BUDAT	= this.setDay(headerData.items[i].BUDAT) ;
                                itemData.items[j].BLART = headerData.items[i].BLART ;   
                                
                                if(itemData.items[j].SGTXT == undefined){
                                    itemData.items[j].SGTXT	="";
                                }
                                if(itemData.items[j].LIFNR == undefined){
                                    itemData.items[j].LIFNR	="";
                                }                                
                                if(itemData.items[j].KUNNR == undefined){
                                    itemData.items[j].KUNNR	="";
                                }
                                if(itemData.items[j].HKONT == undefined){
                                    itemData.items[j].HKONT	="";
                                }
                                if(itemData.items[j].WRBTR_S == undefined){
                                    itemData.items[j].WRBTR_S	= 0.00;
                                }else{
                                    itemData.items[j].WRBTR_S = new sap.ui.model.odata.type.Decimal().parseValue(itemData.items[j].WRBTR_S, "float");
                                }
                                if(itemData.items[j].WRBTR_H == undefined){
                                    itemData.items[j].WRBTR_H	= 0.00;
                                }else{
                                    itemData.items[j].WRBTR_H = new sap.ui.model.odata.type.Decimal().parseValue(itemData.items[j].WRBTR_H, "float");
                                }
                                if(itemData.items[j].WAERS == undefined){
                                    itemData.items[j].WAERS	="";
                                }
                                if(itemData.items[j].MWSKZ == undefined){
                                    itemData.items[j].MWSKZ	="";
                                }
                                
                            }
                        }
                    }
                    this.itemModel.setData(itemData);
                    var dataSend = [];    
                    var table = this.getView().byId("idItemTable");
                    var path = table.getSelectedContextPaths();
                    var data = this.itemModel.getData();
                    if(path.length <= 0){
                        new sap.m.MessageToast.show("Please select one row!!");
                    }
                    else{
                        for(var i=path.length - 1;i>=0;i--){
                            dataSend.push(data.items[path[i].split("items/")[1]]);
                        }
                    }
                    var x = dataSend.map(function(val) {
                        delete val.Counter;
                        delete val.BKTXT;
                        delete val.BLDAT;
                        delete val.BUDAT;
                        delete val.SGTXT;
                        delete val.WRBTR_H;
                        delete val.WRBTR_S;
                        delete val.MWSKZ;
                      });
                      
                    var oModel = this.getView().getModel();
            /*        oDataModel.callFunction("/TestFunctionImport", {    // function import name
                        method: "POST",                             // http method
                        urlParameters: {"parameter1" : "value1"  }, // function import parameters        
                        sucess: function(oData, response) { },      // callback function for success
                        error: function(oError){ }                  // callback function for error
                    });*/
                    oModel.setDeferredGroups(["batchFunctionImport"]);
                    for (i = 0; i < dataSend.length; i++) {
                        oModel.callFunction("/checkRecord", {                          
                            method: "GET",
                            urlParameters: dataSend[i],
                            batchGroupId: "batchFunctionImport",
                            changeSetId: i,
                        });
                    }


                    //Submitting the function import batch call
                    oModel.submitChanges({
                        batchGroupId: "batchFunctionImport", //Same as the batch group id used previously
                        success: function (oData) {
                            MessageToast.show("Success");
                        }.bind(this),
                        error: function (oError) {
                            MessageToast.show("Error");
                        }
                    });

                    
                },
                handleBukrs:function(oEvent){
                    this.fromItem = false;
                    this.createContent(oEvent,"Bukrs")
                },
                handleLifnr:function(oEvent){
                    this.selectedRow = oEvent.getSource().getId().split("idItemTable-")[1];
                    this.fromItem = true;
                    this.createContent(oEvent,"Lifnr");
                },
                handleHkont:function(oEvent){
                    this.selectedRow = oEvent.getSource().getId().split("idItemTable-")[1];
                    this.fromItem = true;
                    this.createContent(oEvent,"Hkont");
                },
                handleKunnr:function(oEvent){
                    this.selectedRow = oEvent.getSource().getId().split("idItemTable-")[1];
                    this.fromItem = true;
                    this.createContent(oEvent,"Kunnr");
                },
                handleWaers:function(oEvent){
                    this.selectedRow = oEvent.getSource().getId().split("idItemTable-")[1];
                    this.fromItem = true;
                    this.createContent(oEvent,"Waers");
                },
                createContent : function(oEvent,text) {
                    var oView = this.getView();
                    this._sInputId = oEvent.getSource().getId();

                    // create value help dialog
                    if (!this._pValueHelpDialog) {
                        this._pValueHelpDialog = Fragment.load({
                            id: oView.getId(),
                            name: "com.kpmg.fidocpost.fragment.dialog",
                            controller: this
                        }).then(function(oValueHelpDialog){
                            oView.addDependent(oValueHelpDialog);
                            return oValueHelpDialog;
                        });
                    }

		// open value help dialog
                    var dialog = this.getView().byId("dialog");
                    dialog.setTitle(text);
                    this._pValueHelpDialog.then(function(oValueHelpDialog){
                        oValueHelpDialog.open();
                    });
                 },
                 _handleValueHelpSearch : function(oEvent){
                    var oModel = this.getView().getModel();
                    var sValue = oEvent.getParameter("value");
                    var dialog = this.getView().byId("dialog");
                    var sPath = "";
                    var that = this;

                    var itemData = this.itemModel.getData();
                    var headerData = this.itemModel.getData().items;
                    var sBukrs = "";
                    if(this.fromItem == true){
                        if(itemData.items[this.selectedRow].Bukrs == ""){
                            for(var i=0;i<headerData.length();i++){
                                if(itemData.items[this.selectedRow].Counter == headerData[i].Counter && headerData[i].Bukrs !=""){
                                    sBukrs = headerData[i].Bukrs;
                                }
                            }
                        }
                        else{
                            sBukrs = itemData.items[this.selectedRow].Bukrs;
                        }
                    }
                    sPath = "/valueHelpSet";
                    var aFilters = [];
                    if(dialog.getTitle() == "Lifnr"){   
                        var allFilter = new Filter({
                            filters: [
                                new Filter("BUKRS", sap.ui.model.FilterOperator.EQ, sBukrs),
                                new Filter("FIELD", sap.ui.model.FilterOperator.EQ, 'LIFNR'),
                                new Filter("TEXT", sap.ui.model.FilterOperator.EQ, sValue),
                            ],
                            and: true,
                          }) ;                        
                        oModel.read(sPath, { 
                            'filters': [allFilter],
                            success: function(data, response){
                                var jData = data;
                                that.vModel.setData(jData);
                            },
                            error: function(response){
                                MessageToast.show("error"); 
                            }
                            });
                    }else if(dialog.getTitle() == "Bukrs"){
                        var allFilter = new Filter({
                            filters: [
                                new Filter("BUKRS", sap.ui.model.FilterOperator.EQ, ''),
                                new Filter("FIELD", sap.ui.model.FilterOperator.EQ, 'BUKRS'),
                                new Filter("TEXT", sap.ui.model.FilterOperator.EQ, sValue),
                            ],
                            and: true,
                          }) ;                       

                        oModel.read(sPath, { 
                            'filters': [allFilter],
                            success: function(data, response){
                            var jData = data;
                            that.vModel.setData(jData);
                            },
                            error: function(response){
                                MessageToast.show("error"); 
                            }
                            });
                    }else if(dialog.getTitle() == "Hkont"){    
                        var allFilter = new Filter({
                            filters: [
                                new Filter("BUKRS", sap.ui.model.FilterOperator.EQ, sBukrs),
                                new Filter("FIELD", sap.ui.model.FilterOperator.EQ, 'HKONT'),
                                new Filter("TEXT", sap.ui.model.FilterOperator.EQ, sValue),
                            ],
                            and: true,
                          });                   
                        oModel.read(sPath, { 
                            'filters': [allFilter],
                            success: function(data, response){                         
                                var jData = data;
                                that.vModel.setData(jData);
                            },
                            error: function(response){
                                MessageToast.show("error"); 
                            }
                            });
                    }else if(dialog.getTitle() == "Kunnr"){
                        var allFilter = new Filter({
                            filters: [
                                new Filter("BUKRS", sap.ui.model.FilterOperator.EQ, sBukrs),
                                new Filter("FIELD", sap.ui.model.FilterOperator.EQ, 'KUNNR'),
                                new Filter("TEXT", sap.ui.model.FilterOperator.EQ, sValue),
                            ],
                            and: true,
                          });                        
                        oModel.read(sPath, { 
                            'filters': [allFilter],
                            success: function(data, response){
                                var jData = data;
                                that.vModel.setData(jData); 
                            },
                            error: function(response){
                                MessageToast.show("error"); 
                            }
                            });
                    }else if(dialog.getTitle() == "Waers"){
                        var allFilter = new Filter({
                            filters: [
                                new Filter("BUKRS", sap.ui.model.FilterOperator.EQ, sBukrs),
                                new Filter("FIELD", sap.ui.model.FilterOperator.EQ, 'WAERS'),
                                new Filter("TEXT", sap.ui.model.FilterOperator.EQ, sValue),
                            ],
                            and: true,
                          });                        
                        oModel.read(sPath, { 
                            'filters': [allFilter],
                            success: function(data, response){
                                var jData = data;
                                that.vModel.setData(jData);
                            },
                            error: function(response){
                                MessageToast.show("error"); 
                            }
                            });
                    }
                 },
                 _handleValueHelpClose : function(oEvent){
                    var oSelectedItem = oEvent.getParameter("selectedItem");
                    if (oSelectedItem) {
                        var dialog = this.getView().byId("dialog");
                        if(dialog.getTitle() == "Lifnr"){  
                            var data = this.itemModel.getData();
                            data.items[this.selectedRow].LIFNR = oSelectedItem.getDescription();
                            this.itemModel.setData(data);
                        }
                    }
                    var data = {};
                    this.vModel().setData(data);
                 }
        });
    });
