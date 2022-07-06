import { ElementRef, NgZone, PipeTransform, ViewContainerRef } from '@angular/core';
import { MarkdownService, ParseOptions, RenderOptions } from './markdown.service';
import * as i0 from "@angular/core";
export declare type MarkdownPipeOptions = ParseOptions & RenderOptions;
export declare class MarkdownPipe implements PipeTransform {
    private elementRef;
    private markdownService;
    private viewContainerRef;
    private zone;
    constructor(elementRef: ElementRef<HTMLElement>, markdownService: MarkdownService, viewContainerRef: ViewContainerRef, zone: NgZone);
    transform(value: string, options?: MarkdownPipeOptions): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<MarkdownPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<MarkdownPipe, "markdown">;
}
