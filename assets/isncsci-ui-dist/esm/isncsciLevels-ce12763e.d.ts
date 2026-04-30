type BinaryObservation = 'Yes' | 'No' | 'NT' | 'UNK';

type SensoryLevel = 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C7' | 'C8' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7' | 'T8' | 'T9' | 'T10' | 'T11' | 'T12' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'S1' | 'S2' | 'S3' | 'S4_5';
declare const SensoryLevels: SensoryLevel[];
type SensoryPointValue = '0' | '1' | '2' | '0*' | '1*' | '0**' | '1**' | 'UNK' | 'NT' | 'NT*' | 'NT**';
declare const MotorLevels: MotorLevel[];
type MotorLevel = 'C5' | 'C6' | 'C7' | 'C8' | 'T1' | 'L2' | 'L3' | 'L4' | 'L5' | 'S1';
type MotorMuscleValue = '0' | '1' | '2' | '3' | '4' | '5' | '0*' | '1*' | '2*' | '3*' | '4*' | '0**' | '1**' | '2**' | '3**' | '4**' | 'UNK' | 'NT' | 'NT*' | 'NT**';
declare const ValidSensoryValues: SensoryPointValue[];
declare const ValidMotorValues: MotorMuscleValue[];

export { type BinaryObservation as B, type MotorLevel as M, type SensoryLevel as S, ValidMotorValues as V, MotorLevels as a, type MotorMuscleValue as b, SensoryLevels as c, type SensoryPointValue as d, ValidSensoryValues as e };
