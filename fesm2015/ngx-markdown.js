import * as i0 from '@angular/core';
import { Component, ChangeDetectionStrategy, Pipe, InjectionToken, PLATFORM_ID, Injectable, Inject, Optional, EventEmitter, Input, Output, SecurityContext, NgModule } from '@angular/core';
import { Subject, merge, of, timer } from 'rxjs';
import { switchMap, mapTo, distinctUntilChanged, shareReplay, startWith, map, first } from 'rxjs/operators';
import * as i1 from '@angular/common';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Renderer, marked } from 'marked';
export { Renderer as MarkedRenderer } from 'marked';
import * as i1$1 from '@angular/common/http';
import * as i4 from '@angular/platform-browser';

const BUTTON_TEXT_COPY = 'Copy';
const BUTTON_TEXT_COPIED = 'Copied';
class ClipboardButtonComponent {
    constructor() {
        this._buttonClick$ = new Subject();
        this.copied$ = this._buttonClick$.pipe(switchMap(() => merge(of(true), timer(3000).pipe(mapTo(false)))), distinctUntilChanged(), shareReplay(1));
        this.copiedText$ = this.copied$.pipe(startWith(false), map(copied => copied
            ? BUTTON_TEXT_COPIED
            : BUTTON_TEXT_COPY));
    }
    onCopyToClipboardClick() {
        this._buttonClick$.next();
    }
}
ClipboardButtonComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: ClipboardButtonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
ClipboardButtonComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.0.5", type: ClipboardButtonComponent, selector: "markdown-clipboard", ngImport: i0, template: `
    <button
      class="markdown-clipboard-button"
      [class.copied]="copied$ | async"
      (click)="onCopyToClipboardClick()"
    >{{ copiedText$ | async }}</button>
  `, isInline: true, pipes: { "async": i1.AsyncPipe }, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: ClipboardButtonComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'markdown-clipboard',
                    template: `
    <button
      class="markdown-clipboard-button"
      [class.copied]="copied$ | async"
      (click)="onCopyToClipboardClick()"
    >{{ copiedText$ | async }}</button>
  `,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }] });

class ClipboardOptions {
}
class ClipboardRenderOptions extends ClipboardOptions {
}

/* eslint-disable */
class KatexSpecificOptions {
}

class LanguagePipe {
    transform(value, language) {
        if (value == null) {
            value = '';
        }
        if (language == null) {
            language = '';
        }
        if (typeof value !== 'string') {
            console.error(`LanguagePipe has been invoked with an invalid value type [${typeof value}]`);
            return value;
        }
        if (typeof language !== 'string') {
            console.error(`LanguagePipe has been invoked with an invalid parameter [${typeof language}]`);
            return value;
        }
        return '```' + language + '\n' + value + '\n```';
    }
}
LanguagePipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: LanguagePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
LanguagePipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: LanguagePipe, name: "language" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: LanguagePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'language',
                }]
        }] });

var PrismPlugin;
(function (PrismPlugin) {
    PrismPlugin["LineHighlight"] = "line-highlight";
    PrismPlugin["LineNumbers"] = "line-numbers";
})(PrismPlugin || (PrismPlugin = {}));

class MarkedOptions {
}

/* eslint-disable max-len */
const errorJoyPixelsNotLoaded = '[ngx-markdown] When using the `emoji` attribute you *have to* include Emoji-Toolkit files to `angular.json` or use imports. See README for more information';
const errorKatexNotLoaded = '[ngx-markdown] When using the `katex` attribute you *have to* include KaTeX files to `angular.json` or use imports. See README for more information';
const errorMermaidNotLoaded = '[ngx-markdown] When using the `mermaid` attribute you *have to* include Mermaid files to `angular.json` or use imports. See README for more information';
const errorClipboardNotLoaded = '[ngx-markdown] When using the `clipboard` attribute you *have to* include Clipboard files to `angular.json` or use imports. See README for more information';
const errorClipboardViewContainerRequired = '[ngx-markdown] When using the `clipboard` attribute you *have to* provide the `viewContainerRef` parameter to `MarkdownService.render()` function';
const errorSrcWithoutHttpClient = '[ngx-markdown] When using the `src` attribute you *have to* pass the `HttpClient` as a parameter of the `forRoot` method. See README for more information';
/* eslint-enable max-len */
const SECURITY_CONTEXT = new InjectionToken('SECURITY_CONTEXT');
class ExtendedRenderer extends Renderer {
    constructor() {
        super(...arguments);
        this.ɵNgxMarkdownRendererExtended = false;
    }
}
class MarkdownService {
    constructor(platform, securityContext, http, clipboardOptions, options, sanitizer, componentFactoryResolver) {
        this.platform = platform;
        this.securityContext = securityContext;
        this.http = http;
        this.clipboardOptions = clipboardOptions;
        this.sanitizer = sanitizer;
        this.componentFactoryResolver = componentFactoryResolver;
        this.DEFAULT_PARSE_OPTIONS = {
            decodeHtml: false,
            inline: false,
            emoji: false,
            mermaid: false,
            markedOptions: undefined,
        };
        this.DEFAULT_RENDER_OPTIONS = {
            clipboard: false,
            clipboardOptions: undefined,
            katex: false,
            katexOptions: undefined,
        };
        this.DEFAULT_MARKED_OPTIONS = {
            renderer: new Renderer(),
        };
        this.DEFAULT_KATEX_OPTIONS = {
            delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "$", right: "$", display: false },
                { left: "\\(", right: "\\)", display: false },
                { left: "\\begin{equation}", right: "\\end{equation}", display: true },
                { left: "\\begin{align}", right: "\\end{align}", display: true },
                { left: "\\begin{alignat}", right: "\\end{alignat}", display: true },
                { left: "\\begin{gather}", right: "\\end{gather}", display: true },
                { left: "\\begin{CD}", right: "\\end{CD}", display: true },
                { left: "\\[", right: "\\]", display: true },
            ],
        };
        this.DEFAULT_CLIPBOARD_OPTIONS = {
            buttonComponent: undefined,
        };
        this._reload$ = new Subject();
        this.reload$ = this._reload$.asObservable();
        this.options = options;
    }
    get options() { return this._options; }
    set options(value) {
        this._options = Object.assign(Object.assign({}, this.DEFAULT_MARKED_OPTIONS), value);
    }
    get renderer() { return this.options.renderer; }
    set renderer(value) {
        this.options.renderer = value;
    }
    parse(markdown, options = this.DEFAULT_PARSE_OPTIONS) {
        const { decodeHtml, inline, emoji, mermaid, markedOptions = this.options, } = options;
        if (mermaid) {
            this.renderer = this.extendRenderer(markedOptions.renderer || new Renderer());
        }
        const trimmed = this.trimIndentation(markdown);
        const decoded = decodeHtml ? this.decodeHtml(trimmed) : trimmed;
        const emojified = emoji ? this.parseEmoji(decoded) : decoded;
        const marked = this.parseMarked(emojified, markedOptions, inline);
        return this.sanitizer.sanitize(this.securityContext, marked) || '';
    }
    render(element, options = this.DEFAULT_RENDER_OPTIONS, viewContainerRef) {
        const { clipboard, clipboardOptions, katex, katexOptions, } = options;
        if (clipboard) {
            this.renderClipboard(element, viewContainerRef, Object.assign(Object.assign(Object.assign({}, this.DEFAULT_CLIPBOARD_OPTIONS), this.clipboardOptions), clipboardOptions));
        }
        if (katex) {
            this.renderKatex(element, Object.assign(Object.assign({}, this.DEFAULT_KATEX_OPTIONS), katexOptions));
        }
        this.highlight(element);
    }
    reload() {
        this._reload$.next();
    }
    getSource(src) {
        if (!this.http) {
            throw new Error(errorSrcWithoutHttpClient);
        }
        return this.http
            .get(src, { responseType: 'text' })
            .pipe(map(markdown => this.handleExtension(src, markdown)));
    }
    highlight(element) {
        if (!isPlatformBrowser(this.platform)) {
            return;
        }
        if (typeof Prism !== 'undefined') {
            if (!element) {
                element = document;
            }
            const noLanguageElements = element.querySelectorAll('pre code:not([class*="language-"])');
            Array.prototype.forEach.call(noLanguageElements, (x) => x.classList.add('language-none'));
            Prism.highlightAllUnder(element);
        }
    }
    extendRenderer(renderer) {
        const extendedRenderer = renderer;
        if (extendedRenderer.ɵNgxMarkdownRendererExtended === true) {
            return renderer;
        }
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const defaultCode = renderer.code;
        renderer.code = function (code, language, isEscaped) {
            return language === 'mermaid'
                ? `<div class="mermaid">${code}</div>`
                : defaultCode.call(this, code, language, isEscaped);
        };
        extendedRenderer.ɵNgxMarkdownRendererExtended = true;
        return renderer;
    }
    decodeHtml(html) {
        if (!isPlatformBrowser(this.platform)) {
            return html;
        }
        const textarea = document.createElement('textarea');
        textarea.innerHTML = html;
        return textarea.value;
    }
    handleExtension(src, markdown) {
        const extension = src
            ? src.split('?')[0].split('.').splice(-1).join()
            : '';
        return extension !== 'md'
            ? '```' + extension + '\n' + markdown + '\n```'
            : markdown;
    }
    parseMarked(html, markedOptions, inline = false) {
        if (!isPlatformBrowser(this.platform)) {
            return html;
        }
        if (inline) {
            return marked.parseInline(html, markedOptions);
        }
        return marked.parse(html, markedOptions);
    }
    parseEmoji(html) {
        if (!isPlatformBrowser(this.platform)) {
            return html;
        }
        if (typeof joypixels === 'undefined' || typeof joypixels.shortnameToUnicode === 'undefined') {
            throw new Error(errorJoyPixelsNotLoaded);
        }
        return joypixels.shortnameToUnicode(html);
    }
    renderKatex(element, options) {
        if (!isPlatformBrowser(this.platform)) {
            return;
        }
        if (typeof katex === 'undefined' || typeof renderMathInElement === 'undefined') {
            throw new Error(errorKatexNotLoaded);
        }
        renderMathInElement(element, options);
    }
    renderClipboard(element, viewContainerRef, options) {
        if (!isPlatformBrowser(this.platform)) {
            return;
        }
        if (typeof ClipboardJS === 'undefined') {
            throw new Error(errorClipboardNotLoaded);
        }
        if (!viewContainerRef) {
            throw new Error(errorClipboardViewContainerRequired);
        }
        const { buttonComponent, buttonTemplate, } = options;
        // target every <pre> elements
        const preElements = element.querySelectorAll('pre');
        for (let i = 0; i < preElements.length; i++) {
            const preElement = preElements.item(i);
            // create <pre> wrapper element
            const preWrapperElement = document.createElement('div');
            preWrapperElement.style.position = 'relative';
            preElement.parentNode.insertBefore(preWrapperElement, preElement);
            preWrapperElement.appendChild(preElement);
            // create toolbar element
            const toolbarWrapperElement = document.createElement('div');
            toolbarWrapperElement.style.position = 'absolute';
            toolbarWrapperElement.style.top = '.5em';
            toolbarWrapperElement.style.right = '.5em';
            toolbarWrapperElement.style.opacity = '0';
            toolbarWrapperElement.style.transition = 'opacity 250ms ease-out';
            preWrapperElement.insertAdjacentElement('beforeend', toolbarWrapperElement);
            // register listener to show/hide toolbar
            preElement.onmouseover = () => toolbarWrapperElement.style.opacity = '1';
            preElement.onmouseout = () => toolbarWrapperElement.style.opacity = '0';
            // declare embeddedViewRef holding variable
            let embeddedViewRef;
            // use provided component via input property
            // or provided via ClipboardOptions provider
            if (buttonComponent) {
                const buttonFactory = this.componentFactoryResolver.resolveComponentFactory(buttonComponent);
                const componentRef = viewContainerRef.createComponent(buttonFactory);
                embeddedViewRef = componentRef.hostView;
            }
            // use provided template via input property
            else if (buttonTemplate) {
                embeddedViewRef = viewContainerRef.createEmbeddedView(buttonTemplate);
            }
            // use default component
            else {
                const buttonFactory = this.componentFactoryResolver.resolveComponentFactory(ClipboardButtonComponent);
                const componentRef = viewContainerRef.createComponent(buttonFactory);
                embeddedViewRef = componentRef.hostView;
            }
            // declare clipboard instance variable
            let clipboardInstance;
            // attach clipboard.js to root node
            embeddedViewRef.rootNodes.forEach((node) => {
                node.onmouseover = () => toolbarWrapperElement.style.opacity = '1';
                toolbarWrapperElement.appendChild(node);
                clipboardInstance = new ClipboardJS(node, { text: () => preElement.innerText });
            });
            // destroy clipboard instance when view is destroyed
            embeddedViewRef.onDestroy(() => clipboardInstance.destroy());
        }
    }
    trimIndentation(markdown) {
        if (!markdown) {
            return '';
        }
        let indentStart;
        return markdown
            .split('\n')
            .map(line => {
            let lineIdentStart = indentStart;
            if (line.length > 0) {
                lineIdentStart = isNaN(lineIdentStart)
                    ? line.search(/\S|$/)
                    : Math.min(line.search(/\S|$/), lineIdentStart);
            }
            if (isNaN(indentStart)) {
                indentStart = lineIdentStart;
            }
            return lineIdentStart
                ? line.substring(lineIdentStart)
                : line;
        }).join('\n');
    }
}
MarkdownService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: MarkdownService, deps: [{ token: PLATFORM_ID }, { token: SECURITY_CONTEXT }, { token: i1$1.HttpClient, optional: true }, { token: ClipboardOptions, optional: true }, { token: MarkedOptions, optional: true }, { token: i4.DomSanitizer }, { token: i0.ComponentFactoryResolver }], target: i0.ɵɵFactoryTarget.Injectable });
MarkdownService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: MarkdownService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: MarkdownService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.SecurityContext, decorators: [{
                    type: Inject,
                    args: [SECURITY_CONTEXT]
                }] }, { type: i1$1.HttpClient, decorators: [{
                    type: Optional
                }] }, { type: ClipboardOptions, decorators: [{
                    type: Optional
                }] }, { type: MarkedOptions, decorators: [{
                    type: Optional
                }] }, { type: i4.DomSanitizer }, { type: i0.ComponentFactoryResolver }]; } });

/* eslint-disable @typescript-eslint/no-unused-vars */
class MarkdownComponent {
    constructor(element, markdownService, viewContainerRef) {
        this.element = element;
        this.markdownService = markdownService;
        this.viewContainerRef = viewContainerRef;
        // Event emitters
        this.error = new EventEmitter();
        this.load = new EventEmitter();
        this.ready = new EventEmitter();
        this._commandLine = false;
        this._clipboard = false;
        this._emoji = false;
        this._inline = false;
        this._katex = false;
        this._lineHighlight = false;
        this._lineNumbers = false;
    }
    get inline() { return this._inline; }
    set inline(value) { this._inline = this.coerceBooleanProperty(value); }
    // Plugin - clipboard
    get clipboard() { return this._clipboard; }
    set clipboard(value) { this._clipboard = this.coerceBooleanProperty(value); }
    // Plugin - emoji
    get emoji() { return this._emoji; }
    set emoji(value) { this._emoji = this.coerceBooleanProperty(value); }
    // Plugin - katex
    get katex() { return this._katex; }
    set katex(value) { this._katex = this.coerceBooleanProperty(value); }
    // Plugin - lineHighlight
    get lineHighlight() { return this._lineHighlight; }
    set lineHighlight(value) { this._lineHighlight = this.coerceBooleanProperty(value); }
    // Plugin - lineNumbers
    get lineNumbers() { return this._lineNumbers; }
    set lineNumbers(value) { this._lineNumbers = this.coerceBooleanProperty(value); }
    ngOnChanges() {
        if (this.data != null) {
            this.handleData();
            return;
        }
        if (this.src != null) {
            this.handleSrc();
            return;
        }
    }
    ngAfterViewInit() {
        if (!this.data && !this.src) {
            this.handleTransclusion();
        }
    }
    render(markdown, decodeHtml = false) {
        const parsedOptions = {
            decodeHtml,
            inline: this.inline,
            emoji: this.emoji,
        };
        const renderOptions = {
            clipboard: this.clipboard,
            clipboardOptions: {
                buttonComponent: this.clipboardButtonComponent,
                buttonTemplate: this.clipboardButtonTemplate,
            },
            katex: this.katex,
            katexOptions: this.katexOptions,
        };
        const parsed = this.markdownService.parse(markdown, parsedOptions);
        this.element.nativeElement.innerHTML = parsed;
        this.handlePlugins();
        this.markdownService.render(this.element.nativeElement, renderOptions, this.viewContainerRef);
        this.ready.emit();
    }
    coerceBooleanProperty(value) {
        return value != null && `${String(value)}` !== 'false';
    }
    handleData() {
        this.render(this.data);
    }
    handleSrc() {
        this.markdownService
            .getSource(this.src)
            .subscribe({
            next: markdown => {
                this.render(markdown);
                this.load.emit(markdown);
            },
            error: error => this.error.emit(error),
        });
    }
    handleTransclusion() {
        this.render(this.element.nativeElement.innerHTML, true);
    }
    handlePlugins() {
        if (this.lineHighlight) {
            this.setPluginOptions(this.element.nativeElement, { dataLine: this.line, dataLineOffset: this.lineOffset });
        }
        if (this.lineNumbers) {
            this.setPluginClass(this.element.nativeElement, PrismPlugin.LineNumbers);
            this.setPluginOptions(this.element.nativeElement, { dataStart: this.start });
        }
    }
    setPluginClass(element, plugin) {
        const preElements = element.querySelectorAll('pre');
        for (let i = 0; i < preElements.length; i++) {
            const classes = plugin instanceof Array ? plugin : [plugin];
            preElements.item(i).classList.add(...classes);
        }
    }
    setPluginOptions(element, options) {
        const preElements = element.querySelectorAll('pre');
        for (let i = 0; i < preElements.length; i++) {
            Object.keys(options).forEach(option => {
                const attributeValue = options[option];
                if (attributeValue) {
                    const attributeName = this.toLispCase(option);
                    preElements.item(i).setAttribute(attributeName, attributeValue.toString());
                }
            });
        }
    }
    toLispCase(value) {
        const upperChars = value.match(/([A-Z])/g);
        if (!upperChars) {
            return value;
        }
        let str = value.toString();
        for (let i = 0, n = upperChars.length; i < n; i++) {
            str = str.replace(new RegExp(upperChars[i]), '-' + upperChars[i].toLowerCase());
        }
        if (str.slice(0, 1) === '-') {
            str = str.slice(1);
        }
        return str;
    }
}
MarkdownComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: MarkdownComponent, deps: [{ token: i0.ElementRef }, { token: MarkdownService }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Component });
MarkdownComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.0.5", type: MarkdownComponent, selector: "markdown, [markdown]", inputs: { data: "data", src: "src", inline: "inline", clipboard: "clipboard", clipboardButtonComponent: "clipboardButtonComponent", clipboardButtonTemplate: "clipboardButtonTemplate", emoji: "emoji", katex: "katex", katexOptions: "katexOptions", lineHighlight: "lineHighlight", line: "line", lineOffset: "lineOffset", lineNumbers: "lineNumbers", start: "start" }, outputs: { error: "error", load: "load", ready: "ready" }, usesOnChanges: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: MarkdownComponent, decorators: [{
            type: Component,
            args: [{
                    // eslint-disable-next-line @angular-eslint/component-selector
                    selector: 'markdown, [markdown]',
                    template: '<ng-content></ng-content>',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: MarkdownService }, { type: i0.ViewContainerRef }]; }, propDecorators: { data: [{
                type: Input
            }], src: [{
                type: Input
            }], inline: [{
                type: Input
            }], clipboard: [{
                type: Input
            }], clipboardButtonComponent: [{
                type: Input
            }], clipboardButtonTemplate: [{
                type: Input
            }], emoji: [{
                type: Input
            }], katex: [{
                type: Input
            }], katexOptions: [{
                type: Input
            }], lineHighlight: [{
                type: Input
            }], line: [{
                type: Input
            }], lineOffset: [{
                type: Input
            }], lineNumbers: [{
                type: Input
            }], start: [{
                type: Input
            }], error: [{
                type: Output
            }], load: [{
                type: Output
            }], ready: [{
                type: Output
            }] } });

class MarkdownPipe {
    constructor(elementRef, markdownService, viewContainerRef, zone) {
        this.elementRef = elementRef;
        this.markdownService = markdownService;
        this.viewContainerRef = viewContainerRef;
        this.zone = zone;
    }
    transform(value, options) {
        if (value == null) {
            return '';
        }
        if (typeof value !== 'string') {
            console.error(`MarkdownPipe has been invoked with an invalid value type [${typeof value}]`);
            return value;
        }
        const markdown = this.markdownService.parse(value, options);
        this.zone.onStable
            .pipe(first())
            .subscribe(() => this.markdownService.render(this.elementRef.nativeElement, options, this.viewContainerRef));
        return markdown;
    }
}
MarkdownPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: MarkdownPipe, deps: [{ token: i0.ElementRef }, { token: MarkdownService }, { token: i0.ViewContainerRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Pipe });
MarkdownPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: MarkdownPipe, name: "markdown" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: MarkdownPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'markdown',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: MarkdownService }, { type: i0.ViewContainerRef }, { type: i0.NgZone }]; } });

const sharedDeclarations = [
    ClipboardButtonComponent,
    LanguagePipe,
    MarkdownComponent,
    MarkdownPipe,
];
const sharedEntryComponents = [
    ClipboardButtonComponent,
];
class MarkdownModule {
    static forRoot(markdownModuleConfig) {
        return {
            ngModule: MarkdownModule,
            providers: [
                MarkdownService,
                markdownModuleConfig && markdownModuleConfig.loader || [],
                markdownModuleConfig && markdownModuleConfig.clipboardOptions || [],
                markdownModuleConfig && markdownModuleConfig.markedOptions || [],
                {
                    provide: SECURITY_CONTEXT,
                    useValue: markdownModuleConfig && markdownModuleConfig.sanitize != null
                        ? markdownModuleConfig.sanitize
                        : SecurityContext.HTML,
                },
            ],
        };
    }
    static forChild() {
        return {
            ngModule: MarkdownModule,
        };
    }
}
MarkdownModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: MarkdownModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MarkdownModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: MarkdownModule, declarations: [ClipboardButtonComponent,
        LanguagePipe,
        MarkdownComponent,
        MarkdownPipe], imports: [CommonModule], exports: [ClipboardButtonComponent,
        LanguagePipe,
        MarkdownComponent,
        MarkdownPipe] });
MarkdownModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: MarkdownModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: MarkdownModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: sharedDeclarations,
                    declarations: sharedDeclarations,
                    entryComponents: sharedEntryComponents,
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { ClipboardButtonComponent, ClipboardOptions, ClipboardRenderOptions, ExtendedRenderer, KatexSpecificOptions, LanguagePipe, MarkdownComponent, MarkdownModule, MarkdownPipe, MarkdownService, MarkedOptions, PrismPlugin, SECURITY_CONTEXT, errorClipboardNotLoaded, errorClipboardViewContainerRequired, errorJoyPixelsNotLoaded, errorKatexNotLoaded, errorMermaidNotLoaded, errorSrcWithoutHttpClient };
//# sourceMappingURL=ngx-markdown.js.map
