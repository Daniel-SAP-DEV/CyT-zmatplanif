sap.ui.define([
    "com/cyt/materialmannager/controller/BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
],
    function (
        BaseController,
        MessageToast,
        JSONModel,
        Fragment
    ) {
        "use strict";

        return BaseController.extend("com.cyt.materialmannager.controller.Main", {

            onInit: function () {
                let oCAPModel = this.getOwnerComponent().getModel('CAP')
                this.getView().byId('SmartTable').getTable().setMode(sap.m.ListMode.MultiSelect)
                this.getView().byId('SmartTable').setModel(oCAPModel)
                this.getView().byId('SmartFilter').setModel(oCAPModel)

            },

            getSeletedData() {
                let oSmartTable = this.getView().byId('SmartTable')
                let oModel = oSmartTable.getModel()
                let oTable = oSmartTable.getTable()
                let sTableType = oTable.getMetadata().getName()
                if (sTableType === 'sap.m.Table') {
                    return oTable.getSelectedItems().map(selectedItem => {
                        return oTable.getModel().getProperty(selectedItem.getBindingContextPath())
                    })
                } else {
                    let aSelectedIndices = oSmartTable.getTable().getSelectedIndices()
                    let aSelectedData = aSelectedIndices.map((i) => {
                        let oContent = oSmartTable.getCellSelectorPluginOwner().getContextByIndex(i)
                        return oModel.getProperty(oContent.sPath)
                    })
                    return aSelectedData
                }
            },

            

            onEdit: async function (oEvent) {
                let aSelectedData = this.getSeletedData()
                if (!aSelectedData?.length) {
                    sap.m.MessageToast.show('Seleccione al menos un elemento para editar')
                    return false
                }
                let oDialog = await this.getEditDialog()
                oDialog.open()

                this.set("/multipleSelection", (aSelectedData?.length > 1));


                var oSystemData = this._getSystemData(aSelectedData[0].material);
                this.set("/materialNumber", aSelectedData[0].material);
                this.set("/materialDescription", aSelectedData[0].description);
                this.set("/wineQuality", oSystemData.wineQuality);
                this.set("/productiveClassification", oSystemData.productiveClassification);
                this.set("/baseWineEnologist", oSystemData.baseWineEnologist);
                this.set("/showWineDataPanel", true);


            },

            _getSystemData: function (sMaterialNumber) {
                // Simulate system data lookup for non-editable fields
                // In a real application, this would call a service
                var systemData = {
                    "12345": {
                        wineQuality: "Premium",
                        productiveClassification: "Clase A - Exportación",
                        baseWineEnologist: "Carlos Mendoza"
                    },
                    "67890": {
                        wineQuality: "Estándar",
                        productiveClassification: "Clase B - Mercado Nacional",
                        baseWineEnologist: "Ana García"
                    },
                    "11111": {
                        wineQuality: "Superior",
                        productiveClassification: "Clase A - Premium",
                        baseWineEnologist: "Roberto Silva"
                    },
                    "22222": {
                        wineQuality: "Ultra Premium",
                        productiveClassification: "Clase AA - Edición Limitada",
                        baseWineEnologist: "María López"
                    },
                    "33333": {
                        wineQuality: "Orgánico",
                        productiveClassification: "Clase A - Certificado Orgánico",
                        baseWineEnologist: "Diego Fernández"
                    }
                };

                return systemData[sMaterialNumber] || {
                    wineQuality: "Estándar",
                    productiveClassification: "Clase B - General",
                    baseWineEnologist: "Enólogo Asignado"
                };
            },

            getEditDialog: function () {
                if (!this._pEditDialog) {
                    let oView = this.getView()
                    this._pEditDialog = Fragment.load({
                        id: oView.getId(),
                        name: this._getName() + ".view.Edit",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        oDialog.attachAfterClose((oEvent) => {
                            oEvent.getSource().destroy();
                            this._pEditDialog = null;
                        });

                        return oDialog;
                    }.bind(this));
                }
                return this._pEditDialog
            },

            onEditClose: async function (params) {
                let oDialog = await this.getEditDialog()
                oDialog.close()
            },



            getDescargaDialog: function () {
                if (!this._pDescargaDialog) {
                    let oView = this.getView()
                    this._pDescargaDialog = Fragment.load({
                        id: oView.getId(),
                        name: this._getName() + ".view.Descarga",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        oDialog.attachAfterClose((oEvent) => {
                            oEvent.getSource().destroy();
                            this._pDescargaDialog = null;
                        });

                        return oDialog;
                    }.bind(this));
                }
                return this._pDescargaDialog
            },

            onDescargaClose: async function (params) {
                let oDialog = await this.getDescargaDialog()
                oDialog.close()
            },

            onDescarga: async function(){
                let oDialog = await this.getDescargaDialog()
                oDialog.open();
            }


        });
    });
