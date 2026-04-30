export { q as bindExamDataToGridModel, r as bindExamDataToTotals, u as cellLevelRegex, c as findCell, k as getCellColumn, n as getCellComments, e as getCellPosition, d as getCellRange, l as getCellRow, g as getEmptyExamData, i as getExamDataFromGridModel, t as getExamDataWithAllNormalValues, o as levelNameRegex, w as lightTouchCellRegex, h as motorCellRegex, m as motorValueRegex, x as pinPrickCellRegex, s as sensoryCellRegex, j as sensoryValueRegex, y as validCellNameRegex, v as validateExamData } from '../../examData.helper-51d9ca17.js';
import '../domain/index.js';

const cellsMatch = (a, b) => {
    return (a.value === b.value &&
        a.error === b.error &&
        a.reasonImpairmentNotDueToSci === b.reasonImpairmentNotDueToSci &&
        a.reasonImpairmentNotDueToSciSpecify ===
            b.reasonImpairmentNotDueToSciSpecify);
};

export { cellsMatch };
//# sourceMappingURL=index.js.map
