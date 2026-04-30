import { I as IAppState } from '../iAppState-c16602ac.js';
import { I as IIsncsciAppStoreProvider } from '../iIsncsciAppStore.provider-d3049fd2.js';
import { I as IIsncsciExamProvider } from '../iIsncsciExam.provider-1682d31b.js';
import { I as IDataStore } from '../iDataStore-7ba6eb0f.js';
import '../isncsciLevels-ce12763e.js';
import '../totals-9c85749b.js';
import '../examData-b9636b53.js';

declare class PraxisIsncsciWebApp extends HTMLElement {
    static get is(): string;
    private template;
    private appLayout;
    private classification;
    private appStore;
    private appStoreProvider;
    private externalMessagePortProvider;
    private isncsciExamProvider;
    private unsubscribeFromStoreHandler;
    private unsubscribeFromExternalPortHandler;
    private unsubscribeFromReadonlyHandler;
    private unsubscribeFromExamDataHandler;
    private unsubscribeFromClassificationStyleHandler;
    private unsubscribeFromClassifyHandler;
    private unsubscribeFromClearExamHandler;
    private ready;
    constructor();
    initialize(appStore: IDataStore<IAppState>, appStoreProvider: IIsncsciAppStoreProvider, isncsciExamProvider: IIsncsciExamProvider): void;
    disconnectedCallback(): void;
    private closeClassification;
    private clearExam_onClick;
    private calculate_onClick;
    private clearExam;
    private classify;
    private closeClassification_onClick;
    private externalMessagePortProvider_onExternalPort;
    private externalMessagePortProvider_onExamData;
    private externalMessagePortProvider_onReadonly;
    private externalMessagePortProvider_onStyleAttribute;
    private stateChanged;
}

export { PraxisIsncsciWebApp };
