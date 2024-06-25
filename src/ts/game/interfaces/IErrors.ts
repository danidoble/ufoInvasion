import {ErrorType} from "../types/types.ts";

export interface IErrors {
    element: HTMLElement

    addErrorsTemplates(): Promise<void>;

    templateError(): Promise<HTMLElement | null>;

    errorLoadingModel(): Promise<void>;

    modelError(el: Element, object: ErrorType): Promise<void>;

    displayError(type: string, ...args: any[]): void;
}