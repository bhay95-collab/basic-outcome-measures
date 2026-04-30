import { c as findCell, d as getCellRange, e as getCellPosition, m as motorValueRegex, s as sensoryCellRegex, h as motorCellRegex, i as getExamDataFromGridModel, j as sensoryValueRegex, k as getCellColumn, l as getCellRow } from './examData.helper-51d9ca17.js';
import { cellsMatch } from './core/helpers/index.js';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/*
 * Updates the state's active cell and cell selection through the app store provider.
 * This use case is called when the user clicks on a cell in the grid.
 * When the cell is null, the selection is cleared.
 * When the cell is not null, the selection is updated based on the selection mode.
 * `single` - The cell is the only cell in the selection.
 * `multiple` - The cell is added to the selection.
 * `range` - A range between the new cell and the current active cell is added to the selection.
 *
 * Use case:
 * 1. Get the cell from the grid model.
 * 2. If the selection mode is `single`,
 *  2.1. Set the active cell to the new cell.
 *  2.2. If the cell is not null, set the selection to the new cell, set it to an empty otherwise.
 *  2.3. Stop.
 * 3. If the selection mode is `multiple`,
 *  3.1 If `cell` is null, set `null` as active cell and leave the selection as is and stop.
 *  3.2. If `cell` is already included in the selected cells, remove `cell` from the selection.
 *  3.3. If `cell` is not already included in the selected cells, add the new cell to the selection.
 *  3.4. Stop.
 * 4. If the selection mode is `range`,
 *  4.1. If there is no current active cell or `cell` is null, treat as single selection.
 *  4.2. Produce the range between the active cell and the new cell.
 *  4.3. Replace the existing selection with the new range.
 *  4.4. Stop
 */
const setActiveCellUseCase = (cellName, currentActiveCell, selectionMode, currentCellsSelected, gridModel, appStoreProvider) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Get the cell from the grid model.
    const cell = cellName === null ? null : findCell(cellName, gridModel);
    // 2. If the selection mode is `single`,
    if (selectionMode === 'single') {
        // 2.1. Set the active cell to the new cell.
        // 2.2. If the cell is not null, set the selection to the new cell, set it to an empty otherwise.
        yield appStoreProvider.setActiveCell(cell, cell ? [cell] : []);
        // 2.3 Stop.
        return;
    }
    // 3. If the selection mode is `multiple`,
    if (selectionMode === 'multiple') {
        // 3.1 If `cell` is null, set `null` as active cell and leave the selection as is and stop.
        if (!cell) {
            yield appStoreProvider.setActiveCell(cell, [...currentCellsSelected]);
            return;
        }
        const cellIndex = currentCellsSelected.findIndex((c) => c.name === cell.name);
        // 3.2. If `cell` is already included in the selected cells, remove `cell` from the selection.
        // 3.3. If `cell` is not already included in the selected cells, add the new cell to the selection.
        const selectedCells = cellIndex === -1
            ? [...currentCellsSelected, cell]
            : currentCellsSelected.slice(cellIndex, 1);
        yield appStoreProvider.setActiveCell(cell, selectedCells);
        // 3.4. Stop.
        return;
    }
    // 4. If the selection mode is `range`
    // `range` mode will produce a new selection based on the range between the current active cell and the new cell.
    if (selectionMode === 'range') {
        // 4.1. If there is no current active cell or `cell` is null, treat as single selection.
        if (!currentActiveCell || !cell) {
            yield appStoreProvider.setActiveCell(cell, cell ? [cell] : []);
            return;
        }
        // 4.2. Produce the range between the active cell and the new cell.
        const { motorRange, sensoryRange } = getCellRange(getCellPosition(currentActiveCell.name), getCellPosition(cell.name), gridModel);
        const rangeCells = motorRange.concat(sensoryRange);
        // 4.3. Replace the existing selection with the new range.
        yield appStoreProvider.setActiveCell(cell, rangeCells);
        // 4.4. Stop
        return;
    }
});

/*
 * 1. Test value to make sure it is valid.
 * 2. Determine if an error message needs to be added for values flagged with a star.
 * 3. Check if there is a single cell selected and `propagateDown` is set to `true` - we only propagate down if there is a single cell selected.
 *  3.1. If the selected cell is a sensory cell and the value is a motor value, we stop. Nothing gets updated.
 *  3.2. Get the range of cells to update.
 * 4. If there is more than one cell selected or `propagateDown` is ignored:
 *  4.1. Filter out the sensory cells if the value is a motor only value, add all cells to be updated otherwise.
 * 5. If there are no cells to update, we stop. Nothing gets updated.
 * 6. Call `appStoreProvider.setCellsValue` with the cells to update and the value.
 * 7. Clear the totals and errors
 * 8. Update external listeners
 */
const setCellsValueUseCase = (value, selectedCells, gridModel, vac, dap, rightLowestNonKeyMuscle, leftLowestNonKeyMuscle, comments, propagateDown, appStoreProvider, externalMessageProvider) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Test value to make sure it is valid
    // Motor values are the superset of valid values
    if (!motorValueRegex.test(value)) {
        throw new Error(`Invalid value: ${value}`);
    }
    const isSensoryValue = sensoryValueRegex.test(value);
    let cellsToUpdate = [];
    // 2. Determine if an error message needs to be added for values flagged with a star.
    const starErrorMessage = /\*/.test(value)
        ? 'Please indicate if the value should be considered normal or not normal.'
        : null;
    // 3. Check if there is a single cell selected and `propagateDown` is set to `true` - we only propagate down if there is a single cell selected.
    if (selectedCells.length === 1 && propagateDown) {
        // 3.2. If the selected cell is a sensory cell and the value is not a motor value, we stop. Nothing gets updated.
        if (sensoryCellRegex.test(selectedCells[0].name) && !isSensoryValue) {
            return { updatedCells: [] };
        }
        // 3.3. Get the range of cells to update.
        const { motorRange, sensoryRange } = getCellRange(getCellPosition(selectedCells[0].name), null, gridModel, true);
        cellsToUpdate = motorRange.concat(sensoryRange);
    }
    else {
        // 4. If there is more than one cell selected or `propagateDown` is ignored:
        // 4.1. Filter out the sensory cells if the value is a motor only value, add all cells to be updated otherwise.
        selectedCells.forEach((selectedCell) => {
            if (isSensoryValue || motorCellRegex.test(selectedCell.name)) {
                cellsToUpdate.push(selectedCell);
            }
        });
    }
    // 5. If there are no cells to update, we stop. Nothing gets updated.
    if (cellsToUpdate.length === 0) {
        return { updatedCells: [] };
    }
    try {
        // 6. Call `appStoreProvider.setCellsValue` with the cells to update and the value.
        yield appStoreProvider.setCellsValue(cellsToUpdate, value, value.replace('**', '*'), starErrorMessage, null, null, null);
        // 7. Clear the totals and errors
        yield appStoreProvider.clearTotalsAndErrors();
        // 8. Update external listeners
        const { examData } = getExamDataFromGridModel(gridModel, vac, dap, rightLowestNonKeyMuscle, leftLowestNonKeyMuscle, comments);
        yield externalMessageProvider.sendOutExamData(examData);
    }
    catch (error) {
        console.error('Error setting cells value', error);
    }
    return { updatedCells: cellsToUpdate };
});

const setExtraInputsUseCase = (gridModel, vac, dap, rightLowestNonKeyMuscleWithMotorFunction, leftLowestNonKeyMuscleWithMotorFunction, comments, cellComments, appStoreProvider, externalMessageProvider) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Set extra inputs
    yield appStoreProvider.setExtraInputs(rightLowestNonKeyMuscleWithMotorFunction, leftLowestNonKeyMuscleWithMotorFunction, comments, cellComments);
    // 2. Clear the totals and errors
    yield appStoreProvider.clearTotalsAndErrors();
    // 3. Update external listeners
    const { examData } = getExamDataFromGridModel(gridModel, vac, dap, rightLowestNonKeyMuscleWithMotorFunction, leftLowestNonKeyMuscleWithMotorFunction, comments);
    try {
        yield externalMessageProvider.sendOutExamData(examData);
    }
    catch (error) {
        console.error('Error sending out exam data', error);
    }
});

const getDownPropagationCellRange = (cell, gridModel) => {
    const column = getCellColumn(cell.name);
    let continueDown = true;
    let rowIndex = getCellRow(cell.name) + 1;
    const range = [cell];
    while (continueDown && rowIndex < gridModel.length) {
        const nextCell = gridModel[rowIndex][column];
        rowIndex++;
        if (!nextCell) {
            continue;
        }
        if (cellsMatch(nextCell, cell)) {
            range.push(nextCell);
        }
        else {
            continueDown = false;
        }
    }
    return range;
};
/*
 * 1. Check that at least a cell was selected.
 * 2. Check that the value was flagged with a star.
 * 3. Check if all selected cells have the same value.
 *  3.1. If there are mismatch, we throw an error.
 * 4. Check if there is a single cell selected and `propagateDown` is set to `true` - we only propagate down if there is a single cell selected.
 *    We use the selected cells if a multiple are selected or `propagateDown` is set to `false`.
 * 5. Call `appStoreProvider.setCellsValue` with the selected cells and the values.
 * 6. Clear the totals and errors
 * 7. Update external listeners
 */
const setStarDetailsUseCase = (considerNormal, reason, details, selectedCells, gridModel, vac, dap, rightLowestNonKeyMuscleWithMotorFunction, leftLowestNonKeyMuscleWithMotorFunction, comments, propagateDown, appStoreProvider, externalMessageProvider) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Check that at least a cell was selected.
    if (selectedCells.length === 0) {
        throw new Error('`selectedCells` must contain at least one cell');
    }
    // 2. Check that the value was flagged with a star.
    const referenceCell = selectedCells[0];
    if (!/\*$/.test(referenceCell.value)) {
        throw new Error('In order to indicate impairment not due to an SCI, the cells must be flagged with a star');
    }
    const value = referenceCell.value.replace(/\*/g, '') + (considerNormal ? '**' : '*');
    const label = value.replace('**', '*');
    const error = considerNormal === null
        ? 'Please indicate if the value should be considered normal or not normal.'
        : null;
    // 3. We check if all selected cells have the same value.
    const mismatch = selectedCells.find((selectedCell) => !cellsMatch(selectedCell, referenceCell));
    if (mismatch) {
        // 3.1. If there are mismatch, we throw an error.
        throw new Error('All cells must have the same value, considered normal or not normal, reasonImpairmentNotDueToSci, and reasonImpairmentNotDueToSciSpecify');
    }
    // 4. Check if there is a single cell selected and `propagateDown` is set to `true` - we only propagate down if there is a single cell selected.
    //    We use the selected cells if a multiple are selected or `propagateDown` is set to `false`.
    const range = selectedCells.length === 1 && propagateDown
        ? getDownPropagationCellRange(referenceCell, gridModel)
        : selectedCells.slice();
    // 5. Call `appStoreProvider.setCellsValue` with the selected cells and the values.
    yield appStoreProvider.setCellsValue(range, value, label, error, considerNormal, reason, details);
    try {
        // 6. Clear the totals and errors
        yield appStoreProvider.clearTotalsAndErrors();
        // 7. Update external listeners
        const { examData } = getExamDataFromGridModel(gridModel, vac, dap, rightLowestNonKeyMuscleWithMotorFunction, leftLowestNonKeyMuscleWithMotorFunction, comments);
        yield externalMessageProvider.sendOutExamData(examData);
    }
    catch (error) {
        console.error(error);
    }
});

const setVacDapUseCase = (gridModel, vac, dap, rightLowestNonKeyMuscle, leftLowestNonKeyMuscle, comments, appStoreProvider, externalMessageProvider) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Set VAC and DAP
        yield appStoreProvider.setVacDap(vac, dap);
        // 2. Clear the totals and errors
        yield appStoreProvider.clearTotalsAndErrors();
        // 3. Update external listeners
        const { examData } = getExamDataFromGridModel(gridModel, vac, dap, rightLowestNonKeyMuscle, leftLowestNonKeyMuscle, comments);
        // 4. Update external listeners
        yield externalMessageProvider.sendOutExamData(examData);
    }
    catch (error) {
        console.error('Error setting VAC and DAP', error);
    }
});

/*
 * This use case is responsible for determing the next active cell in the sequence, and called when the application needs to move to the next cell.
 *
 * 1. Get the cell name from the grid model.
 * 2. Find the index of the current cell name in the predefined order.
 * 3. Calculate the index of the next cell.
 * 4. Return the next cell name.
 */
const getNextActiveCellUseCase = (currentCellName, gridModel) => {
    const order = [
        'right-motor-c5',
        'right-motor-c6',
        'right-motor-c7',
        'right-motor-c8',
        'right-motor-t1',
        'right-motor-l2',
        'right-motor-l3',
        'right-motor-l4',
        'right-motor-l5',
        'right-motor-s1',
        'right-light-touch-c2',
        'right-light-touch-c3',
        'right-light-touch-c4',
        'right-light-touch-c5',
        'right-light-touch-c6',
        'right-light-touch-c7',
        'right-light-touch-c8',
        'right-light-touch-t1',
        'right-light-touch-t2',
        'right-light-touch-t3',
        'right-light-touch-t4',
        'right-light-touch-t5',
        'right-light-touch-t6',
        'right-light-touch-t7',
        'right-light-touch-t8',
        'right-light-touch-t9',
        'right-light-touch-t10',
        'right-light-touch-t11',
        'right-light-touch-t12',
        'right-light-touch-l1',
        'right-light-touch-l2',
        'right-light-touch-l3',
        'right-light-touch-l4',
        'right-light-touch-l5',
        'right-light-touch-s1',
        'right-light-touch-s2',
        'right-light-touch-s3',
        'right-light-touch-s4_5',
        'right-pin-prick-c2',
        'right-pin-prick-c3',
        'right-pin-prick-c4',
        'right-pin-prick-c5',
        'right-pin-prick-c6',
        'right-pin-prick-c7',
        'right-pin-prick-c8',
        'right-pin-prick-t1',
        'right-pin-prick-t2',
        'right-pin-prick-t3',
        'right-pin-prick-t4',
        'right-pin-prick-t5',
        'right-pin-prick-t6',
        'right-pin-prick-t7',
        'right-pin-prick-t8',
        'right-pin-prick-t9',
        'right-pin-prick-t10',
        'right-pin-prick-t11',
        'right-pin-prick-t12',
        'right-pin-prick-l1',
        'right-pin-prick-l2',
        'right-pin-prick-l3',
        'right-pin-prick-l4',
        'right-pin-prick-l5',
        'right-pin-prick-s1',
        'right-pin-prick-s2',
        'right-pin-prick-s3',
        'right-pin-prick-s4_5',
        'left-light-touch-c2',
        'left-light-touch-c3',
        'left-light-touch-c4',
        'left-light-touch-c5',
        'left-light-touch-c6',
        'left-light-touch-c7',
        'left-light-touch-c8',
        'left-light-touch-t1',
        'left-light-touch-t2',
        'left-light-touch-t3',
        'left-light-touch-t4',
        'left-light-touch-t5',
        'left-light-touch-t6',
        'left-light-touch-t7',
        'left-light-touch-t8',
        'left-light-touch-t9',
        'left-light-touch-t10',
        'left-light-touch-t11',
        'left-light-touch-t12',
        'left-light-touch-l1',
        'left-light-touch-l2',
        'left-light-touch-l3',
        'left-light-touch-l4',
        'left-light-touch-l5',
        'left-light-touch-s1',
        'left-light-touch-s2',
        'left-light-touch-s3',
        'left-light-touch-s4_5',
        'left-pin-prick-c2',
        'left-pin-prick-c3',
        'left-pin-prick-c4',
        'left-pin-prick-c5',
        'left-pin-prick-c6',
        'left-pin-prick-c7',
        'left-pin-prick-c8',
        'left-pin-prick-t1',
        'left-pin-prick-t2',
        'left-pin-prick-t3',
        'left-pin-prick-t4',
        'left-pin-prick-t5',
        'left-pin-prick-t6',
        'left-pin-prick-t7',
        'left-pin-prick-t8',
        'left-pin-prick-t9',
        'left-pin-prick-t10',
        'left-pin-prick-t11',
        'left-pin-prick-t12',
        'left-pin-prick-l1',
        'left-pin-prick-l2',
        'left-pin-prick-l3',
        'left-pin-prick-l4',
        'left-pin-prick-l5',
        'left-pin-prick-s1',
        'left-pin-prick-s2',
        'left-pin-prick-s3',
        'left-pin-prick-s4_5',
        'left-motor-c5',
        'left-motor-c6',
        'left-motor-c7',
        'left-motor-c8',
        'left-motor-t1',
        'left-motor-l2',
        'left-motor-l3',
        'left-motor-l4',
        'left-motor-l5',
        'left-motor-s1',
    ];
    const currentIndex = order.indexOf(currentCellName);
    if (currentIndex === -1) {
        throw new Error('Current cell name is not in the defined order');
    }
    const nextIndex = (currentIndex + 1) % order.length;
    return order[nextIndex];
};

export { __awaiter as _, setExtraInputsUseCase as a, setActiveCellUseCase as b, setStarDetailsUseCase as c, setCellsValueUseCase as d, getNextActiveCellUseCase as g, setVacDapUseCase as s };
//# sourceMappingURL=getNextActiveCell.useCase-fdf9a1cc.js.map
