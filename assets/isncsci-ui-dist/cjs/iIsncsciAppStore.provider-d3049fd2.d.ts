import { M as MotorLevel, B as BinaryObservation } from './isncsciLevels-ce12763e.js';
import { C as Cell, T as Totals } from './totals-9c85749b.js';

interface IIsncsciAppStoreProvider {
    clearTotalsAndErrors(): Promise<void>;
    setActiveCell(cell: Cell | null, selectedCells: Cell[]): Promise<void>;
    setCalculationError(error: string): Promise<void>;
    setCellsValue(cells: Cell[], value: string, label: string, error: string | null, considerNormal: boolean | null, reasonImpairmentNotDueToSci: string | null, reasonImpairmentNotDueToSciSpecify: string | null): Promise<void>;
    setExtraInputs(rightLowestNonKeyMuscleWithMotorFunction: MotorLevel | null, leftLowestNonKeyMuscleWithMotorFunction: MotorLevel | null, comments: string, cellComments: string): Promise<void>;
    setGridModel(gridModel: Array<Cell | null>[]): Promise<void>;
    setReadonly(readonly: boolean): Promise<void>;
    setTotals(totals: Totals): Promise<void>;
    setVacDap(vac: BinaryObservation | null, dap: BinaryObservation | null): Promise<void>;
    updateStatus(status: number): Promise<void>;
}

export type { IIsncsciAppStoreProvider as I };
