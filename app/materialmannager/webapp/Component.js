/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "com/cyt/materialmannager/model/models",
    "sap/ui/fl/FakeLrepConnectorLocalStorage",
    "sap/f/library",
    "sap/f/FlexibleColumnLayoutSemanticHelper",
    "com/cyt/materialmannager/localService/mockserver"
],
    function (
        UIComponent,
        Device,
        models,
        FakeLrepConnectorLocalStorage,
        library,
        FlexibleColumnLayoutSemanticHelper,
        mockserver
    ) {
        "use strict";

        var LayoutType = library.LayoutType;

        return UIComponent.extend("com.cyt.materialmannager.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {

                // Initialize mock server only if not already initialized
                if (!window.mockServerInitialized) {
                    mockserver.init();
                    window.mockServerInitialized = true;
                }


                // if (!(sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("Personalization"))) {
                if (!(sap.ushell && sap.ushell.Container)) {
                    FakeLrepConnectorLocalStorage.enableFakeConnector();
                }

                models.createGlobalModel.call(this);

                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            },

            getHelper: function () {
                var oFCL = this.getRootControl().byId("app"),
                    oParams = new URLSearchParams(window.location.search),
                    oSettings = {
                        defaultTwoColumnLayoutType: LayoutType.TwoColumnsMidExpanded,
                        defaultThreeColumnLayoutType: LayoutType.ThreeColumnsMidExpanded,
                        mode: oParams.get("mode"),
                        initialColumnsCount: oParams.get("initial"),
                        maxColumnsCount: oParams.get("max")
                    };

                return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
            }

        });
    }
);