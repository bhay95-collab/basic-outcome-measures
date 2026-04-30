import { I as IAppState } from '../../iAppState-c16602ac.js';
import { M as MotorLevel, B as BinaryObservation } from '../../isncsciLevels-ce12763e.js';
import { C as Cell, T as Totals } from '../../totals-9c85749b.js';
import { I as IIsncsciAppStoreProvider } from '../../iIsncsciAppStore.provider-d3049fd2.js';
import { I as IDataStore } from '../../iDataStore-7ba6eb0f.js';
export { ExternalMessagePortProvider, ExternalMessagePortProviderActions } from './externalMessagePort.provider/index.js';
import { E as ExamData } from '../../examData-b9636b53.js';
import { I as IIsncsciExamProvider } from '../../iIsncsciExam.provider-1682d31b.js';
import '../../iExternalMessage.provider-4fdffd26.js';

declare class AppStoreProvider implements IIsncsciAppStoreProvider {
    private appStore;
    constructor(appStore: IDataStore<IAppState>);
    clearTotalsAndErrors(): Promise<void>;
    setActiveCell(cell: Cell | null, selectedCells: Cell[]): Promise<void>;
    setCalculationError(error: string): Promise<void>;
    setCellsValue(cellsToUpdate: Cell[], value: string, label: string, error: string | null, considerNormal: boolean | null, reasonImpairmentNotDueToSci: string | null, reasonImpairmentNotDueToSciSpecify: string | null): Promise<void>;
    setExtraInputs(rightLowestNonKeyMuscleWithMotorFunction: MotorLevel | null, leftLowestNonKeyMuscleWithMotorFunction: MotorLevel | null, comments: string, cellComments: string): Promise<void>;
    setGridModel(gridModel: Array<any>): Promise<void>;
    setReadonly(readonly: boolean): Promise<void>;
    setTotals(totals: Totals): Promise<void>;
    setVacDap(vac: BinaryObservation | null, dap: BinaryObservation | null): Promise<void>;
    updateStatus(status: number): Promise<void>;
}

declare class IsncsciExamProvider implements IIsncsciExamProvider {
    private bindExamDataToExam;
    calculate(examData: ExamData): Promise<{
        asiaImpairmentScale: string;
        injuryComplete: string;
        leftLightTouchTotal: string;
        leftLowerMotorTotal: string;
        leftMotor: string;
        leftMotorTotal: string;
        leftMotorZpp: string;
        leftPinPrickTotal: string;
        leftSensory: string;
        leftSensoryZpp: string;
        leftUpperMotorTotal: string;
        lightTouchTotal: string;
        lowerMotorTotal: string;
        neurologicalLevelOfInjury: string;
        pinPrickTotal: string;
        rightLightTouchTotal: string;
        rightLowerMotorTotal: string;
        rightMotor: string;
        rightMotorTotal: string;
        rightMotorZpp: string;
        rightPinPrickTotal: string;
        rightSensory: string;
        rightSensoryZpp: string;
        rightUpperMotorTotal: string;
        upperMotorTotal: string;
    }>;
}

export { AppStoreProvider, IsncsciExamProvider };
