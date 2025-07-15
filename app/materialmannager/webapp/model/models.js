sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
],
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device) {
        "use strict";

        return {
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },

            createGlobalModel: function () {
                var oGDModel = new JSONModel();
                oGDModel.setDefaultBindingMode("TwoWay");
                this.setModel(oGDModel);
                sap.ui.getCore().setModel(oGDModel);
                sap.ui.getCore().setModel(oGDModel, "mGlobal");
            },

            createODataModel: function (sModelName, sServiceUrl) {
                var href;
                try {
                    href = new URL(sServiceUrl).href;
                } catch (e) {
                    href = sServiceUrl;
                }
                var oDataModel = new ODataModel(href);
                this.setModel(oDataModel, sModelName);
                return oDataModel;
            },

            attachRequestFailed: function(oDataModel){
                oDataModel.attachRequestFailed(this.parseError);
            },

            parseError: function(oEvent){
                var oError = oEvent.getParameter("response")
                var sMessage
                try {
                    sMessage = JSON.parse(oError.responseText).error.message.value
                } catch {}
                if (!sMessage && oError.messageoError) sMessage = oError.messageoError.responseText
                if (!sMessage) sMessage = oError.responseText
                
                jQuery.sap.require("sap.m.MessageBox");
                sap.m.MessageBox.show(
                    sMessage,
                    sap.m.MessageBox.Icon.ERROR,
                    oError.message
                );
                
                console.error(oError);
            },

        };
    });