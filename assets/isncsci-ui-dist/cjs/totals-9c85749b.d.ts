interface Cell {
    value: string;
    label: string;
    considerNormal: boolean | null;
    reasonImpairmentNotDueToSci: string | null;
    reasonImpairmentNotDueToSciSpecify: string | null;
    name: string;
    error: string | null;
}

interface Totals {
    asiaImpairmentScale: string;
    injuryComplete: string;
    leftLightTouchTotal: string;
    leftLowerMotorTotal: string;
    leftMotor: string;
    leftMotorTotal: string;
    leftMotorZpp: string;
    leftPinPrickTotal: string;
    leftSensory: string;
    leftSensoryZpp: string;
    leftUpperMotorTotal: string;
    lightTouchTotal: string;
    lowerMotorTotal: string;
    neurologicalLevelOfInjury: string;
    pinPrickTotal: string;
    rightLightTouchTotal: string;
    rightLowerMotorTotal: string;
    rightMotor: string;
    rightMotorTotal: string;
    rightMotorZpp: string;
    rightPinPrickTotal: string;
    rightSensory: string;
    rightSensoryZpp: string;
    rightUpperMotorTotal: string;
    upperMotorTotal: string;
}

export type { Cell as C, Totals as T };
