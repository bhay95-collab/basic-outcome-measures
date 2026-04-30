import { B as BinaryObservation, M as MotorLevel } from '../../isncsciLevels-ce12763e.js';
import { C as Cell } from '../../totals-9c85749b.js';
import { E as ExamData } from '../../examData-b9636b53.js';
import { I as IExternalMessageProvider } from '../../iExternalMessage.provider-4fdffd26.js';
import { I as IIsncsciAppStoreProvider } from '../../iIsncsciAppStore.provider-d3049fd2.js';
import { I as IIsncsciExamProvider } from '../../iIsncsciExam.provider-1682d31b.js';

declare const calculateUseCase: (gridModel: Array<Cell | null>[], vac: BinaryObservation | null, dap: BinaryObservation | null, rightLowestNonKeyMuscle: MotorLevel | null, leftLowestNonKeyMuscle: MotorLevel | null, comments: string, appStoreProvider: IIsncsciAppStoreProvider, examProvider: IIsncsciExamProvider, externalMessageProvider: IExternalMessageProvider) => Promise<ExamData | undefined>;

declare const clearExamUseCase: (appStoreProvider: IIsncsciAppStoreProvider, externalMessageProvider: IExternalMessageProvider) => Promise<void>;

declare const initializeAppUseCase: (appStoreProvider: IIsncsciAppStoreProvider) => Promise<void>;

declare const loadExternalExamDataUseCase: (appStoreProvider: IIsncsciAppStoreProvider, examData: ExamData) => Promise<void>;

declare const setActiveCellUseCase: (cellName: string | null, currentActiveCell: Cell | null, selectionMode: 'single' | 'multiple' | 'range', currentCellsSelected: Cell[], gridModel: Array<Cell | null>[], appStoreProvider: IIsncsciAppStoreProvider) => Promise<void>;

declare const setCellsValueUseCase: (value: string, selectedCells: Cell[], gridModel: Array<Cell | null>[], vac: BinaryObservation | null, dap: BinaryObservation | null, rightLowestNonKeyMuscle: MotorLevel | null, leftLowestNonKeyMuscle: MotorLevel | null, comments: string, propagateDown: boolean, appStoreProvider: IIsncsciAppStoreProvider, externalMessageProvider: IExternalMessageProvider) => Promise<{
    updatedCells: Cell[];
}>;

declare const setExtraInputsUseCase: (gridModel: Array<Cell | null>[], vac: BinaryObservation | null, dap: BinaryObservation | null, rightLowestNonKeyMuscleWithMotorFunction: MotorLevel | null, leftLowestNonKeyMuscleWithMotorFunction: MotorLevel | null, comments: string, cellComments: string, appStoreProvider: IIsncsciAppStoreProvider, externalMessageProvider: IExternalMessageProvider) => Promise<void>;

declare const setReadonlyUseCase: (readonly: boolean, appStoreProvider: IIsncsciAppStoreProvider) => void;

declare const setStarDetailsUseCase: (considerNormal: boolean | null, reason: string | null, details: string | null, selectedCells: Cell[], gridModel: Array<Cell | null>[], vac: BinaryObservation | null, dap: BinaryObservation | null, rightLowestNonKeyMuscleWithMotorFunction: MotorLevel | null, leftLowestNonKeyMuscleWithMotorFunction: MotorLevel | null, comments: string, propagateDown: boolean, appStoreProvider: IIsncsciAppStoreProvider, externalMessageProvider: IExternalMessageProvider) => Promise<void>;

declare const setVacDapUseCase: (gridModel: Array<Cell | null>[], vac: BinaryObservation | null, dap: BinaryObservation | null, rightLowestNonKeyMuscle: MotorLevel | null, leftLowestNonKeyMuscle: MotorLevel | null, comments: string, appStoreProvider: IIsncsciAppStoreProvider, externalMessageProvider: IExternalMessageProvider) => Promise<void>;

declare const getNextActiveCellUseCase: (currentCellName: string, gridModel: Array<Cell | null>[]) => string;

export { calculateUseCase, clearExamUseCase, getNextActiveCellUseCase, initializeAppUseCase, loadExternalExamDataUseCase, setActiveCellUseCase, setCellsValueUseCase, setExtraInputsUseCase, setReadonlyUseCase, setStarDetailsUseCase, setVacDapUseCase };
