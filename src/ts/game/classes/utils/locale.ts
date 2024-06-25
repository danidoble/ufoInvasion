import {en} from './en.ts';

export function __(text: string): string {
    // @ts-ignore
    if (typeof window.flappy_lang == 'undefined') {
        // @ts-ignore
        return en[text] || text;
    }
    // @ts-ignore
    return (window.flappy_lang && window.flappy_lang[text]) || en[text] || text;
}