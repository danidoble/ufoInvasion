import {__} from "./utils/locale.ts";
import {IErrors} from "../interfaces/IErrors.ts";
import {ErrorType} from "../types/types.ts";

export class Errors implements IErrors {
    public element: HTMLElement = document.body;

    async addErrorsTemplates(): Promise<void> {
        await this.errorLoadingModel();
    }

    async templateError(): Promise<HTMLElement | null> {
        const container: HTMLElement | null = document.getElementById('template-container-errors');
        if (container) return container;

        const el: HTMLDivElement = document.createElement('div');
        el.id = 'template-errors';
        el.classList.add('text-white', 'bg-gray-950', 'p-4', 'absolute', 'inset-0', 'flex', 'items-center', 'justify-center', 'hidden');
        el.innerHTML = `<div class="bg-red-700 shadow-red-600 shadow-lg ring-2 ring-offset-4 ring-offset-red-900 ring-red-800 rounded-xl w-full max-w-lg px-6 py-8 text-center" id="template-container-errors"></div>`;
        this.element.appendChild(el);
        return document.getElementById('template-container-errors');
    }

    async errorLoadingModel(): Promise<void> {

        const container: HTMLElement | null = await this.templateError();

        const el: HTMLDivElement = document.createElement('div');
        el.id = 'error-loading-model';
        el.classList.add('hidden', 'error');
        el.innerHTML = `
        <h3 class="text-2xl mb-4 uppercase">&gt; ${__('errors.models.loading')} &lt;</h3>
        <div class="flex justify-center mb-4"><svg class="size-12 sm:size-16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg></div>
        <p class="text-lg mb-6">${__('errors.models.desc')}</p>
        <ul class="text-left list-disc px-4" data-errors></ul>
    `;

        if (container) {
            container.appendChild(el);
        }
    }

    async modelError(el: Element, object: ErrorType): Promise<void> {
        const errors: HTMLElement | null = el.querySelector('[data-errors]');
        if (!errors) {
            console.error('Error, element not found to show error');
            return;
        }
        errors.innerHTML = `
        ${object.bird ? '<li class="mb-2">' + __('errors.models.bird') + '</li>' : ''}
        ${object.ufo ? '<li class="mb-2">' + __('errors.models.ufo') + '</li>' : ''}
        ${object.background ? '<li class="mb-2">' + __('errors.models.background') + '</li>' : ''}
        ${object.coin ? '<li class="mb-2">' + __('errors.models.coin') + '</li>' : ''}
    `;
    }

    async displayError(type: string, ...args: any[]): Promise<void> {
        const errors_parent: HTMLElement | null = document.getElementById('template-errors');
        if (!errors_parent) {
            console.error(`Error, parent not found to show error: ${type}`);
            return;
        }
        errors_parent.classList.remove('hidden');

        const errors: HTMLElement | null = document.getElementById('template-container-errors');
        if (!errors) {
            console.error(`Error, container not found to show error: ${type}`);
            return;
        }
        errors.classList.remove('hidden');
        for (const error of errors.querySelectorAll('.error')) {
            error.classList.add('hidden');
        }

        const error: Element | null = errors.querySelector(`#${type}`);
        if (!error) {
            console.error(`Error, element not found to show error: ${type}`);
            return;
        }

        if (type === 'error-loading-model') {
            // @ts-ignore
            await this.modelError(error, ...args);
        }

        error.classList.remove('hidden');
    }
}



