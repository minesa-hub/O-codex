declare module "google-translate" {
    interface TranslateOptions {
        from?: string;
        to: string;
    }

    interface TranslateResult {
        text: string;
        from: {
            language: {
                iso: string;
            };
        };
    }

    function translate(
        text: string,
        options: TranslateOptions
    ): Promise<TranslateResult>;

    export default translate;
}
