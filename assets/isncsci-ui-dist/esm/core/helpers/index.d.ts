import { C as Cell, T as Totals } from '../../totals-9c85749b.js';
import { B as BinaryObservation, M as MotorLevel } from '../../isncsciLevels-ce12763e.js';
import { E as ExamData } from '../../examData-b9636b53.js';

declare const cellsMatch: (a: Cell, b: Cell) => boolean;

/**
 * Does not check for missing values as we could be getting incomplete forms from 3rd party sources
 * @param examData
 * @returns
 */
declare const validateExamData: (examData: ExamData) => string[];
declare const bindExamDataToGridModel: (examData: ExamData) => (Cell | null)[][];
declare const bindExamDataToTotals: (examData: ExamData) => Totals;
declare const getExamDataFromGridModel: (gridModel: Array<Cell | null>[], voluntaryAnalContraction: BinaryObservation | null, deepAnalPressure: BinaryObservation | null, rightLowestNonKeyMuscleWithMotorFunction: MotorLevel | null, leftLowestNonKeyMuscleWithMotorFunction: MotorLevel | null, comments: string | null) => {
    examData: ExamData;
    missingValues: string[];
};
declare const findCell: (cellName: string, gridModel: Array<Cell | null>[]) => Cell;
declare const getCellColumn: (cellName: string) => 2 | 0 | 1 | 3 | 4 | 5;
declare const getCellRow: (cellName: string) => number;
declare const getCellPosition: (cellName: string) => {
    column: number;
    row: number;
};
declare const getCellRange: (start: {
    column: number;
    row: number;
}, end: {
    column: number;
    row: number;
} | null, gridModel: Array<Cell | null>[], stopAtCellWithValue?: boolean) => {
    motorRange: Cell[];
    sensoryRange: Cell[];
};
declare const getEmptyExamData: () => ExamData;
declare const getExamDataWithAllNormalValues: () => ExamData;
declare const getCellComments: (gridModel: Array<(Cell | null)[]>) => string;

declare const validCellNameRegex: RegExp;
declare const lightTouchCellRegex: RegExp;
declare const pinPrickCellRegex: RegExp;
declare const sensoryCellRegex: RegExp;
declare const motorCellRegex: RegExp;
declare const cellLevelRegex: RegExp;
declare const motorValueRegex: RegExp;
declare const sensoryValueRegex: RegExp;
declare const levelNameRegex: RegExp;

export { bindExamDataToGridModel, bindExamDataToTotals, cellLevelRegex, cellsMatch, findCell, getCellColumn, getCellComments, getCellPosition, getCellRange, getCellRow, getEmptyExamData, getExamDataFromGridModel, getExamDataWithAllNormalValues, levelNameRegex, lightTouchCellRegex, motorCellRegex, motorValueRegex, pinPrickCellRegex, sensoryCellRegex, sensoryValueRegex, validCellNameRegex, validateExamData };
