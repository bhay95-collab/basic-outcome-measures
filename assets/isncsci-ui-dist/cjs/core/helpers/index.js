'use strict';

var examData_helper = require('../../examData.helper-43fb7cf8.js');
require('../domain/index.js');

const cellsMatch = (a, b) => {
    return (a.value === b.value &&
        a.error === b.error &&
        a.reasonImpairmentNotDueToSci === b.reasonImpairmentNotDueToSci &&
        a.reasonImpairmentNotDueToSciSpecify ===
            b.reasonImpairmentNotDueToSciSpecify);
};

exports.bindExamDataToGridModel = examData_helper.bindExamDataToGridModel;
exports.bindExamDataToTotals = examData_helper.bindExamDataToTotals;
exports.cellLevelRegex = examData_helper.cellLevelRegex;
exports.findCell = examData_helper.findCell;
exports.getCellColumn = examData_helper.getCellColumn;
exports.getCellComments = examData_helper.getCellComments;
exports.getCellPosition = examData_helper.getCellPosition;
exports.getCellRange = examData_helper.getCellRange;
exports.getCellRow = examData_helper.getCellRow;
exports.getEmptyExamData = examData_helper.getEmptyExamData;
exports.getExamDataFromGridModel = examData_helper.getExamDataFromGridModel;
exports.getExamDataWithAllNormalValues = examData_helper.getExamDataWithAllNormalValues;
exports.levelNameRegex = examData_helper.levelNameRegex;
exports.lightTouchCellRegex = examData_helper.lightTouchCellRegex;
exports.motorCellRegex = examData_helper.motorCellRegex;
exports.motorValueRegex = examData_helper.motorValueRegex;
exports.pinPrickCellRegex = examData_helper.pinPrickCellRegex;
exports.sensoryCellRegex = examData_helper.sensoryCellRegex;
exports.sensoryValueRegex = examData_helper.sensoryValueRegex;
exports.validCellNameRegex = examData_helper.validCellNameRegex;
exports.validateExamData = examData_helper.validateExamData;
exports.cellsMatch = cellsMatch;
//# sourceMappingURL=index.js.map
