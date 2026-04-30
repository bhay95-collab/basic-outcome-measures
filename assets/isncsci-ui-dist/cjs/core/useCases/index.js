'use strict';

var getNextActiveCell_useCase = require('../../getNextActiveCell.useCase-3565e781.js');
var examData_helper = require('../../examData.helper-43fb7cf8.js');
var core_boundaries_index = require('../boundaries/index.js');
require('../helpers/index.js');
require('../domain/index.js');

const formatFieldName = (fieldName) => {
    const specialCases = {
        'voluntaryAnalContraction': 'Voluntary Anal Contraction',
        'deepAnalPressure': 'Deep Anal Pressure',
        'rightLowestNonKeyMuscleWithMotorFunction': 'Right Lowest Non-Key Muscle',
        'leftLowestNonKeyMuscleWithMotorFunction': 'Left Lowest Non-Key Muscle',
    };
    if (specialCases[fieldName]) {
        return specialCases[fieldName];
    }
    let formatted = fieldName;
    formatted = formatted
        .replace(/-/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        // Capitalize first letter of ea word
        .replace(/\b\w/g, (char) => char.toUpperCase())
        // level indicators
        .replace(/\b([CTLS])(\d+)/gi, (match, letter, number) => `${letter.toUpperCase()}${number}`)
        // S4_5 or S4-5
        .replace(/S(\d+)[_-](\d+)/gi, 'S$1-$2');
    return formatted;
};
/*
 * This use case is responsible for calculating the totals
 * and updating the state of the application
 *
 * `UNK` values are allowed in the exam data, but they are not valid values in the ISNCSCI library.
 * They are converted to `NT` before performing the calculation but not persisted as part of the state.
 *
 * 1. Get exam data from grid model
 * 2. Check for missing values
 *    2.1 If missing values are found,
 *      2.1.1 add the missing values as calculation errors to the model
 *      2.1.2 Update the external listeners so they are informed of the errors
 *      2.1.3 Stop
 * 3. Validate exam data
 *    3.1 If errors are found,
 *      3.1.1 add the calculation errors to the model
 *      3.1.2 Update the external listeners so they are informed of the errors
 *      3.1.3 Stop
 * 4. Convert any `UNK` values to `NT` before performing the calculation
 * 5. Calculate totals
 * 6. Bind totals to exam data
 * 7. Mark exam data as complete
 * 8. Update state
 * 9. Update external listeners
 */
const calculateUseCase = (gridModel, vac, dap, rightLowestNonKeyMuscle, leftLowestNonKeyMuscle, comments, appStoreProvider, examProvider, externalMessageProvider) => getNextActiveCell_useCase.__awaiter(void 0, void 0, void 0, function* () {
    // 1. Get exam data from grid model
    const { examData, missingValues } = examData_helper.getExamDataFromGridModel(gridModel, vac, dap, rightLowestNonKeyMuscle, leftLowestNonKeyMuscle, comments);
    // 2. Check for missing values
    if (missingValues.length > 0) {
        try {
            // 2.1 If missing values are found,
            // 2.1.1 add the missing values as calculation errors to the model
            const formattedMissingValues = missingValues.map(formatFieldName);
            yield appStoreProvider.setCalculationError(`Missing values:\n${formattedMissingValues.join('\n')}`);
            // 2.1.2 Update the external listeners so they are informed of the errors
            examData.missingValues = missingValues;
            yield externalMessageProvider.sendOutExamData(examData);
        }
        catch (error) {
            console.log(error);
        }
        // 2.1.3 Stop
        return;
    }
    // 3. Validate exam data
    const errors = examData_helper.validateExamData(examData);
    if (errors.length > 0) {
        try {
            // 3.1 If errors are found,
            // 3.1.1 add the calculation errors
            const formattedErrors = errors.map(error => {
                // format any field names found in the error message
                return error.replace(/\b([a-z]+(?:[A-Z][a-z]*)*(?:[A-Z]\d+)?)\b/gi, (match) => {
                    if (/[A-Z]/.test(match)) {
                        return formatFieldName(match);
                    }
                    return match;
                });
            });
            yield appStoreProvider.setCalculationError(`The exam contains errors:\n${formattedErrors.join('\n')}`);
            // 3.1.2 Update the external listeners so they are informed of the errors
            examData.errors = errors;
            yield externalMessageProvider.sendOutExamData(examData);
        }
        catch (error) {
            console.log(error);
        }
        // 3.1.3 Stop
        return;
    }
    // 3. Convert any `UNK` values to `NT` before performing the calculation
    const clonedExamData = examData_helper.cloneExamData(examData, true);
    try {
        // 4. Calculate totals
        const totals = yield examProvider.calculate(clonedExamData);
        // 5. Bind totals to exam data
        Object.keys(totals).forEach((key) => {
            examData[key] = totals[key];
        });
        // 6. Mark exam data as complete
        examData.isComplete = true;
        // 7. Update state
        yield appStoreProvider.setTotals(totals);
        // 8. Update external listeners
        yield externalMessageProvider.sendOutExamData(examData);
    }
    catch (error) {
        console.log(error);
    }
    return examData;
});

/*
 * 1. Generate an empty exam
 * 2. Bind the empty exam to the grid model
 * 3. Bind the empty exam to the totals
 * 4. Update the state
 * 5. Update external listeners
 */
const clearExamUseCase = (appStoreProvider, externalMessageProvider) => getNextActiveCell_useCase.__awaiter(void 0, void 0, void 0, function* () {
    const emptyExamData = examData_helper.getEmptyExamData();
    const gridModel = examData_helper.bindExamDataToGridModel(emptyExamData);
    const totals = examData_helper.bindExamDataToTotals(emptyExamData);
    try {
        yield appStoreProvider.setActiveCell(null, []);
        yield appStoreProvider.setGridModel(gridModel);
        yield appStoreProvider.setTotals(totals);
        yield appStoreProvider.setVacDap(null, null);
        yield appStoreProvider.setExtraInputs(null, null, '', '');
        yield externalMessageProvider.sendOutExamData(emptyExamData);
    }
    catch (error) {
        console.log(error);
    }
});

/*
 * 1. Set the app status to `initializing`.
 * 2. Set a blank grid model in the app store provider.
 * 3. Set the app status to `ready`.
 */
const initializeAppUseCase = (appStoreProvider) => getNextActiveCell_useCase.__awaiter(void 0, void 0, void 0, function* () {
    // 1. Set the app status to `initializing`.
    yield appStoreProvider.updateStatus(core_boundaries_index.StatusCodes.Initializing);
    // 2. Set a blank grid model in the app store provider.
    yield appStoreProvider.setGridModel(examData_helper.bindExamDataToGridModel(examData_helper.getEmptyExamData()));
    // 3. Set the app status to `ready`.
    yield appStoreProvider.updateStatus(core_boundaries_index.StatusCodes.Ready);
});

const loadExternalExamDataUseCase = (appStoreProvider, examData) => getNextActiveCell_useCase.__awaiter(void 0, void 0, void 0, function* () {
    //Sun: Dont validate the input, error will only be shown after calculation
    // EE: We do not validate anymore as we do not want to trigger the alert box when loading an external exam
    // We, however, still need to clear the error in case a previous exam with error was loaded.
    // // 1. Validate exam data
    // const errors = validateExamData(examData);
    yield appStoreProvider.setCalculationError('');
    // 2. Bind exam data to a new grid model
    const gridModel = examData_helper.bindExamDataToGridModel(examData);
    // 3. Bind exam data to the totals
    const totals = examData_helper.bindExamDataToTotals(examData);
    // 4. Update state
    yield appStoreProvider.setActiveCell(null, []);
    yield appStoreProvider.setGridModel(gridModel);
    yield appStoreProvider.setTotals(totals);
    yield appStoreProvider.setVacDap(examData.voluntaryAnalContraction, examData.deepAnalPressure);
    yield appStoreProvider.setExtraInputs(examData.rightLowestNonKeyMuscleWithMotorFunction, examData.leftLowestNonKeyMuscleWithMotorFunction, examData.comments || '', examData.cellComments || '');
});

const setReadonlyUseCase = (readonly, appStoreProvider) => {
    appStoreProvider.setReadonly(readonly);
};

exports.getNextActiveCellUseCase = getNextActiveCell_useCase.getNextActiveCellUseCase;
exports.setActiveCellUseCase = getNextActiveCell_useCase.setActiveCellUseCase;
exports.setCellsValueUseCase = getNextActiveCell_useCase.setCellsValueUseCase;
exports.setExtraInputsUseCase = getNextActiveCell_useCase.setExtraInputsUseCase;
exports.setStarDetailsUseCase = getNextActiveCell_useCase.setStarDetailsUseCase;
exports.setVacDapUseCase = getNextActiveCell_useCase.setVacDapUseCase;
exports.calculateUseCase = calculateUseCase;
exports.clearExamUseCase = clearExamUseCase;
exports.initializeAppUseCase = initializeAppUseCase;
exports.loadExternalExamDataUseCase = loadExternalExamDataUseCase;
exports.setReadonlyUseCase = setReadonlyUseCase;
//# sourceMappingURL=index.js.map
