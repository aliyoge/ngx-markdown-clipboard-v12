import { HttpClient } from '@angular/common/http';
import { ComponentFactoryResolver, InjectionToken, SecurityContext, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Renderer } from 'marked';
import { Observable } from 'rxjs';
import { ClipboardOptions, ClipboardRenderOptions } from './clipboard-options';
import { KatexOptions } from './katex-options';
import { MarkedOptions } from './marked-options';
import { MarkedRenderer } from './marked-renderer';
import * as i0 from "@angular/core";
export declare const errorJoyPixelsNotLoaded = "[ngx-markdown] When using the `emoji` attribute you *have to* include Emoji-Toolkit files to `angular.json` or use imports. See README for more information";
export declare const errorKatexNotLoaded = "[ngx-markdown] When using the `katex` attribute you *have to* include KaTeX files to `angular.json` or use imports. See README for more information";
export declare const errorMermaidNotLoaded = "[ngx-markdown] When using the `mermaid` attribute you *have to* include Mermaid files to `angular.json` or use imports. See README for more information";
export declare const errorClipboardNotLoaded = "[ngx-markdown] When using the `clipboard` attribute you *have to* include Clipboard files to `angular.json` or use imports. See README for more information";
export declare const errorClipboardViewContainerRequired = "[ngx-markdown] When using the `clipboard` attribute you *have to* provide the `viewContainerRef` parameter to `MarkdownService.render()` function";
export declare const errorSrcWithoutHttpClient = "[ngx-markdown] When using the `src` attribute you *have to* pass the `HttpClient` as a parameter of the `forRoot` method. See README for more information";
export declare const SECURITY_CONTEXT: InjectionToken<SecurityContext>;
export interface ParseOptions {
    decodeHtml?: boolean;
    inline?: boolean;
    emoji?: boolean;
    mermaid?: boolean;
    markedOptions?: MarkedOptions;
}
export interface RenderOptions {
    clipboard?: boolean;
    clipboardOptions?: ClipboardRenderOptions;
    katex?: boolean;
    katexOptions?: KatexOptions;
    mermaid?: boolean;
}
export declare class ExtendedRenderer extends Renderer {
    ??NgxMarkdownRendererExtended: boolean;
}
export declare class MarkdownService {
    private platform;
    private securityContext;
    private http;
    private clipboardOptions;
    private sanitizer;
    private componentFactoryResolver;
    private readonly DEFAULT_PARSE_OPTIONS;
    private readonly DEFAULT_RENDER_OPTIONS;
    private readonly DEFAULT_MARKED_OPTIONS;
    private readonly DEFAULT_KATEX_OPTIONS;
    private readonly DEFAULT_CLIPBOARD_OPTIONS;
    private _options;
    get options(): MarkedOptions | undefined;
    set options(value: MarkedOptions | undefined);
    get renderer(): MarkedRenderer;
    set renderer(value: MarkedRenderer);
    private readonly _reload$;
    readonly reload$: Observable<void>;
    constructor(platform: Object, securityContext: SecurityContext, http: HttpClient, clipboardOptions: ClipboardOptions, options: MarkedOptions, sanitizer: DomSanitizer, componentFactoryResolver: ComponentFactoryResolver);
    parse(markdown: string, options?: ParseOptions): string;
    render(element: HTMLElement, options?: RenderOptions, viewContainerRef?: ViewContainerRef): void;
    reload(): void;
    getSource(src: string): Observable<string>;
    highlight(element?: Element | Document): void;
    private extendRenderer;
    private decodeHtml;
    private handleExtension;
    private parseMarked;
    private parseEmoji;
    private renderKatex;
    private renderClipboard;
    private trimIndentation;
    static ??fac: i0.????FactoryDeclaration<MarkdownService, [null, null, { optional: true; }, { optional: true; }, { optional: true; }, null, null]>;
    static ??prov: i0.????InjectableDeclaration<MarkdownService>;
}
