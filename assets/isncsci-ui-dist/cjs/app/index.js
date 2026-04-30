'use strict';

var core_boundaries_index = require('../core/boundaries/index.js');
var core_useCases_index = require('../core/useCases/index.js');
require('../getNextActiveCell.useCase-3565e781.js');
var examData_helper = require('../examData.helper-43fb7cf8.js');
var app_store_index = require('./store/index.js');
var app_providers_externalMessagePort_provider_index = require('./providers/externalMessagePort.provider/index.js');
var app_controllers_index = require('./controllers/index.js');
require('../core/helpers/index.js');
require('../core/domain/index.js');

class PraxisIsncsciWebApp extends HTMLElement {
    static get is() {
        return 'praxis-isncsci-web-app';
    }
    template() {
        return `
      <style>
        :host {
          background: var(--light-app-surface);
          display: flex;
          flex-direction: column;
        }

        :host([static-height]) ::slotted(praxis-isncsci-app-layout) {
          height: auto;
        }

        ::slotted(praxis-isncsci-app-layout) {
          height: 25rem;
          flex-grow: 1;
        }
      </style>
      <slot></slot>
    `;
    }
    constructor() {
        super();
        this.appLayout = null;
        this.classification = null;
        this.appStore = null;
        this.appStoreProvider = null;
        this.externalMessagePortProvider = new app_providers_externalMessagePort_provider_index.ExternalMessagePortProvider();
        this.isncsciExamProvider = null;
        this.unsubscribeFromStoreHandler = null;
        this.unsubscribeFromExternalPortHandler = null;
        this.unsubscribeFromReadonlyHandler = null;
        this.unsubscribeFromExamDataHandler = null;
        this.unsubscribeFromClassificationStyleHandler = null;
        this.unsubscribeFromClassifyHandler = null;
        this.unsubscribeFromClearExamHandler = null;
        this.ready = false;
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = this.template();
    }
    initialize(appStore, appStoreProvider, isncsciExamProvider) {
        this.appStore = appStore;
        this.appStoreProvider = appStoreProvider;
        this.isncsciExamProvider = isncsciExamProvider;
        this.unsubscribeFromStoreHandler = this.appStore.subscribe((state, actionType) => this.stateChanged(state, actionType));
        this.unsubscribeFromExternalPortHandler =
            this.externalMessagePortProvider.subscribeToOnExternalPort(() => this.externalMessagePortProvider_onExternalPort());
        this.unsubscribeFromReadonlyHandler =
            this.externalMessagePortProvider.subscribeToOnReadonly((readonly) => this.externalMessagePortProvider_onReadonly(readonly));
        this.unsubscribeFromExamDataHandler =
            this.externalMessagePortProvider.subscribeToOnExamData((examData) => this.externalMessagePortProvider_onExamData(examData));
        this.unsubscribeFromClassificationStyleHandler =
            this.externalMessagePortProvider.subscribeToOnStyleAttribute((styleAttribute) => this.externalMessagePortProvider_onStyleAttribute(styleAttribute));
        this.unsubscribeFromClassifyHandler =
            this.externalMessagePortProvider.subscribeToOnClassify(() => this.classify());
        this.unsubscribeFromClearExamHandler =
            this.externalMessagePortProvider.subscribeToOnClearExam(() => this.clearExam());
        this.appLayout = document.querySelector('praxis-isncsci-app-layout');
        // Clear exam button
        const clearExam = document.querySelector('[action-clear-exam]');
        if (clearExam) {
            clearExam.addEventListener('click', () => this.clearExam_onClick());
        }
        // Calculate button
        const calculate = document.querySelector('[action-calculate]');
        if (calculate) {
            calculate.addEventListener('click', () => this.calculate_onClick());
        }
        // Close classification dialog button
        const closeClassification = document.querySelector('[action-close-classification]');
        if (closeClassification) {
            closeClassification.addEventListener('click', () => this.closeClassification_onClick());
        }
        // Input layout
        const inputLayout = document.querySelector('praxis-isncsci-input-layout');
        this.classification = document.querySelector('praxis-isncsci-classification');
        const inputButtons = document.querySelector('praxis-isncsci-input');
        const keyPointsDiagram = document.querySelector('praxis-isncsci-key-points-diagram');
        if (!inputLayout || !this.classification || !inputButtons) {
            throw new Error('The views have not been initialized');
        }
        new app_controllers_index.InputLayoutController(this.appStore, this.appStoreProvider, this.externalMessagePortProvider, inputLayout, inputButtons, this.classification);
        new app_controllers_index.KeyPointDiagramController(this.appStore, keyPointsDiagram);
        core_useCases_index.initializeAppUseCase(this.appStoreProvider);
    }
    disconnectedCallback() {
        if (this.unsubscribeFromStoreHandler) {
            this.unsubscribeFromStoreHandler();
        }
        if (this.unsubscribeFromClassificationStyleHandler) {
            this.unsubscribeFromClassificationStyleHandler();
        }
        if (this.unsubscribeFromExamDataHandler) {
            this.unsubscribeFromExamDataHandler();
        }
        if (this.unsubscribeFromExternalPortHandler) {
            this.unsubscribeFromExternalPortHandler();
        }
        if (this.unsubscribeFromReadonlyHandler) {
            this.unsubscribeFromReadonlyHandler();
        }
        if (this.unsubscribeFromClassifyHandler) {
            this.unsubscribeFromClassifyHandler();
        }
        if (this.unsubscribeFromClearExamHandler) {
            this.unsubscribeFromClearExamHandler();
        }
    }
    closeClassification() {
        if (!this.appLayout) {
            return;
        }
        if (this.appLayout.hasAttribute('classification-style') &&
            this.appLayout.getAttribute('classification-style') !== 'fixed') {
            this.appLayout.removeAttribute('classification-style');
        }
    }
    clearExam_onClick() {
        this.clearExam();
        return false;
    }
    calculate_onClick() {
        this.classify();
        return false;
    }
    clearExam() {
        if (!this.appLayout || !this.classification) {
            return;
        }
        if (!this.appStoreProvider || !this.externalMessagePortProvider) {
            throw new Error('The application store provider, or the external message port provider have not been initialized');
        }
        core_useCases_index.clearExamUseCase(this.appStoreProvider, this.externalMessagePortProvider);
    }
    classify() {
        var _a;
        if (!this.appLayout || !this.classification) {
            return;
        }
        if (!this.appStoreProvider ||
            !this.isncsciExamProvider ||
            !this.externalMessagePortProvider ||
            !this.appStore) {
            throw new Error('The application store provider, the exam provider, the external message port provider, or the app store have not been initialized');
        }
        const state = this.appStore.getState();
        core_useCases_index.calculateUseCase((_a = state.gridModel) !== null && _a !== void 0 ? _a : [], state.vac, state.dap, state.rightLowestNonKeyMuscleWithMotorFunction, state.leftLowestNonKeyMuscleWithMotorFunction, state.comments, this.appStoreProvider, this.isncsciExamProvider, this.externalMessagePortProvider);
        const { calculationError } = this.appStore.getState();
        if (!calculationError) {
            //Show result panel
            if (this.appLayout.getAttribute('classification-style') !== 'fixed') {
                this.appLayout.setAttribute('classification-style', 'visible');
                document.documentElement.style.setProperty('--calc-classification-height', `${this.classification.clientHeight / 16}rem`);
            }
        }
        return false;
    }
    closeClassification_onClick() {
        this.closeClassification();
        return false;
    }
    externalMessagePortProvider_onExternalPort() {
        console.log('An external message port has been registered');
    }
    externalMessagePortProvider_onExamData(examData) {
        if (!this.appStoreProvider) {
            throw new Error('The application store provider has not been initialized');
        }
        this.closeClassification();
        core_useCases_index.loadExternalExamDataUseCase(this.appStoreProvider, examData !== null && examData !== void 0 ? examData : examData_helper.getEmptyExamData());
    }
    externalMessagePortProvider_onReadonly(readonly) {
        if (!this.appStoreProvider) {
            throw new Error('The application store provider has not been initialized');
        }
        core_useCases_index.setReadonlyUseCase(readonly, this.appStoreProvider);
    }
    externalMessagePortProvider_onStyleAttribute(styleAttribute) {
        var _a;
        (_a = this.querySelector('praxis-isncsci-app-layout')) === null || _a === void 0 ? void 0 : _a.setAttribute(styleAttribute, '');
    }
    stateChanged(state, actionType) {
        var _a, _b;
        if (!this.ready && state.status === core_boundaries_index.StatusCodes.Ready) {
            console.log(`The application has been initialized and is ready`);
            this.ready = true;
        }
        if (actionType === app_store_index.Actions.SET_READONLY) {
            if (state.readonly) {
                this.setAttributeNode(document.createAttribute('static-height'));
                (_a = this.appLayout) === null || _a === void 0 ? void 0 : _a.setAttributeNode(document.createAttribute('readonly'));
            }
            else {
                this.removeAttribute('static-height');
                (_b = this.appLayout) === null || _b === void 0 ? void 0 : _b.removeAttribute('readonly');
            }
        }
        if (actionType === app_store_index.Actions.SET_TOTALS ||
            actionType === app_store_index.Actions.CLEAR_TOTALS_AND_ERRORS) {
            if (!state.totals.asiaImpairmentScale) {
                this.closeClassification();
            }
        }
        if (actionType === app_store_index.Actions.SET_CALCULATION_ERROR &&
            state.calculationError) {
            alert(state.calculationError);
        }
    }
}
customElements.define(PraxisIsncsciWebApp.is, PraxisIsncsciWebApp);

exports.PraxisIsncsciWebApp = PraxisIsncsciWebApp;
//# sourceMappingURL=index.js.map
