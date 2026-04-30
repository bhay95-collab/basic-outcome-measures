import { E as ExamData } from '../../../examData-b9636b53.js';
import { I as IExternalMessageProvider } from '../../../iExternalMessage.provider-4fdffd26.js';
import '../../../isncsciLevels-ce12763e.js';

declare class ExternalMessagePortProviderActions {
    static INITIALIZE_PORT: string;
    static SET_EXAM_DATA: string;
    static SET_READONLY: string;
    static SET_STYLE_ATTRIBUTE: string;
    static CLASSIFY: string;
    static CLEAR_EXAM: string;
}
declare class ExternalMessagePortProvider implements IExternalMessageProvider {
    private onExamDataHandlers;
    private onReadonlyHandlers;
    private onStyleAttributeHandlers;
    private onClassifyHandlers;
    private onClearExamHandlers;
    private onExternalPortHandlers;
    private port;
    constructor(globalWindow?: Window);
    private initPort;
    private onPortMessage;
    sendOutExamData(examData: ExamData): void;
    private dispatchOnExamData;
    private dispatchOnReadonly;
    private dispatchOnStyleAttribute;
    private dispatchOnClassify;
    private dispatchOnClearExam;
    private dispatchOnExternalPort;
    private subscribe;
    subscribeToOnExamData(handler: (examData: ExamData | null) => void): () => void;
    subscribeToOnReadonly(handler: (readonly: boolean) => void): () => void;
    subscribeToOnStyleAttribute(handler: (styleAttribute: string) => void): () => void;
    subscribeToOnClassify(handler: () => void): () => void;
    subscribeToOnClearExam(handler: () => void): () => void;
    subscribeToOnExternalPort(handler: () => void): () => void;
    private validateMessageEvent;
}

export { ExternalMessagePortProvider, ExternalMessagePortProviderActions };
