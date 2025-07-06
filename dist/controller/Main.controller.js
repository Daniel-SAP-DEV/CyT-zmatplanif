sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, JSONModel) {
        "use strict";

        return Controller.extend("com.cyt.materialmannager.controller.Main", {
            onInit: function () {
                // Initialize view model
                var oViewModel = new JSONModel({
                    showWineDataPanel: false,
                    materialNumber: "",
                    materialDescription: ""
                });
                this.getView().setModel(oViewModel);
            },

            onSearchMaterial: function () {
                var sMaterialNumber = this.byId("materialNumberInput").getValue();
                
                if (!sMaterialNumber || sMaterialNumber.trim() === "") {
                    MessageToast.show("Por favor ingrese un número de material válido");
                    return;
                }

                // Simulate material search/validation
                this._searchMaterial(sMaterialNumber.trim());
            },

            onMaterialNumberSubmit: function () {
                // Trigger search when Enter is pressed
                this.onSearchMaterial();
            },

            _searchMaterial: function (sMaterialNumber) {
                // Here you would typically call a service to validate the material
                // For now, we'll simulate a successful search with material description
                
                var oViewModel = this.getView().getModel();
                
                // Simulate getting material description from a service
                var sMaterialDescription = this._getMaterialDescription(sMaterialNumber);
                
                oViewModel.setProperty("/materialNumber", sMaterialNumber);
                oViewModel.setProperty("/materialDescription", sMaterialDescription);
                oViewModel.setProperty("/showWineDataPanel", true);
                
                // Hide the material selection panel
                this.byId("materialNumberPanel").setVisible(false);
                
                // Show the wine data panel
                this.byId("wineDataPanel").setVisible(true);
                
                // Clear any previous wine data
                this._clearWineData();
                
                MessageToast.show("Material " + sMaterialNumber + " encontrado. Complete los datos requeridos.");
            },

            _getMaterialDescription: function (sMaterialNumber) {
                // Simulate material description lookup
                // In a real application, this would call a service
                var descriptions = {
                    "12345": "Vino Tinto Reserva Premium",
                    "67890": "Vino Blanco Sauvignon Blanc",
                    "11111": "Vino Rosé Cabernet Franc",
                    "22222": "Vino Espumoso Método Tradicional",
                    "33333": "Vino Tinto Malbec Orgánico"
                };
                
                return descriptions[sMaterialNumber] || "Descripción del material " + sMaterialNumber;
            },

            _clearWineData: function () {
                this.byId("wineQualityInput").setValue("");
                this.byId("productiveClassificationInput").setValue("");
                this.byId("programmerInput").setValue("");
                this.byId("mainBrandInput").setValue("");
                this.byId("baseWineEnologistInput").setValue("");
                this.byId("baseWineComplexityLotInput").setValue("");
                this.byId("baseWineSalesVolumeInput").setValue("");
                this.byId("baseWineColorCombo").setSelectedKey("");
                this.byId("baseWineIdVOEInput").setValue("");
            },

            onSave: function () {
                var oViewModel = this.getView().getModel();
                var sMaterialNumber = oViewModel.getProperty("/materialNumber");

                // Get all input values
                var wineData = {
                    materialNumber: sMaterialNumber,
                    calidadVino: this.byId("wineQualityInput").getValue(),
                    clasificacionProductiva: this.byId("productiveClassificationInput").getValue(),
                    programador: this.byId("programmerInput").getValue(),
                    marcaPrincipal: this.byId("mainBrandInput").getValue(),
                    vinoBaseEnologo: this.byId("baseWineEnologistInput").getValue(),
                    vinoBaseComplejidadLote: this.byId("baseWineComplexityLotInput").getValue(),
                    vinoBaseVolumenVenta: this.byId("baseWineSalesVolumeInput").getValue(),
                    vinoBaseColor: this.byId("baseWineColorCombo").getSelectedKey(),
                    vinoBaseIdVOE: this.byId("baseWineIdVOEInput").getValue()
                };

                // Validate required fields
                if (!this._validateWineData(wineData)) {
                    return;
                }

                // Here you would typically send the data to a service
                console.log("Wine data to save:", wineData);
                MessageToast.show("Datos del material " + sMaterialNumber + " guardados correctamente");
            },

            _validateWineData: function (wineData) {
                var aRequiredFields = [
                    { field: "calidadVino", label: "Calidad del vino" },
                    { field: "clasificacionProductiva", label: "Clasificación productiva" },
                    { field: "programador", label: "Programador" },
                    { field: "marcaPrincipal", label: "Marca principal" }
                ];

                for (var i = 0; i < aRequiredFields.length; i++) {
                    if (!wineData[aRequiredFields[i].field] || wineData[aRequiredFields[i].field].trim() === "") {
                        MessageToast.show("El campo '" + aRequiredFields[i].label + "' es obligatorio");
                        return false;
                    }
                }
                return true;
            },

            onCancel: function () {
                // Clear wine data
                this._clearWineData();
                MessageToast.show("Datos cancelados");
            },

            onNewMaterial: function () {
                // Reset everything to start with a new material
                var oViewModel = this.getView().getModel();
                oViewModel.setProperty("/showWineDataPanel", false);
                oViewModel.setProperty("/materialNumber", "");
                
                // Show the material selection panel again
                this.byId("materialNumberPanel").setVisible(true);
                
                // Hide the wine data panel
                this.byId("wineDataPanel").setVisible(false);
                
                // Clear the material input and wine data
                this.byId("materialNumberInput").setValue("");
                this._clearWineData();
                
                MessageToast.show("Listo para buscar nuevo material");
            }
        });
    });
