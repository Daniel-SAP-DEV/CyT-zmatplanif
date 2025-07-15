sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent",
	"sap/m/library",
	"../model/ODataPromise",
], function (
	Controller,
	History,
	UIComponent,
	library,
	ODataPromise,
) {
	"use strict";

	// shortcut for sap.m.URLHelper
	var URLHelper = library.URLHelper;

	return Controller.extend("com.bcyt.materialmannagererriamanager.controller.BaseController", {

		MessageBox: function (sMsg, oProps = {}) {
			// icon: sap.m.MessageBox.Icon.NONE,                    // default
			// title: "",                                           // default
			// actions: sap.m.MessageBox.Action.OK,                 // default
			// emphasizedAction: sap.m.MessageBox.Action.OK,        // default
			// onClose: null,                                       // default
			// styleClass: "",                                      // default
			// initialFocus: null,                                  // default
			// textDirection: sap.ui.core.TextDirection.Inherit,    // default
			// dependentOn: null                                    // default
			let MessageBox = sap.ui.require('sap/m/MessageBox');
			return new Promise(function (fResolve) {
				oProps.onClose = function (oAction) { fResolve(oAction) }
				MessageBox.show(sMsg, oProps)
			})
		},

		waitItemsLoad: function (oControl) {
			oControl.setBusy(true)
			oControl.attachEventOnce("loadItems", function (oEvent) {
				oControl.setBusy(false)
			}.bind(this));
		},

		getODataModel: function () {
			return this.getOwnerComponent().getModel('ZPP_OPSC_SRV');
		},

		getGlobalModel: function () {
			return sap.ui.getCore().getModel()
		},

		oDataProm: function () {
			return this.createODataPromise(this.getODataModel());
		},

		set: function (sProperty, value) {
			if (!sProperty) {
				console.error('Property unknow')
				return
			}
			var oGlobalModel = this.getGlobalModel()
			return oGlobalModel.setProperty(sProperty, value)
		},

		get: function (sProperty) {
			if (!sProperty) {
				console.error('Property unknow')
				return
			}
			var oGlobalModel = this.getGlobalModel()
			return oGlobalModel.getProperty(sProperty)
		},

		onNavBack: function () {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			window.history.go(-1);
		},

		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		setBusy: function (bValue, sView = "appView", delay = 0) {
			if (!this.get("/busy")) this.set("/busy", {})
			this.set("/busy/" + sView, { busy: bValue, delay: delay })
		},

		getText: function (sTextKey, aParams) {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sTextKey, aParams);
		},

		byFragmentId: function (sFragment, sControl) {
			let Fragment = sap.ui.require('sap/ui/core/Fragment');
			return this.byId(Fragment.createId(sFragment, sControl))
		},

		createODataPromise: function (oModel) {
			if (!oModel) return
			return new ODataPromise(oModel);
		},

		_getName: function () {
			var sName = this.getOwnerComponent().getMetadata().getComponentName();
			return sName
		},

		initMessageManager: function (oView) {
			this.oMessageManager = sap.ui.getCore().getMessageManager();
			oView.setModel(this.oMessageManager.getMessageModel(), "message");
			this.oMessageManager.registerObject(oView, true);
		},

		addMsgToMessageManager(text, type) {
			let MessageType = sap.ui.require('sap/ui/core/MessageType');
			let oType = {
				E: MessageType.Error,
				I: MessageType.Information,
				N: MessageType.None,
				S: MessageType.Success,
				W: MessageType.Warning,
			}
			let msgType = oType[type] ? oType[type] : MessageType.None

			var oMessage = new sap.ui.core.message.Message({
				message: text,
				persistent: true, // create message as transition message
				type: msgType
			});
			var oMessageManager = sap.ui.getCore().getMessageManager();
			oMessageManager.addMessages(oMessage);
		},

		_getMessagePopover: function () {
			let Fragment = sap.ui.require('sap/ui/core/Fragment');
			var oView = this.getView();
			if (!this._pMessagePopover) {
				this._pMessagePopover = Fragment.load({
					id: oView.getId(),
					name: this._getName() + ".view.MessagePopover",
				}).then(function (oMessagePopover) {
					oView.addDependent(oMessagePopover);
					return oMessagePopover;
				});
			}
			return this._pMessagePopover;
		},

		onMessagePopoverPress: function (oEvent) {
			var oSourceControl = oEvent.getSource ? oEvent.getSource() : oEvent;
		},

		onlySuccessMessages: function (aMessages) {
			if (!aMessages) aMessages = sap.ui.getCore().getMessageManager().getMessageModel().getData()
			var result = aMessages.filter((elem) => elem.getType() != "Success")
			return result.length == 0

		},

		openMessagePopover: function (onlySucces = false, oControl) {
			if (!oControl) oControl = this.byId('MessagesIndicator')
			if (!oControl) {
				console.error('Control de message popover no encontrado')
				return
			}

			let aMessages = sap.ui.getCore().getMessageManager().getMessageModel().getData()
			if (!this.onlySuccessMessages(aMessages) || onlySucces === false) {
				let fShow = function () {
					this._getMessagePopover().then(function (oMessagePopover) {
						oMessagePopover.openBy(oControl);
					});
				}.bind(this)

				if (sap.ui.getCore().getMessageManager().getMessageModel().getData().length) {
					setTimeout(fShow, 10);
				}
			}
		},

		toggleMessagePopover: function (oEvent) {
			var oSourceControl = oEvent.getSource ? oEvent.getSource() : oEvent;
			this._getMessagePopover().then(function (oMessagePopover) {
				if (oMessagePopover.isOpen()) {
					oMessagePopover.close()
				} else {
					oMessagePopover.openBy(oSourceControl)
				}
			});
		},

		multiInputValidator: function (args) {
			var text = args.text;
			return new sap.m.Token({
				key: text,
				text: text
			});
		},

		removeDuplicates: function (arr) {
			return arr.filter((item,
				index) => arr.indexOf(item) === index);
		},

		getBase64: function (file) {
			var reader = new FileReader();
			return new Promise((resolve, reject) => {
				if (file.base64) {
					resolve({
						base64: file.base64,
						file: {
							name: file.fileName
						}
					})
					return
				}
				reader.readAsDataURL(file);
				reader.onload = function (theFile) {
					let base64_marker = ";base64,"
					let fileContent = reader.result;
					let base64index = fileContent.indexOf(base64_marker);
					let base64 = base64_marker + fileContent.substring(base64index + base64_marker.length).match(/.{1,76}/g).join("\n");
					resolve({ file, base64 })
				};
				reader.onerror = function (error) {
					reject(error)
				};
				reader.onabort = function (error) {
					reject(error)
				};
			})
		},

		handleFullScreen: function () {
			this.set("/UIState/prevLayout", this.get("/UIState/layout"))
			let targetControlAggregation = this.get('/TargetControlAggregation')
			let layout
			let showExpandContract = false
			switch (targetControlAggregation) {
				case 'midColumnPages':
					layout = 'MidColumnFullScreen'
					showExpandContract = true
					break;
				case 'endColumnPages':
					layout = 'EndColumnFullScreen'
					showExpandContract = true
					break;
				default:
					layout = 'OneColumn'
					break;
			}
			this.set("/UIState/layout", layout);
			this.set("/UIState/showExpandContract", showExpandContract);
		},

		handleExitFullScreen: function () {
			this.set("/UIState/layout", this.get("/UIState/prevLayout"));
		},


		openPersoDialog: function (oEvent, oTableBinding) {
			let oTable = this.get(oTableBinding)
			oTable.p13n.openPersoDialog(oEvent, oTable)
		},
		beforeOpenColumnMenu: function (oEvent, oTableBinding) {
			let oTable = this.get(oTableBinding)
			oTable.p13n.beforeOpenColumnMenu(oEvent, oTable)
		},
		onColumnHeaderItemPress: function (oEvent, oTableBinding) {
			let oTable = this.get(oTableBinding)
			oTable.p13n.onColumnHeaderItemPress(oEvent, oTable)
		},
		onFilterInfoPress: function (oEvent, oTableBinding) {
			let oTable = this.get(oTableBinding)
			oTable.p13n.onFilterInfoPress(oEvent, oTable)
		},
		onClearFilterPress: function (oEvent, oTableBinding) {
			let oTable = this.get(oTableBinding)
			oTable.p13n.onClearFilterPress(oEvent, oTable)
		},
		onSort: function (oEvent, oTableBinding) {
			let oTable = this.get(oTableBinding)
			oTable.p13n.onSort(oEvent, oTable)
		},
		onGroup: function (oEvent, oTableBinding) {
			let oTable = this.get(oTableBinding)
			oTable.p13n.onGroup(oEvent, oTable)
		},
		onColumnMove: function (oEvent, oTableBinding) {
			let oTable = this.get(oTableBinding)
			oTable.p13n.onColumnMove(oEvent, oTable)
		},

		addMessagesFromAction: function (error) {
			try {
				const oResponseText = JSON.parse(error?.responseText || '{}');
				const aErrorDetails = oResponseText?.error?.innererror?.errordetails;

				if (!Array.isArray(aErrorDetails)) {
					return;
				}
				let aMessages = aErrorDetails.map(e => e.message || 'Error sin mensaje');
				aMessages = this.removeDuplicates(aMessages);

				aMessages.forEach(sMsg => {
					this.addMsgToMessageManager(sMsg, 'E');
				});
			} catch (err) {
				console.error(err);
			}
		},

		waitForSmartTableInitialised: function (oSmartTable) {
			return new Promise(resolve => {
				if (oSmartTable.isInitialised()) {
					resolve();
				} else {
					oSmartTable.attachInitialise(function () {
						resolve();
					});
				}
			});
		},
	});

});