export class Speecher {
    public lang: string = 'es';
    public voice: SpeechSynthesisVoice | null = null;
    public message: SpeechSynthesisUtterance | null = null;
    public synth: SpeechSynthesis = window.speechSynthesis;

    constructor() {
        if (!this.checkSupport) {
            return;
        }
        this.init();
    }

    init() {
        this.setMessage();
        this.setVoice();
        if (this.message) {
            this.message.voice = this.voice;
        }
    }

    setMessage() {
        this.message = new SpeechSynthesisUtterance();
        this.message.rate = 1;
        this.message.pitch = 1;
        this.message.volume = 1;
        if (this.voice) {
            this.message.voice = this.voice;
        }
    }

    speak(text: string): void {
        if (this.synth.speaking) {
            this.synth.cancel();
            // console.warn('ya esta hablando');
            // return;
        }
        // if (!this.message || !this.voice) {}
        this.init();
        if (!this.message) return;

        this.message.text = text;
        try {
            this.synth.speak(this.message);
            this.message.onend = function () {
                console.log('ended');
            };
            this.message.onerror = function () {
                console.log('paused');
            };
        } catch (e) {
            console.log(this);
            console.error(e);
        }
    }

    checkSupport(): boolean {
        return 'speechSynthesis' in window;
    }

    setVoice(): void {
        if (!this.message) return;
        this.voice = this.synth.getVoices().filter((voice: any) => voice.lang.includes(this.lang))[1];
        this.message.voice = this.voice;
    }

    getVoice(): SpeechSynthesisVoice | null {
        return this.voice;
    }

    setLang(lang: string): void {
        this.lang = lang;
        this.setVoice();
    }

    getLang(): string {
        return this.lang;
    }
}