import { AfterViewInit, ElementRef, EventEmitter, OnChanges, TemplateRef, Type, ViewContainerRef } from '@angular/core';
import { KatexOptions } from './katex-options';
import { MarkdownService } from './markdown.service';
import * as i0 from "@angular/core";
export declare class MarkdownComponent implements OnChanges, AfterViewInit {
    element: ElementRef<HTMLElement>;
    markdownService: MarkdownService;
    viewContainerRef: ViewContainerRef;
    protected static ngAcceptInputType_clipboard: boolean | '';
    protected static ngAcceptInputType_emoji: boolean | '';
    protected static ngAcceptInputType_katex: boolean | '';
    protected static ngAcceptInputType_lineHighlight: boolean | '';
    protected static ngAcceptInputType_lineNumbers: boolean | '';
    data: string | undefined;
    src: string | undefined;
    get inline(): boolean;
    set inline(value: boolean);
    get clipboard(): boolean;
    set clipboard(value: boolean);
    clipboardButtonComponent: Type<unknown> | undefined;
    clipboardButtonTemplate: TemplateRef<unknown> | undefined;
    get emoji(): boolean;
    set emoji(value: boolean);
    get katex(): boolean;
    set katex(value: boolean);
    katexOptions: KatexOptions | undefined;
    get lineHighlight(): boolean;
    set lineHighlight(value: boolean);
    line: string | string[] | undefined;
    lineOffset: number | undefined;
    get lineNumbers(): boolean;
    set lineNumbers(value: boolean);
    start: number | undefined;
    error: EventEmitter<string>;
    load: EventEmitter<string>;
    ready: EventEmitter<void>;
    private _commandLine;
    private _clipboard;
    private _emoji;
    private _inline;
    private _katex;
    private _lineHighlight;
    private _lineNumbers;
    constructor(element: ElementRef<HTMLElement>, markdownService: MarkdownService, viewContainerRef: ViewContainerRef);
    ngOnChanges(): void;
    ngAfterViewInit(): void;
    render(markdown: string, decodeHtml?: boolean): void;
    private coerceBooleanProperty;
    private handleData;
    private handleSrc;
    private handleTransclusion;
    private handlePlugins;
    private setPluginClass;
    private setPluginOptions;
    private toLispCase;
    static ɵfac: i0.ɵɵFactoryDeclaration<MarkdownComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MarkdownComponent, "markdown, [markdown]", never, { "data": "data"; "src": "src"; "inline": "inline"; "clipboard": "clipboard"; "clipboardButtonComponent": "clipboardButtonComponent"; "clipboardButtonTemplate": "clipboardButtonTemplate"; "emoji": "emoji"; "katex": "katex"; "katexOptions": "katexOptions"; "lineHighlight": "lineHighlight"; "line": "line"; "lineOffset": "lineOffset"; "lineNumbers": "lineNumbers"; "start": "start"; }, { "error": "error"; "load": "load"; "ready": "ready"; }, never, ["*"]>;
}
