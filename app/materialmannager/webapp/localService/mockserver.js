sap.ui.define([
    "sap/ui/core/util/MockServer"
], function(MockServer) {
    "use strict";

    return {
        init: function() {
            // Create mock server
            var oMockServer = new MockServer({
                rootUri: "/odata/v2/catalog/"
            });

            // Configure mock server
            var sLocalUri = sap.ui.require.toUrl("com/cyt/materialmannager/localService");
            oMockServer.simulate(sLocalUri + "/metadata.xml", {
                sMockdataBaseUrl: sLocalUri + "/mockdata",
                bGenerateMissingMockData: true
            });

            // Start mock server
            oMockServer.start();
        }
    };
});