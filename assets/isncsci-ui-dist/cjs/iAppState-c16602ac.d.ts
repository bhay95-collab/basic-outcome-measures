import { B as BinaryObservation, M as MotorLevel } from './isncsciLevels-ce12763e.js';
import { C as Cell, T as Totals } from './totals-9c85749b.js';

declare class StatusCodes {
    static Initializing: number;
    static NotInitialized: number;
    static Ready: number;
}
interface IAppState {
    activeCell: Cell | null;
    calculationError: string;
    comments: string;
    dap: BinaryObservation | null;
    gridModel: Array<Cell | null>[];
    leftLowestNonKeyMuscleWithMotorFunction: MotorLevel | null;
    rightLowestNonKeyMuscleWithMotorFunction: MotorLevel | null;
    readonly: boolean;
    selectedPoint: string | null;
    selectedCells: Cell[];
    status: number;
    totals: Totals;
    updatedCells: Cell[];
    vac: BinaryObservation | null;
}

export { type IAppState as I, StatusCodes as S };
