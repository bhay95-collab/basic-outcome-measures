import { _ as __awaiter, s as setVacDapUseCase, a as setExtraInputsUseCase, b as setActiveCellUseCase, c as setStarDetailsUseCase, d as setCellsValueUseCase, g as getNextActiveCellUseCase } from '../../getNextActiveCell.useCase-fdf9a1cc.js';
import { appStore, Actions } from '../store/index.js';
import { cellsMatch } from '../../core/helpers/index.js';
import { s as sensoryCellRegex, n as getCellComments, o as levelNameRegex } from '../../examData.helper-51d9ca17.js';
import '../../core/boundaries/index.js';
import '../../core/domain/index.js';

const allCellsHaveSameValues = (selectedCells) => {
    if (selectedCells.length === 0) {
        return false;
    }
    const firstCell = selectedCells[0];
    return selectedCells.every((cell) => cellsMatch(cell, firstCell));
};
class InputLayoutController {
    constructor(appStore, appStoreProvider, externalMessageProvider, inputLayout, inputButtons, classificationView) {
        var _a;
        this.appStoreProvider = appStoreProvider;
        this.externalMessageProvider = externalMessageProvider;
        this.inputButtons = inputButtons;
        this.classificationTotals = [];
        this.rightGrid = null;
        this.leftGrid = null;
        this.vac = null;
        this.dap = null;
        this.considerNormal = null;
        this.reasonImpairmentNotDueToSci = null;
        this.reasonImpairmentNotDueToSciSpecify = null;
        this.rightLowest = null;
        this.leftLowest = null;
        this.comments = null;
        this.keyMap = {};
        this.cellCommentsDisplay = null;
        this.multipleSelectionToggle = null;
        this.multipleSelectionEnabled = false;
        if (!inputLayout.shadowRoot) {
            throw new Error('The input layout has not been initialized');
        }
        if (!classificationView.shadowRoot) {
            throw new Error('The totals have not been initialized');
        }
        this.cellCommentsDisplay = inputLayout.querySelector('#cell-comments-display');
        this.classificationTotals = Array.from(classificationView.querySelectorAll('[data-total]'));
        this.registerGrids(inputLayout.shadowRoot.querySelectorAll('praxis-isncsci-grid'));
        // - Input Buttons --------------
        // [ToDo: Extract this section into its own controller]
        this.inputButtons.addEventListener('value_click', (e) => this.inputValue_onClick(e));
        this.considerNormal = this.inputButtons.querySelector('#consider-normal');
        this.reasonImpairmentNotDueToSci = this.inputButtons.querySelector('#reason-for-impairment-not-due-to-sci');
        this.reasonImpairmentNotDueToSciSpecify = this.inputButtons.querySelector('#reason-for-impairment-not-due-to-sci-specify');
        if (!this.considerNormal ||
            !this.reasonImpairmentNotDueToSci ||
            !this.reasonImpairmentNotDueToSciSpecify) {
            throw new Error('The input buttons for consider normal, reason for impairment not due to sci and reason for impairment not due to sci specify have not been initialized');
        }
        this.considerNormal.addEventListener('change', (e) => this.starInput_change(e));
        this.reasonImpairmentNotDueToSci.addEventListener('change', (e) => this.starInput_change(e));
        this.reasonImpairmentNotDueToSciSpecify.addEventListener('change', (e) => this.starInput_change(e));
        // - VAC & DAP ------------------
        this.vac = inputLayout.querySelector('#vac');
        this.dap = inputLayout.querySelector('#dap');
        // VAC & DAP
        if (!this.vac || !this.dap) {
            throw new Error('The input buttons for VAC and DAP have not been initialized');
        }
        this.vac.addEventListener('change', () => this.vacDap_onChange());
        this.dap.addEventListener('change', () => this.vacDap_onChange());
        // Extra inputs - Right and left lowest non-key muscle with motor function and comments
        this.rightLowest = inputLayout.querySelector('#right-lowest');
        this.leftLowest = inputLayout.querySelector('#left-lowest');
        this.comments = inputLayout.querySelector('#comments');
        if (!this.rightLowest || !this.leftLowest || !this.comments) {
            throw new Error('The input buttons for right and left lowest non-key muscle with motor function and comments have not been initialized');
        }
        this.rightLowest.addEventListener('change', () => this.extraInputs_onChange());
        this.leftLowest.addEventListener('change', () => this.extraInputs_onChange());
        this.comments.addEventListener('change', () => this.extraInputs_onChange());
        // Subscribe to the application's store
        appStore.subscribe((state, actionType) => this.stateChanged(state, actionType));
        // Enable keyboard entry
        document.addEventListener('keydown', (e) => {
            this.inputValue_onKeydown(e);
        });
        this.keyMap['0'] = '0';
        this.keyMap['1'] = '1';
        this.keyMap['2'] = '2';
        this.keyMap['3'] = '3';
        this.keyMap['4'] = '4';
        this.keyMap['5'] = '5';
        this.keyMap['n'] = 'NT';
        this.keyMap['u'] = 'UNK';
        this.keyMap[')'] = '0*';
        this.keyMap['!'] = '1*';
        this.keyMap['@'] = '2*';
        this.keyMap['#'] = '3*';
        this.keyMap['$'] = '4*';
        this.keyMap['N'] = 'NT*';
        this.keyMap['Delete'] = '';
        this.keyMap['Backspace'] = '';
        // Initialize the multiple selection toggle
        //this.multipleSelectionToggle = document.querySelector('#multiple-selection-toggle') as HTMLInputElement;
        this.multipleSelectionToggle = (_a = this.inputButtons.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('#multiple-selection-toggle');
        if (this.multipleSelectionToggle) {
            this.multipleSelectionEnabled = this.multipleSelectionToggle.checked; // Initialize state
            this.multipleSelectionToggle.addEventListener('change', () => {
                this.multipleSelectionEnabled = this.multipleSelectionToggle.checked;
                if (!this.multipleSelectionEnabled) {
                    // Clear existing selection when toggle is turned off
                    this.appStoreProvider.setActiveCell(null, []);
                }
            });
        }
    }
    handleValueInput(value) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = appStore.getState();
            if (!state.activeCell) {
                return;
            }
            const propagateDown = true;
            const result = yield setCellsValueUseCase(value, state.selectedCells.slice(), state.gridModel.slice(), state.vac, state.dap, state.rightLowestNonKeyMuscleWithMotorFunction, state.leftLowestNonKeyMuscleWithMotorFunction, state.comments, propagateDown, this.appStoreProvider, this.externalMessageProvider);
            const isStar = /\*$/.test(value);
            if (result.updatedCells.length > 1) {
                if (!isStar) {
                    // values were propagated down then clear the selection
                    this.appStoreProvider.setActiveCell(null, []);
                }
            }
            else if (state.selectedCells.length > 1) {
                if (!isStar) {
                    // clear selection after entering values into selected range
                    this.appStoreProvider.setActiveCell(null, []);
                }
                //keeps selection if star value
            }
            else {
                if (!isStar) {
                    // moving to next cell if a single cell is selected - no star values
                    const nextActiveCell = getNextActiveCellUseCase(state.activeCell.name, state.gridModel);
                    setActiveCellUseCase(nextActiveCell, state.activeCell, 'single', state.selectedCells, state.gridModel.slice(), this.appStoreProvider);
                }
            }
        });
    }
    inputValue_onKeydown(e) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            //Check for non textbox input
            if (e.target instanceof HTMLTextAreaElement
                || e.target instanceof HTMLInputElement) {
                return;
            }
            //Check for there are at least 1 enabled button for input
            const inputs = (_b = (_a = this.inputButtons.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelectorAll('button:not([disabled])')) !== null && _b !== void 0 ? _b : [];
            if (!inputs || inputs.length === 0) {
                return;
            }
            //Check for valid value
            const validValues = Array.from(inputs).map((i) => i.value);
            validValues.push('');
            const value = this.keyMap[e.key];
            if ((!value && value !== '') || !validValues.includes(value)) {
                return;
            }
            yield this.handleValueInput(value);
        });
    }
    registerGrids(grids) {
        grids.forEach((grid) => {
            if (!grid.shadowRoot) {
                throw new Error('The grid has not been initialized');
            }
            const prefix = grid.hasAttribute('left') ? 'left' : 'right';
            if (prefix === 'left') {
                this.leftGrid = grid;
            }
            else {
                this.rightGrid = grid;
            }
            grid.shadowRoot.addEventListener('click', (e) => this.grid_onClick(e));
        });
    }
    updateCellView(cell) {
        var _a;
        const grid = /^right-/.test(cell.name) ? this.rightGrid : this.leftGrid;
        const cellElement = (_a = grid === null || grid === void 0 ? void 0 : grid.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector(`[data-observation="${cell.name}"]`);
        if (cellElement) {
            cellElement.innerHTML = cell.label;
            /\*/.test(cell.value) && cell.considerNormal === null
                ? cellElement.setAttribute('error', '')
                : cellElement.removeAttribute('error');
        }
    }
    updateCellViews(updatedCells) {
        updatedCells.forEach((cell) => this.updateCellView(cell));
    }
    updateView(gridModel) {
        gridModel.forEach((row) => {
            row.forEach((cell) => {
                if (cell) {
                    this.updateCellView(cell);
                }
            });
        });
    }
    updateGridSelection(selectedPoints) {
        if (!this.leftGrid || !this.rightGrid) {
            throw new Error('The grids have not been initialized');
        }
        if (!selectedPoints) {
            this.rightGrid.removeAttribute('highlighted-cells');
            this.leftGrid.removeAttribute('highlighted-cells');
            return;
        }
        const leftSelectedPoints = selectedPoints
            .filter((p) => p.startsWith('left'))
            .join('|');
        const rightSelectedPoints = selectedPoints
            .filter((p) => p.startsWith('right'))
            .join('|');
        if (leftSelectedPoints) {
            this.leftGrid.setAttribute('highlighted-cells', leftSelectedPoints);
        }
        else {
            this.leftGrid.removeAttribute('highlighted-cells');
        }
        if (rightSelectedPoints) {
            this.rightGrid.setAttribute('highlighted-cells', rightSelectedPoints);
        }
        else {
            this.rightGrid.removeAttribute('highlighted-cells');
        }
    }
    updateInputButtons(activeCell, selectedCells = [], inputButtons, considerNormal, reasonImpairmentNotDueToSci, reasonImpairmentNotDueToSciSpecify) {
        var _a, _b;
        considerNormal.value =
            !activeCell || activeCell.error || activeCell.considerNormal === null
                ? ''
                : activeCell.considerNormal === true
                    ? '1'
                    : '2';
        reasonImpairmentNotDueToSci.value =
            (_a = activeCell === null || activeCell === void 0 ? void 0 : activeCell.reasonImpairmentNotDueToSci) !== null && _a !== void 0 ? _a : '';
        reasonImpairmentNotDueToSciSpecify.value =
            (_b = activeCell === null || activeCell === void 0 ? void 0 : activeCell.reasonImpairmentNotDueToSciSpecify) !== null && _b !== void 0 ? _b : '';
        if (activeCell) {
            inputButtons.removeAttribute('disabled');
            if (activeCell.value) {
                inputButtons.setAttribute('selected-value', activeCell.value);
                if (/\*$/.test(activeCell.value) &&
                    allCellsHaveSameValues(selectedCells)) {
                    inputButtons.setAttribute('show-star-input', '');
                }
                else {
                    inputButtons.removeAttribute('show-star-input');
                }
            }
            else {
                inputButtons.removeAttribute('selected-value');
                inputButtons.removeAttribute('show-star-input');
            }
            if (sensoryCellRegex.test(activeCell.name)) {
                inputButtons.setAttribute('sensory', '');
            }
            else {
                inputButtons.removeAttribute('sensory');
            }
        }
        else {
            inputButtons.removeAttribute('selected-value');
            inputButtons.removeAttribute('sensory');
            inputButtons.setAttribute('disabled', '');
            inputButtons.removeAttribute('show-star-input');
        }
    }
    updateTotals(totals) {
        this.classificationTotals.forEach((classificationTotal) => {
            var _a, _b;
            const key = ((_a = classificationTotal.getAttribute('data-total')) !== null && _a !== void 0 ? _a : '').replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            classificationTotal.innerHTML = (_b = totals[key]) !== null && _b !== void 0 ? _b : '';
        });
    }
    updateDropdowns(vac, dap) {
        if (!this.vac || !this.dap) {
            throw new Error('The input buttons for VAC and DAP have not been initialized');
        }
        this.vac.value = vac !== null && vac !== void 0 ? vac : 'None';
        this.dap.value = dap !== null && dap !== void 0 ? dap : 'None';
    }
    updateExtraInputs(rightLowestNonKeyMuscleWithMotorFunction, leftLowestNonKeyMuscleWithMotorFunction, comments) {
        if (!this.rightLowest || !this.leftLowest || !this.comments) {
            throw new Error('The input buttons for right and left lowest non-key muscle with motor function and comments have not been initialized');
        }
        this.rightLowest.value = rightLowestNonKeyMuscleWithMotorFunction !== null && rightLowestNonKeyMuscleWithMotorFunction !== void 0 ? rightLowestNonKeyMuscleWithMotorFunction : 'None';
        this.leftLowest.value = leftLowestNonKeyMuscleWithMotorFunction !== null && leftLowestNonKeyMuscleWithMotorFunction !== void 0 ? leftLowestNonKeyMuscleWithMotorFunction : 'None';
        this.comments.value = comments;
    }
    inputValue_onClick(e) {
        this.handleValueInput(e.detail.value);
    }
    vacDap_onChange() {
        if (!this.vac || !this.dap) {
            throw new Error('The input buttons for VAC and DAP have not been initialized');
        }
        const state = appStore.getState();
        const vac = this.vac.value === 'None' ? null : this.vac.value;
        const dap = this.dap.value === 'None' ? null : this.dap.value;
        setVacDapUseCase(state.gridModel, vac, dap, state.rightLowestNonKeyMuscleWithMotorFunction, state.leftLowestNonKeyMuscleWithMotorFunction, state.comments, this.appStoreProvider, this.externalMessageProvider);
    }
    extraInputs_onChange() {
        if (!this.rightLowest || !this.leftLowest || !this.comments) {
            throw new Error('The input buttons for right and left lowest non-key muscle with motor function and comments have not been initialized');
        }
        const state = appStore.getState();
        const cellComments = getCellComments(state.gridModel);
        setExtraInputsUseCase(state.gridModel.slice(), state.vac, state.dap, this.rightLowest.value, this.leftLowest.value, this.comments.value, cellComments, this.appStoreProvider, this.externalMessageProvider);
    }
    updateCellCommentsDisplay(gridModel) {
        if (this.cellCommentsDisplay) {
            this.cellCommentsDisplay.innerHTML = '';
            const cellComments = getCellComments(gridModel);
            const comments = cellComments.split(';');
            comments.forEach(c => {
                var _a;
                const comment = document.createElement('div');
                comment.textContent = c.replace(';', '');
                comment.style.paddingBottom = '2px';
                comment.style.fontSize = '0.75rem';
                (_a = this.cellCommentsDisplay) === null || _a === void 0 ? void 0 : _a.append(comment);
            });
        }
    }
    stateChanged(state, actionType) {
        if (!this.considerNormal ||
            !this.reasonImpairmentNotDueToSci ||
            !this.reasonImpairmentNotDueToSciSpecify) {
            throw new Error('The input buttons for consider normal, reason for impairment not due to sci and reason for impairment not due to sci specify have not been initialized');
        }
        switch (actionType) {
            case Actions.SET_GRID_MODEL:
                this.updateView(state.gridModel.slice());
                this.updateCellCommentsDisplay(state.gridModel);
                break;
            case Actions.SET_TOTALS:
            case Actions.CLEAR_TOTALS_AND_ERRORS:
                this.updateTotals(state.totals);
                break;
            case Actions.SET_ACTIVE_CELL:
                this.updateGridSelection(state.selectedCells ? state.selectedCells.map((c) => c.name) : null);
                this.updateInputButtons(state.activeCell, state.selectedCells, this.inputButtons, this.considerNormal, this.reasonImpairmentNotDueToSci, this.reasonImpairmentNotDueToSciSpecify);
                break;
            case Actions.SET_CELLS_VALUE:
                this.updateCellViews(state.updatedCells.slice());
                this.updateInputButtons(state.activeCell, state.selectedCells, this.inputButtons, this.considerNormal, this.reasonImpairmentNotDueToSci, this.reasonImpairmentNotDueToSciSpecify);
                this.updateCellCommentsDisplay(state.gridModel);
                break;
            case Actions.SET_VAC_DAP:
                this.updateDropdowns(state.vac, state.dap);
                break;
            case Actions.SET_EXTRA_INPUTS:
                this.updateExtraInputs(state.rightLowestNonKeyMuscleWithMotorFunction, state.leftLowestNonKeyMuscleWithMotorFunction, state.comments);
                this.updateCellCommentsDisplay(state.gridModel);
                break;
        }
    }
    grid_onClick(e) {
        if (!e.target || !(e.target instanceof HTMLElement)) {
            return;
        }
        const name = e.target.getAttribute('data-observation');
        if (!name) {
            return;
        }
        let state = appStore.getState();
        const isCtrlPressed = e.ctrlKey || e.metaKey;
        if (this.multipleSelectionEnabled) {
            if (!isCtrlPressed) {
                // If there is an activeCell and selectedCells.length > 1 (after a range selection)
                if (state.activeCell && state.selectedCells.length > 1) {
                    // Reset activeCell and selectedCells to start a new selection
                    this.appStoreProvider.setActiveCell(null, []);
                    // Update the state after resetting
                    state = appStore.getState();
                }
            }
            // Determine the selection mode
            const selectionMode = isCtrlPressed
                ? 'multiple'
                : state.activeCell
                    ? 'range'
                    : 'single';
            setActiveCellUseCase(name, state.activeCell, selectionMode, state.selectedCells, state.gridModel.slice(), this.appStoreProvider);
        }
        else {
            // When multiple selection is disabled - always single selection
            this.appStoreProvider.setActiveCell(null, []); // Clear previous selection if any
            setActiveCellUseCase(name, null, // No active cell for range selection
            'single', [], state.gridModel.slice(), this.appStoreProvider);
        }
    }
    starInput_change(e) {
        if (!this.considerNormal ||
            !this.reasonImpairmentNotDueToSci ||
            !this.reasonImpairmentNotDueToSciSpecify) {
            throw new Error('The input buttons for consider normal, reason for impairment not due to sci and reason for impairment not due to sci specify have not been initialized');
        }
        const state = appStore.getState();
        const considerNormal = this.considerNormal.value === '1'
            ? true
            : this.considerNormal.value === '2'
                ? false
                : null;
        setStarDetailsUseCase(considerNormal, this.reasonImpairmentNotDueToSci.value, this.reasonImpairmentNotDueToSciSpecify.value, state.selectedCells, state.gridModel, state.vac, state.dap, state.rightLowestNonKeyMuscleWithMotorFunction, state.leftLowestNonKeyMuscleWithMotorFunction, state.comments, true, this.appStoreProvider, this.externalMessageProvider);
    }
}

class KeyPointDiagramController {
    constructor(appStore, keyPointsDiagram) {
        this.keyPointsDiagram = keyPointsDiagram;
        if (!keyPointsDiagram.shadowRoot) {
            throw new Error('The input layout has not been initialized');
        }
        // Subscribe to the application's store
        appStore.subscribe((state, actionType) => this.stateChanged(state, actionType));
    }
    getColor(cell) {
        if (!cell) {
            return '';
        }
        return /\*\*$/.test(cell.value)
            ? '2'
            : cell.value.replace(/((UNK|NT)?\**)$/, '');
    }
    getKeyPointColor(lightTouch, pinPrick) {
        return [this.getColor(lightTouch), this.getColor(pinPrick)]
            .sort()
            .join('-');
    }
    updateRowKeyPoints(row, keyPointsDiagram) {
        var _a, _b;
        const levelNameExec = levelNameRegex.exec((_b = (_a = row[1]) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '');
        const levelName = levelNameExec ? levelNameExec[0] : '';
        const rightColor = this.getKeyPointColor(row[1], row[2]);
        const leftColor = this.getKeyPointColor(row[3], row[4]);
        keyPointsDiagram.setAttribute(`right-${levelName}`, rightColor);
        keyPointsDiagram.setAttribute(`left-${levelName}`, leftColor);
    }
    updateKeyPointsDiagram(keyPointsDiagram, gridModel) {
        gridModel.forEach((row, rowIndex) => this.updateRowKeyPoints(row, keyPointsDiagram));
    }
    stateChanged(state, actionType) {
        switch (actionType) {
            case Actions.SET_GRID_MODEL:
            case Actions.SET_CELLS_VALUE:
                this.updateKeyPointsDiagram(this.keyPointsDiagram, state.gridModel);
                break;
        }
    }
}

export { InputLayoutController, KeyPointDiagramController };
//# sourceMappingURL=index.js.map
