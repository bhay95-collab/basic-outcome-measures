'use strict';

class ExternalMessagePortProviderActions {
}
ExternalMessagePortProviderActions.INITIALIZE_PORT = 'INITIALIZE_PORT';
ExternalMessagePortProviderActions.SET_EXAM_DATA = 'SET_EXAM_DATA';
ExternalMessagePortProviderActions.SET_READONLY = 'SET_READONLY';
ExternalMessagePortProviderActions.SET_STYLE_ATTRIBUTE = 'SET_STYLE_ATTRIBUTE';
ExternalMessagePortProviderActions.CLASSIFY = 'CLASSIFY';
ExternalMessagePortProviderActions.CLEAR_EXAM = 'CLEAR_EXAM';
class ExternalMessagePortProvider {
    constructor(globalWindow = window) {
        this.onExamDataHandlers = [];
        this.onReadonlyHandlers = [];
        this.onStyleAttributeHandlers = [];
        this.onClassifyHandlers = [];
        this.onClearExamHandlers = [];
        this.onExternalPortHandlers = [];
        this.port = null;
        // Listen for the initial port transfer message
        globalWindow.addEventListener('message', (e) => this.initPort(e));
    }
    initPort(e) {
        if (e.data.action &&
            e.data.action === ExternalMessagePortProviderActions.INITIALIZE_PORT) {
            this.port = e.ports[0];
            this.port.onmessage = (e) => {
                this.validateMessageEvent(e);
                this.onPortMessage(e.data.action, e.data.readonly, e.data.examData, e.data.styleAttribute);
            };
            this.dispatchOnExternalPort();
        }
    }
    onPortMessage(action, readonly, examData = null, styleAttribute = '') {
        if (action === ExternalMessagePortProviderActions.SET_EXAM_DATA) {
            if (!examData) {
                throw new Error('Exam data is required for SET_EXAM_DATA action.');
            }
            this.dispatchOnExamData(examData);
        }
        if (action === ExternalMessagePortProviderActions.SET_READONLY) {
            this.dispatchOnReadonly(readonly);
        }
        if (action === ExternalMessagePortProviderActions.SET_STYLE_ATTRIBUTE) {
            this.dispatchOnStyleAttribute(styleAttribute);
        }
        if (action === ExternalMessagePortProviderActions.CLASSIFY) {
            this.dispatchOnClassify();
        }
        if (action === ExternalMessagePortProviderActions.CLEAR_EXAM) {
            this.dispatchOnClearExam();
        }
    }
    sendOutExamData(examData) {
        var _a;
        (_a = this.port) === null || _a === void 0 ? void 0 : _a.postMessage(examData);
    }
    dispatchOnExamData(examData) {
        this.onExamDataHandlers.forEach((handler) => handler(examData));
    }
    dispatchOnReadonly(readonly) {
        this.onReadonlyHandlers.forEach((handler) => handler(readonly));
    }
    dispatchOnStyleAttribute(styleAttribute) {
        this.onStyleAttributeHandlers.forEach((handler) => handler(styleAttribute));
    }
    dispatchOnClassify() {
        this.onClassifyHandlers.forEach((handler) => handler());
    }
    dispatchOnClearExam() {
        this.onClearExamHandlers.forEach((handler) => handler());
    }
    dispatchOnExternalPort() {
        this.onExternalPortHandlers.forEach((handler) => handler());
    }
    subscribe(handler, handlers) {
        handlers.push(handler);
        return () => {
            const index = handlers.findIndex((value) => value === handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        };
    }
    /*
     * returns the unsubscribe function
     */
    subscribeToOnExamData(handler) {
        return this.subscribe(handler, this.onExamDataHandlers);
    }
    /*
     * returns the unsubscribe function
     */
    subscribeToOnReadonly(handler) {
        return this.subscribe(handler, this.onReadonlyHandlers);
    }
    /*
     * returns the unsubscribe function
     */
    subscribeToOnStyleAttribute(handler) {
        return this.subscribe(handler, this.onStyleAttributeHandlers);
    }
    /*
     * returns the unsubscribe function
     */
    subscribeToOnClassify(handler) {
        return this.subscribe(handler, this.onClassifyHandlers);
    }
    /*
     * returns the unsubscribe function
     */
    subscribeToOnClearExam(handler) {
        return this.subscribe(handler, this.onClearExamHandlers);
    }
    /*
     * returns the unsubscribe function
     */
    subscribeToOnExternalPort(handler) {
        return this.subscribe(handler, this.onExternalPortHandlers);
    }
    validateMessageEvent(e) {
        if (!e.data.action) {
            throw new Error('Action is required.');
        }
        if (typeof e.data.action !== 'string') {
            throw new Error('Action must be a string.');
        }
        if (e.data.action === ExternalMessagePortProviderActions.SET_EXAM_DATA) {
            if (!e.data.examData) {
                throw new Error('Exam data is required.');
            }
        }
        if (e.data.action === ExternalMessagePortProviderActions.SET_READONLY) {
            if (typeof e.data.readonly !== 'boolean') {
                throw new Error('Readonly must be a boolean.');
            }
        }
        if (e.data.action ===
            ExternalMessagePortProviderActions.SET_STYLE_ATTRIBUTE) {
            if (typeof e.data.styleAttribute !== 'string') {
                throw new Error('Classification style must be a string.');
            }
        }
    }
}

exports.ExternalMessagePortProvider = ExternalMessagePortProvider;
exports.ExternalMessagePortProviderActions = ExternalMessagePortProviderActions;
//# sourceMappingURL=index.js.map
