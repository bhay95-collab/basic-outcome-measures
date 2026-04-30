import { I as IAppState } from '../../iAppState-c16602ac.js';
import { I as IExternalMessageProvider } from '../../iExternalMessage.provider-4fdffd26.js';
import { I as IIsncsciAppStoreProvider } from '../../iIsncsciAppStore.provider-d3049fd2.js';
import { I as IDataStore } from '../../iDataStore-7ba6eb0f.js';
import '../../isncsciLevels-ce12763e.js';
import '../../totals-9c85749b.js';
import '../../examData-b9636b53.js';

declare class InputLayoutController {
    private appStoreProvider;
    private externalMessageProvider;
    private inputButtons;
    private classificationTotals;
    private rightGrid;
    private leftGrid;
    private vac;
    private dap;
    private considerNormal;
    private reasonImpairmentNotDueToSci;
    private reasonImpairmentNotDueToSciSpecify;
    private rightLowest;
    private leftLowest;
    private comments;
    private keyMap;
    private cellCommentsDisplay;
    private multipleSelectionToggle;
    private multipleSelectionEnabled;
    constructor(appStore: IDataStore<IAppState>, appStoreProvider: IIsncsciAppStoreProvider, externalMessageProvider: IExternalMessageProvider, inputLayout: HTMLElement, inputButtons: HTMLElement, classificationView: HTMLElement);
    private handleValueInput;
    private inputValue_onKeydown;
    private registerGrids;
    private updateCellView;
    private updateCellViews;
    private updateView;
    private updateGridSelection;
    private updateInputButtons;
    private updateTotals;
    private updateDropdowns;
    private updateExtraInputs;
    private inputValue_onClick;
    private vacDap_onChange;
    private extraInputs_onChange;
    private updateCellCommentsDisplay;
    private stateChanged;
    private grid_onClick;
    private starInput_change;
}

declare class KeyPointDiagramController {
    private keyPointsDiagram;
    constructor(appStore: IDataStore<IAppState>, keyPointsDiagram: HTMLElement);
    private getColor;
    private getKeyPointColor;
    private updateRowKeyPoints;
    private updateKeyPointsDiagram;
    private stateChanged;
}

export { InputLayoutController, KeyPointDiagramController };
