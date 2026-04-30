import { E as ExamData } from './examData-b9636b53.js';
import { T as Totals } from './totals-9c85749b.js';

interface IIsncsciExamProvider {
    calculate(examData: ExamData): Promise<Totals>;
}

export type { IIsncsciExamProvider as I };
