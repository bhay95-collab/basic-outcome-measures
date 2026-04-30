import { StatusCodes } from '../../core/boundaries/index.js';
import { p as getEmptyTotals } from '../../examData.helper-51d9ca17.js';
import '../../core/domain/index.js';

class Actions {
}
Actions.CLEAR_TOTALS_AND_ERRORS = 'CLEAR_TOTALS_AND_ERRORS';
Actions.SET_ACTIVE_CELL = 'SET_ACTIVE_CELL';
Actions.SET_CALCULATION_ERROR = 'SET_CALCULATION_ERROR';
Actions.SET_CELLS_VALUE = 'SET_CELLS_VALUE';
Actions.SET_EXTRA_INPUTS = 'SET_EXTRA_INPUTS';
Actions.SET_GRID_MODEL = 'SET_GRID_MODEL';
Actions.SET_READONLY = 'SET_READONLY';
Actions.SET_TOTALS = 'SET_TOTALS';
Actions.SET_VAC_DAP = 'SET_VAC_DAP';
Actions.UPDATE_STATUS = 'UPDATE_STATUS';
const gridModel = (state, action) => {
    switch (action.type) {
        case Actions.SET_GRID_MODEL:
            return Object.assign({}, state, { gridModel: action.payload });
        default:
            return state;
    }
};
const activeCell = (state, action) => {
    switch (action.type) {
        case Actions.SET_ACTIVE_CELL:
            return Object.assign({}, state, {
                activeCell: action.payload.cell,
                selectedCells: action.payload.selectedCells,
            });
        default:
            return state;
    }
};
const calculationError = (state, action) => {
    switch (action.type) {
        case Actions.SET_CALCULATION_ERROR:
            return Object.assign({}, state, { calculationError: action.payload });
        case Actions.CLEAR_TOTALS_AND_ERRORS:
            return Object.assign({}, state, {
                calculationError: '',
                totals: getEmptyTotals(),
            });
        default:
            return state;
    }
};
const extraInputs = (state, action) => {
    switch (action.type) {
        case Actions.SET_EXTRA_INPUTS:
            return Object.assign({}, state, {
                rightLowestNonKeyMuscleWithMotorFunction: action.payload.rightLowestNonKeyMuscleWithMotorFunction,
                leftLowestNonKeyMuscleWithMotorFunction: action.payload.leftLowestNonKeyMuscleWithMotorFunction,
                comments: action.payload.comments,
                cellComments: action.payload.cellComments,
            });
        default:
            return state;
    }
};
const readonly = (state, action) => {
    switch (action.type) {
        case Actions.SET_READONLY:
            return Object.assign({}, state, { readonly: action.payload });
        default:
            return state;
    }
};
const status = (state, action) => {
    switch (action.type) {
        case Actions.UPDATE_STATUS:
            return Object.assign({}, state, { status: action.payload });
        default:
            return state;
    }
};
const totals = (state, action) => {
    switch (action.type) {
        case Actions.SET_TOTALS:
            return Object.assign({}, state, { totals: action.payload });
        default:
            return state;
    }
};
const vacDap = (state, action) => {
    switch (action.type) {
        case Actions.SET_VAC_DAP:
            return Object.assign({}, state, {
                vac: action.payload.vac,
                dap: action.payload.dap,
            });
        default:
            return state;
    }
};
const values = (state, action) => {
    switch (action.type) {
        case Actions.SET_CELLS_VALUE:
            const cellsToUpdate = action.payload.cellsToUpdate.slice();
            cellsToUpdate.forEach((cell) => {
                cell.value = action.payload.value;
                cell.label = action.payload.label;
                cell.error = action.payload.error;
                cell.considerNormal = action.payload.considerNormal;
                cell.reasonImpairmentNotDueToSci =
                    action.payload.reasonImpairmentNotDueToSci;
                cell.reasonImpairmentNotDueToSciSpecify =
                    action.payload.reasonImpairmentNotDueToSciSpecify;
            });
            return Object.assign({}, state, { updatedCells: cellsToUpdate.slice() });
        default:
            return state;
    }
};
var reducers = [
    activeCell,
    calculationError,
    extraInputs,
    gridModel,
    readonly,
    status,
    totals,
    vacDap,
    values,
];

class AppStore {
    constructor() {
        this.handlers = [];
        this.state = {
            activeCell: null,
            calculationError: '',
            comments: '',
            dap: null,
            gridModel: [],
            leftLowestNonKeyMuscleWithMotorFunction: null,
            readonly: false,
            rightLowestNonKeyMuscleWithMotorFunction: null,
            selectedCells: [],
            selectedPoint: null,
            status: StatusCodes.NotInitialized,
            totals: {
                asiaImpairmentScale: '',
                injuryComplete: '',
                leftLightTouchTotal: '',
                leftLowerMotorTotal: '',
                leftMotor: '',
                leftMotorTotal: '',
                leftMotorZpp: '',
                leftPinPrickTotal: '',
                leftSensory: '',
                leftSensoryZpp: '',
                leftUpperMotorTotal: '',
                lightTouchTotal: '',
                lowerMotorTotal: '',
                neurologicalLevelOfInjury: '',
                pinPrickTotal: '',
                rightLightTouchTotal: '',
                rightLowerMotorTotal: '',
                rightMotor: '',
                rightMotorTotal: '',
                rightMotorZpp: '',
                rightPinPrickTotal: '',
                rightSensory: '',
                rightSensoryZpp: '',
                rightUpperMotorTotal: '',
                upperMotorTotal: '',
            },
            updatedCells: [],
            vac: null,
        };
    }
    subscribe(handler) {
        this.handlers.push(handler);
        return () => {
            // EE: The line below can remove the handler in just one line of code, however, it will iterate through the entire array.
            // The code after, however, will stop once it finds the handler to be removed from the subscriber's list.
            // this.handlers = this.handlers.filter((value: Function) => value != handler);
            const index = this.handlers.findIndex((value) => value === handler);
            if (index > -1) {
                this.handlers.splice(index, 1);
            }
        };
    }
    getState() {
        return this.state;
    }
    dispatch(action) {
        reducers.forEach((reducer) => {
            this.state = reducer(this.state, action);
        });
        this.handlers.forEach((handler) => handler(this.state, action.type));
    }
}
const appStore = new AppStore();

export { Actions, appStore };
//# sourceMappingURL=index.js.map
