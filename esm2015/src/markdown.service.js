import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, InjectionToken, Optional, PLATFORM_ID } from '@angular/core';
import { marked, Renderer } from 'marked';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClipboardButtonComponent } from './clipboard-button.component';
import { MarkedRenderer } from './marked-renderer';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "./clipboard-options";
import * as i3 from "./marked-options";
import * as i4 from "@angular/platform-browser";
/* eslint-disable max-len */
export const errorJoyPixelsNotLoaded = '[ngx-markdown] When using the `emoji` attribute you *have to* include Emoji-Toolkit files to `angular.json` or use imports. See README for more information';
export const errorKatexNotLoaded = '[ngx-markdown] When using the `katex` attribute you *have to* include KaTeX files to `angular.json` or use imports. See README for more information';
export const errorMermaidNotLoaded = '[ngx-markdown] When using the `mermaid` attribute you *have to* include Mermaid files to `angular.json` or use imports. See README for more information';
export const errorClipboardNotLoaded = '[ngx-markdown] When using the `clipboard` attribute you *have to* include Clipboard files to `angular.json` or use imports. See README for more information';
export const errorClipboardViewContainerRequired = '[ngx-markdown] When using the `clipboard` attribute you *have to* provide the `viewContainerRef` parameter to `MarkdownService.render()` function';
export const errorSrcWithoutHttpClient = '[ngx-markdown] When using the `src` attribute you *have to* pass the `HttpClient` as a parameter of the `forRoot` method. See README for more information';
/* eslint-enable max-len */
export const SECURITY_CONTEXT = new InjectionToken('SECURITY_CONTEXT');
export class ExtendedRenderer extends Renderer {
    constructor() {
        super(...arguments);
        this.ɵNgxMarkdownRendererExtended = false;
    }
}
export class MarkdownService {
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
            renderer: new MarkedRenderer(),
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
MarkdownService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: MarkdownService, deps: [{ token: PLATFORM_ID }, { token: SECURITY_CONTEXT }, { token: i1.HttpClient, optional: true }, { token: i2.ClipboardOptions, optional: true }, { token: i3.MarkedOptions, optional: true }, { token: i4.DomSanitizer }, { token: i0.ComponentFactoryResolver }], target: i0.ɵɵFactoryTarget.Injectable });
MarkdownService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: MarkdownService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: MarkdownService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.SecurityContext, decorators: [{
                    type: Inject,
                    args: [SECURITY_CONTEXT]
                }] }, { type: i1.HttpClient, decorators: [{
                    type: Optional
                }] }, { type: i2.ClipboardOptions, decorators: [{
                    type: Optional
                }] }, { type: i3.MarkedOptions, decorators: [{
                    type: Optional
                }] }, { type: i4.DomSanitizer }, { type: i0.ComponentFactoryResolver }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFya2Rvd24uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9zcmMvbWFya2Rvd24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUVwRCxPQUFPLEVBQTZDLE1BQU0sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQXFDLE1BQU0sZUFBZSxDQUFDO0FBRXhLLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQzFDLE9BQU8sRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDM0MsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXJDLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBSXhFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQzs7Ozs7O0FBdUJuRCw0QkFBNEI7QUFDNUIsTUFBTSxDQUFDLE1BQU0sdUJBQXVCLEdBQUcsNkpBQTZKLENBQUM7QUFDck0sTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQUcscUpBQXFKLENBQUM7QUFDekwsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQUcseUpBQXlKLENBQUM7QUFDL0wsTUFBTSxDQUFDLE1BQU0sdUJBQXVCLEdBQUcsNkpBQTZKLENBQUM7QUFDck0sTUFBTSxDQUFDLE1BQU0sbUNBQW1DLEdBQUcsbUpBQW1KLENBQUM7QUFDdk0sTUFBTSxDQUFDLE1BQU0seUJBQXlCLEdBQUcsMkpBQTJKLENBQUM7QUFDck0sMkJBQTJCO0FBRTNCLE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFHLElBQUksY0FBYyxDQUFrQixrQkFBa0IsQ0FBQyxDQUFDO0FBbUJ4RixNQUFNLE9BQU8sZ0JBQWlCLFNBQVEsUUFBUTtJQUE5Qzs7UUFDRSxpQ0FBNEIsR0FBRyxLQUFLLENBQUM7SUFDdkMsQ0FBQztDQUFBO0FBR0QsTUFBTSxPQUFPLGVBQWU7SUFzRDFCLFlBQytCLFFBQWdCLEVBQ1gsZUFBZ0MsRUFDOUMsSUFBZ0IsRUFDaEIsZ0JBQWtDLEVBQzFDLE9BQXNCLEVBQzFCLFNBQXVCLEVBQ3ZCLHdCQUFrRDtRQU43QixhQUFRLEdBQVIsUUFBUSxDQUFRO1FBQ1gsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQzlDLFNBQUksR0FBSixJQUFJLENBQVk7UUFDaEIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUU5QyxjQUFTLEdBQVQsU0FBUyxDQUFjO1FBQ3ZCLDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBMEI7UUEzRDNDLDBCQUFxQixHQUFpQjtZQUNyRCxVQUFVLEVBQUUsS0FBSztZQUNqQixNQUFNLEVBQUUsS0FBSztZQUNiLEtBQUssRUFBRSxLQUFLO1lBQ1osT0FBTyxFQUFFLEtBQUs7WUFDZCxhQUFhLEVBQUUsU0FBUztTQUN6QixDQUFDO1FBRWUsMkJBQXNCLEdBQWtCO1lBQ3ZELFNBQVMsRUFBRSxLQUFLO1lBQ2hCLGdCQUFnQixFQUFFLFNBQVM7WUFDM0IsS0FBSyxFQUFFLEtBQUs7WUFDWixZQUFZLEVBQUUsU0FBUztTQUN4QixDQUFDO1FBRWUsMkJBQXNCLEdBQWtCO1lBQ3ZELFFBQVEsRUFBRSxJQUFJLGNBQWMsRUFBRTtTQUMvQixDQUFDO1FBRWUsMEJBQXFCLEdBQWlCO1lBQ3JELFVBQVUsRUFBRTtnQkFDVixFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFO2dCQUMxQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO2dCQUN6QyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO2dCQUM3QyxFQUFFLElBQUksRUFBRSxtQkFBbUIsRUFBRSxLQUFLLEVBQUUsaUJBQWlCLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRTtnQkFDdEUsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFO2dCQUNoRSxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRTtnQkFDcEUsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLGVBQWUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFO2dCQUNsRSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFO2dCQUMxRCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFO2FBQzdDO1NBQ0YsQ0FBQztRQUVlLDhCQUF5QixHQUFxQjtZQUM3RCxlQUFlLEVBQUUsU0FBUztTQUMzQixDQUFDO1FBY2UsYUFBUSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFDdkMsWUFBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUM7UUFXOUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDekIsQ0FBQztJQXZCRCxJQUFJLE9BQU8sS0FBZ0MsT0FBTyxJQUFJLENBQUMsUUFBUyxDQUFDLENBQUMsQ0FBQztJQUNuRSxJQUFJLE9BQU8sQ0FBQyxLQUFnQztRQUMxQyxJQUFJLENBQUMsUUFBUSxtQ0FBUSxJQUFJLENBQUMsc0JBQXNCLEdBQUssS0FBSyxDQUFFLENBQUM7SUFDL0QsQ0FBQztJQUVELElBQUksUUFBUSxLQUFxQixPQUFPLElBQUksQ0FBQyxPQUFRLENBQUMsUUFBUyxDQUFDLENBQUMsQ0FBQztJQUNsRSxJQUFJLFFBQVEsQ0FBQyxLQUFxQjtRQUNoQyxJQUFJLENBQUMsT0FBUSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7SUFDakMsQ0FBQztJQWlCRCxLQUFLLENBQUMsUUFBZ0IsRUFBRSxVQUF3QixJQUFJLENBQUMscUJBQXFCO1FBQ3hFLE1BQU0sRUFDSixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxPQUFPLEVBQ1AsYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFRLEdBQzlCLEdBQUcsT0FBTyxDQUFDO1FBRVosSUFBSSxPQUFPLEVBQUU7WUFDWCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLFFBQVEsSUFBSSxJQUFJLFFBQVEsRUFBRSxDQUFDLENBQUM7U0FDL0U7UUFFRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ2hFLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQzdELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVsRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3JFLENBQUM7SUFFRCxNQUFNLENBQUMsT0FBb0IsRUFBRSxVQUF5QixJQUFJLENBQUMsc0JBQXNCLEVBQUUsZ0JBQW1DO1FBQ3BILE1BQU0sRUFDSixTQUFTLEVBQ1QsZ0JBQWdCLEVBQ2hCLEtBQUssRUFDTCxZQUFZLEdBQ2IsR0FBRyxPQUFPLENBQUM7UUFFWixJQUFJLFNBQVMsRUFBRTtZQUNiLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLGdCQUFnQixnREFDekMsSUFBSSxDQUFDLHlCQUF5QixHQUM5QixJQUFJLENBQUMsZ0JBQWdCLEdBQ3JCLGdCQUFnQixFQUNuQixDQUFDO1NBQ0o7UUFDRCxJQUFJLEtBQUssRUFBRTtZQUNULElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxrQ0FDbkIsSUFBSSxDQUFDLHFCQUFxQixHQUMxQixZQUFZLEVBQ2YsQ0FBQztTQUNKO1FBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVELFNBQVMsQ0FBQyxHQUFXO1FBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1NBQzVDO1FBQ0QsT0FBTyxJQUFJLENBQUMsSUFBSTthQUNiLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLENBQUM7YUFDbEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRUQsU0FBUyxDQUFDLE9BQTRCO1FBQ3BDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDckMsT0FBTztTQUNSO1FBQ0QsSUFBSSxPQUFPLEtBQUssS0FBSyxXQUFXLEVBQUU7WUFDaEMsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDWixPQUFPLEdBQUcsUUFBUSxDQUFDO2FBQ3BCO1lBQ0QsTUFBTSxrQkFBa0IsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsb0NBQW9DLENBQUMsQ0FBQztZQUMxRixLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFVLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDbkcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2xDO0lBQ0gsQ0FBQztJQUVPLGNBQWMsQ0FBQyxRQUFrQjtRQUN2QyxNQUFNLGdCQUFnQixHQUFHLFFBQTRCLENBQUM7UUFDdEQsSUFBSSxnQkFBZ0IsQ0FBQyw0QkFBNEIsS0FBSyxJQUFJLEVBQUU7WUFDMUQsT0FBTyxRQUFRLENBQUM7U0FDakI7UUFFRCw2REFBNkQ7UUFDN0QsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztRQUNsQyxRQUFRLENBQUMsSUFBSSxHQUFHLFVBQVUsSUFBWSxFQUFFLFFBQTRCLEVBQUUsU0FBa0I7WUFDdEYsT0FBTyxRQUFRLEtBQUssU0FBUztnQkFDM0IsQ0FBQyxDQUFDLHdCQUF3QixJQUFJLFFBQVE7Z0JBQ3RDLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3hELENBQUMsQ0FBQztRQUVGLGdCQUFnQixDQUFDLDRCQUE0QixHQUFHLElBQUksQ0FBQztRQUVyRCxPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBRU8sVUFBVSxDQUFDLElBQVk7UUFDN0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNyQyxPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNwRCxRQUFRLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUMxQixPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUM7SUFDeEIsQ0FBQztJQUVPLGVBQWUsQ0FBQyxHQUFXLEVBQUUsUUFBZ0I7UUFDbkQsTUFBTSxTQUFTLEdBQUcsR0FBRztZQUNuQixDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFO1lBQ2hELENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDUCxPQUFPLFNBQVMsS0FBSyxJQUFJO1lBQ3ZCLENBQUMsQ0FBQyxLQUFLLEdBQUcsU0FBUyxHQUFHLElBQUksR0FBRyxRQUFRLEdBQUcsT0FBTztZQUMvQyxDQUFDLENBQUMsUUFBUSxDQUFDO0lBQ2YsQ0FBQztJQUVPLFdBQVcsQ0FBQyxJQUFZLEVBQUUsYUFBNEIsRUFBRSxNQUFNLEdBQUcsS0FBSztRQUM1RSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3JDLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxJQUFJLE1BQU0sRUFBRTtZQUNWLE9BQU8sTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7U0FDaEQ7UUFDRCxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFTyxVQUFVLENBQUMsSUFBWTtRQUM3QixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3JDLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxJQUFJLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxPQUFPLFNBQVMsQ0FBQyxrQkFBa0IsS0FBSyxXQUFXLEVBQUU7WUFDM0YsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1NBQzFDO1FBQ0QsT0FBTyxTQUFTLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVPLFdBQVcsQ0FBQyxPQUFvQixFQUFFLE9BQXFCO1FBQzdELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDckMsT0FBTztTQUNSO1FBQ0QsSUFBSSxPQUFPLEtBQUssS0FBSyxXQUFXLElBQUksT0FBTyxtQkFBbUIsS0FBSyxXQUFXLEVBQUU7WUFDOUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1NBQ3RDO1FBQ0QsbUJBQW1CLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFTyxlQUFlLENBQUMsT0FBb0IsRUFBRSxnQkFBOEMsRUFBRSxPQUErQjtRQUMzSCxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3JDLE9BQU87U0FDUjtRQUNELElBQUksT0FBTyxXQUFXLEtBQUssV0FBVyxFQUFFO1lBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztTQUMxQztRQUNELElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUNyQixNQUFNLElBQUksS0FBSyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7U0FDdEQ7UUFFRCxNQUFNLEVBQ0osZUFBZSxFQUNmLGNBQWMsR0FDZixHQUFHLE9BQU8sQ0FBQztRQUVaLDhCQUE4QjtRQUM5QixNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDM0MsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV2QywrQkFBK0I7WUFDL0IsTUFBTSxpQkFBaUIsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hELGlCQUFpQixDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO1lBQzlDLFVBQVUsQ0FBQyxVQUFXLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ25FLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUUxQyx5QkFBeUI7WUFDekIsTUFBTSxxQkFBcUIsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzVELHFCQUFxQixDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO1lBQ2xELHFCQUFxQixDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDO1lBQ3pDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1lBQzNDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1lBQzFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsd0JBQXdCLENBQUM7WUFDbEUsaUJBQWlCLENBQUMscUJBQXFCLENBQUMsV0FBVyxFQUFFLHFCQUFxQixDQUFDLENBQUM7WUFFNUUseUNBQXlDO1lBQ3pDLFVBQVUsQ0FBQyxXQUFXLEdBQUcsR0FBRyxFQUFFLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7WUFDekUsVUFBVSxDQUFDLFVBQVUsR0FBRyxHQUFHLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztZQUV4RSwyQ0FBMkM7WUFDM0MsSUFBSSxlQUF5QyxDQUFDO1lBRTlDLDRDQUE0QztZQUM1Qyw0Q0FBNEM7WUFDNUMsSUFBSSxlQUFlLEVBQUU7Z0JBQ25CLE1BQU0sYUFBYSxHQUNqQixJQUFJLENBQUMsd0JBQXdCLENBQUMsdUJBQXVCLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQ3pFLE1BQU0sWUFBWSxHQUFHLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDckUsZUFBZSxHQUFHLFlBQVksQ0FBQyxRQUFvQyxDQUFDO2FBQ3JFO1lBQ0QsMkNBQTJDO2lCQUN0QyxJQUFJLGNBQWMsRUFBRTtnQkFDdkIsZUFBZSxHQUFHLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxDQUFDO2FBQ3ZFO1lBQ0Qsd0JBQXdCO2lCQUNuQjtnQkFDSCxNQUFNLGFBQWEsR0FDakIsSUFBSSxDQUFDLHdCQUF3QixDQUFDLHVCQUF1QixDQUFDLHdCQUF3QixDQUFDLENBQUM7Z0JBQ2xGLE1BQU0sWUFBWSxHQUFHLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDckUsZUFBZSxHQUFHLFlBQVksQ0FBQyxRQUFvQyxDQUFDO2FBQ3JFO1lBRUQsc0NBQXNDO1lBQ3RDLElBQUksaUJBQXFDLENBQUM7WUFFMUMsbUNBQW1DO1lBQ25DLGVBQWUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBaUIsRUFBRSxFQUFFO2dCQUN0RCxJQUFJLENBQUMsV0FBVyxHQUFHLEdBQUcsRUFBRSxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO2dCQUNuRSxxQkFBcUIsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3hDLGlCQUFpQixHQUFHLElBQUksV0FBVyxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUNsRixDQUFDLENBQUMsQ0FBQztZQUVILG9EQUFvRDtZQUNwRCxlQUFlLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7U0FDOUQ7SUFDSCxDQUFDO0lBRU8sZUFBZSxDQUFDLFFBQWdCO1FBQ3RDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDYixPQUFPLEVBQUUsQ0FBQztTQUNYO1FBQ0QsSUFBSSxXQUFtQixDQUFDO1FBQ3hCLE9BQU8sUUFBUTthQUNaLEtBQUssQ0FBQyxJQUFJLENBQUM7YUFDWCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDVixJQUFJLGNBQWMsR0FBRyxXQUFXLENBQUM7WUFDakMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDbkIsY0FBYyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUM7b0JBQ3BDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztvQkFDckIsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQzthQUNuRDtZQUNELElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFO2dCQUN0QixXQUFXLEdBQUcsY0FBYyxDQUFDO2FBQzlCO1lBQ0QsT0FBTyxjQUFjO2dCQUNuQixDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7Z0JBQ2hDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDWCxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEIsQ0FBQzs7NEdBaFRVLGVBQWUsa0JBdURoQixXQUFXLGFBQ1gsZ0JBQWdCO2dIQXhEZixlQUFlOzJGQUFmLGVBQWU7a0JBRDNCLFVBQVU7MERBd0RnQyxNQUFNOzBCQUE1QyxNQUFNOzJCQUFDLFdBQVc7OzBCQUNsQixNQUFNOzJCQUFDLGdCQUFnQjs7MEJBQ3ZCLFFBQVE7OzBCQUNSLFFBQVE7OzBCQUNSLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBFbWJlZGRlZFZpZXdSZWYsIEluamVjdCwgSW5qZWN0YWJsZSwgSW5qZWN0aW9uVG9rZW4sIE9wdGlvbmFsLCBQTEFURk9STV9JRCwgU2VjdXJpdHlDb250ZXh0LCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7IG1hcmtlZCwgUmVuZGVyZXIgfSBmcm9tICdtYXJrZWQnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBDbGlwYm9hcmRCdXR0b25Db21wb25lbnQgfSBmcm9tICcuL2NsaXBib2FyZC1idXR0b24uY29tcG9uZW50JztcbmltcG9ydCB7IENsaXBib2FyZE9wdGlvbnMsIENsaXBib2FyZFJlbmRlck9wdGlvbnMgfSBmcm9tICcuL2NsaXBib2FyZC1vcHRpb25zJztcbmltcG9ydCB7IEthdGV4T3B0aW9ucyB9IGZyb20gJy4va2F0ZXgtb3B0aW9ucyc7XG5pbXBvcnQgeyBNYXJrZWRPcHRpb25zIH0gZnJvbSAnLi9tYXJrZWQtb3B0aW9ucyc7XG5pbXBvcnQgeyBNYXJrZWRSZW5kZXJlciB9IGZyb20gJy4vbWFya2VkLXJlbmRlcmVyJztcblxuLy8gY2xpcGJvYXJkXG5kZWNsYXJlIGxldCBDbGlwYm9hcmRKUzoge1xuICBuZXcgKFxuICAgIHNlbGVjdG9yOiBzdHJpbmcgfCBFbGVtZW50IHwgTm9kZUxpc3RPZjxFbGVtZW50PixcbiAgICBvcHRpb25zPzogeyB0ZXh0PzogKGVsZW06IEVsZW1lbnQpID0+IHN0cmluZzsgfSxcbiAgKTogdHlwZW9mIENsaXBib2FyZEpTO1xuICBkZXN0cm95KCk6IHZvaWQ7XG59O1xuXG4vLyBlbW9qaVxuZGVjbGFyZSBsZXQgam95cGl4ZWxzOiB7XG4gIHNob3J0bmFtZVRvVW5pY29kZShpbnB1dDogc3RyaW5nKTogc3RyaW5nO1xufTtcblxuZGVjbGFyZSBsZXQga2F0ZXg6IHVua25vd247XG5kZWNsYXJlIGZ1bmN0aW9uIHJlbmRlck1hdGhJbkVsZW1lbnQoZWxlbTogSFRNTEVsZW1lbnQsIG9wdGlvbnM/OiBLYXRleE9wdGlvbnMpOiB2b2lkO1xuXG5kZWNsYXJlIGxldCBQcmlzbToge1xuICBoaWdobGlnaHRBbGxVbmRlcjogKGVsZW1lbnQ6IEVsZW1lbnQgfCBEb2N1bWVudCkgPT4gdm9pZDtcbn07XG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cbmV4cG9ydCBjb25zdCBlcnJvckpveVBpeGVsc05vdExvYWRlZCA9ICdbbmd4LW1hcmtkb3duXSBXaGVuIHVzaW5nIHRoZSBgZW1vamlgIGF0dHJpYnV0ZSB5b3UgKmhhdmUgdG8qIGluY2x1ZGUgRW1vamktVG9vbGtpdCBmaWxlcyB0byBgYW5ndWxhci5qc29uYCBvciB1c2UgaW1wb3J0cy4gU2VlIFJFQURNRSBmb3IgbW9yZSBpbmZvcm1hdGlvbic7XG5leHBvcnQgY29uc3QgZXJyb3JLYXRleE5vdExvYWRlZCA9ICdbbmd4LW1hcmtkb3duXSBXaGVuIHVzaW5nIHRoZSBga2F0ZXhgIGF0dHJpYnV0ZSB5b3UgKmhhdmUgdG8qIGluY2x1ZGUgS2FUZVggZmlsZXMgdG8gYGFuZ3VsYXIuanNvbmAgb3IgdXNlIGltcG9ydHMuIFNlZSBSRUFETUUgZm9yIG1vcmUgaW5mb3JtYXRpb24nO1xuZXhwb3J0IGNvbnN0IGVycm9yTWVybWFpZE5vdExvYWRlZCA9ICdbbmd4LW1hcmtkb3duXSBXaGVuIHVzaW5nIHRoZSBgbWVybWFpZGAgYXR0cmlidXRlIHlvdSAqaGF2ZSB0byogaW5jbHVkZSBNZXJtYWlkIGZpbGVzIHRvIGBhbmd1bGFyLmpzb25gIG9yIHVzZSBpbXBvcnRzLiBTZWUgUkVBRE1FIGZvciBtb3JlIGluZm9ybWF0aW9uJztcbmV4cG9ydCBjb25zdCBlcnJvckNsaXBib2FyZE5vdExvYWRlZCA9ICdbbmd4LW1hcmtkb3duXSBXaGVuIHVzaW5nIHRoZSBgY2xpcGJvYXJkYCBhdHRyaWJ1dGUgeW91ICpoYXZlIHRvKiBpbmNsdWRlIENsaXBib2FyZCBmaWxlcyB0byBgYW5ndWxhci5qc29uYCBvciB1c2UgaW1wb3J0cy4gU2VlIFJFQURNRSBmb3IgbW9yZSBpbmZvcm1hdGlvbic7XG5leHBvcnQgY29uc3QgZXJyb3JDbGlwYm9hcmRWaWV3Q29udGFpbmVyUmVxdWlyZWQgPSAnW25neC1tYXJrZG93bl0gV2hlbiB1c2luZyB0aGUgYGNsaXBib2FyZGAgYXR0cmlidXRlIHlvdSAqaGF2ZSB0byogcHJvdmlkZSB0aGUgYHZpZXdDb250YWluZXJSZWZgIHBhcmFtZXRlciB0byBgTWFya2Rvd25TZXJ2aWNlLnJlbmRlcigpYCBmdW5jdGlvbic7XG5leHBvcnQgY29uc3QgZXJyb3JTcmNXaXRob3V0SHR0cENsaWVudCA9ICdbbmd4LW1hcmtkb3duXSBXaGVuIHVzaW5nIHRoZSBgc3JjYCBhdHRyaWJ1dGUgeW91ICpoYXZlIHRvKiBwYXNzIHRoZSBgSHR0cENsaWVudGAgYXMgYSBwYXJhbWV0ZXIgb2YgdGhlIGBmb3JSb290YCBtZXRob2QuIFNlZSBSRUFETUUgZm9yIG1vcmUgaW5mb3JtYXRpb24nO1xuLyogZXNsaW50LWVuYWJsZSBtYXgtbGVuICovXG5cbmV4cG9ydCBjb25zdCBTRUNVUklUWV9DT05URVhUID0gbmV3IEluamVjdGlvblRva2VuPFNlY3VyaXR5Q29udGV4dD4oJ1NFQ1VSSVRZX0NPTlRFWFQnKTtcblxuZXhwb3J0IGludGVyZmFjZSBQYXJzZU9wdGlvbnMge1xuICBkZWNvZGVIdG1sPzogYm9vbGVhbjtcbiAgaW5saW5lPzogYm9vbGVhbjtcbiAgZW1vamk/OiBib29sZWFuO1xuICBtZXJtYWlkPzogYm9vbGVhbjtcbiAgbWFya2VkT3B0aW9ucz86IE1hcmtlZE9wdGlvbnM7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVuZGVyT3B0aW9ucyB7XG4gIGNsaXBib2FyZD86IGJvb2xlYW47XG4gIGNsaXBib2FyZE9wdGlvbnM/OiBDbGlwYm9hcmRSZW5kZXJPcHRpb25zO1xuICBrYXRleD86IGJvb2xlYW47XG4gIGthdGV4T3B0aW9ucz86IEthdGV4T3B0aW9ucztcbiAgbWVybWFpZD86IGJvb2xlYW47XG4gIC8vIG1lcm1haWRPcHRpb25zPzogTWVybWFpZEFQSS5Db25maWc7XG59XG5cbmV4cG9ydCBjbGFzcyBFeHRlbmRlZFJlbmRlcmVyIGV4dGVuZHMgUmVuZGVyZXIge1xuICDJtU5neE1hcmtkb3duUmVuZGVyZXJFeHRlbmRlZCA9IGZhbHNlO1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTWFya2Rvd25TZXJ2aWNlIHtcblxuICBwcml2YXRlIHJlYWRvbmx5IERFRkFVTFRfUEFSU0VfT1BUSU9OUzogUGFyc2VPcHRpb25zID0ge1xuICAgIGRlY29kZUh0bWw6IGZhbHNlLFxuICAgIGlubGluZTogZmFsc2UsXG4gICAgZW1vamk6IGZhbHNlLFxuICAgIG1lcm1haWQ6IGZhbHNlLFxuICAgIG1hcmtlZE9wdGlvbnM6IHVuZGVmaW5lZCxcbiAgfTtcblxuICBwcml2YXRlIHJlYWRvbmx5IERFRkFVTFRfUkVOREVSX09QVElPTlM6IFJlbmRlck9wdGlvbnMgPSB7XG4gICAgY2xpcGJvYXJkOiBmYWxzZSxcbiAgICBjbGlwYm9hcmRPcHRpb25zOiB1bmRlZmluZWQsXG4gICAga2F0ZXg6IGZhbHNlLFxuICAgIGthdGV4T3B0aW9uczogdW5kZWZpbmVkLFxuICB9O1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgREVGQVVMVF9NQVJLRURfT1BUSU9OUzogTWFya2VkT3B0aW9ucyA9IHtcbiAgICByZW5kZXJlcjogbmV3IE1hcmtlZFJlbmRlcmVyKCksXG4gIH07XG5cbiAgcHJpdmF0ZSByZWFkb25seSBERUZBVUxUX0tBVEVYX09QVElPTlM6IEthdGV4T3B0aW9ucyA9IHtcbiAgICBkZWxpbWl0ZXJzOiBbXG4gICAgICB7IGxlZnQ6IFwiJCRcIiwgcmlnaHQ6IFwiJCRcIiwgZGlzcGxheTogdHJ1ZSB9LFxuICAgICAgeyBsZWZ0OiBcIiRcIiwgcmlnaHQ6IFwiJFwiLCBkaXNwbGF5OiBmYWxzZSB9LFxuICAgICAgeyBsZWZ0OiBcIlxcXFwoXCIsIHJpZ2h0OiBcIlxcXFwpXCIsIGRpc3BsYXk6IGZhbHNlIH0sXG4gICAgICB7IGxlZnQ6IFwiXFxcXGJlZ2lue2VxdWF0aW9ufVwiLCByaWdodDogXCJcXFxcZW5ke2VxdWF0aW9ufVwiLCBkaXNwbGF5OiB0cnVlIH0sXG4gICAgICB7IGxlZnQ6IFwiXFxcXGJlZ2lue2FsaWdufVwiLCByaWdodDogXCJcXFxcZW5ke2FsaWdufVwiLCBkaXNwbGF5OiB0cnVlIH0sXG4gICAgICB7IGxlZnQ6IFwiXFxcXGJlZ2lue2FsaWduYXR9XCIsIHJpZ2h0OiBcIlxcXFxlbmR7YWxpZ25hdH1cIiwgZGlzcGxheTogdHJ1ZSB9LFxuICAgICAgeyBsZWZ0OiBcIlxcXFxiZWdpbntnYXRoZXJ9XCIsIHJpZ2h0OiBcIlxcXFxlbmR7Z2F0aGVyfVwiLCBkaXNwbGF5OiB0cnVlIH0sXG4gICAgICB7IGxlZnQ6IFwiXFxcXGJlZ2lue0NEfVwiLCByaWdodDogXCJcXFxcZW5ke0NEfVwiLCBkaXNwbGF5OiB0cnVlIH0sXG4gICAgICB7IGxlZnQ6IFwiXFxcXFtcIiwgcmlnaHQ6IFwiXFxcXF1cIiwgZGlzcGxheTogdHJ1ZSB9LFxuICAgIF0sXG4gIH07XG5cbiAgcHJpdmF0ZSByZWFkb25seSBERUZBVUxUX0NMSVBCT0FSRF9PUFRJT05TOiBDbGlwYm9hcmRPcHRpb25zID0ge1xuICAgIGJ1dHRvbkNvbXBvbmVudDogdW5kZWZpbmVkLFxuICB9O1xuXG4gIHByaXZhdGUgX29wdGlvbnM6IE1hcmtlZE9wdGlvbnMgfCB1bmRlZmluZWQ7XG5cbiAgZ2V0IG9wdGlvbnMoKTogTWFya2VkT3B0aW9ucyB8IHVuZGVmaW5lZCB7IHJldHVybiB0aGlzLl9vcHRpb25zITsgfVxuICBzZXQgb3B0aW9ucyh2YWx1ZTogTWFya2VkT3B0aW9ucyB8IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuX29wdGlvbnMgPSB7IC4uLnRoaXMuREVGQVVMVF9NQVJLRURfT1BUSU9OUywgLi4udmFsdWUgfTtcbiAgfVxuXG4gIGdldCByZW5kZXJlcigpOiBNYXJrZWRSZW5kZXJlciB7IHJldHVybiB0aGlzLm9wdGlvbnMhLnJlbmRlcmVyITsgfVxuICBzZXQgcmVuZGVyZXIodmFsdWU6IE1hcmtlZFJlbmRlcmVyKSB7XG4gICAgdGhpcy5vcHRpb25zIS5yZW5kZXJlciA9IHZhbHVlO1xuICB9XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfcmVsb2FkJCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gIHJlYWRvbmx5IHJlbG9hZCQgPSB0aGlzLl9yZWxvYWQkLmFzT2JzZXJ2YWJsZSgpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgcGxhdGZvcm06IE9iamVjdCxcbiAgICBASW5qZWN0KFNFQ1VSSVRZX0NPTlRFWFQpIHByaXZhdGUgc2VjdXJpdHlDb250ZXh0OiBTZWN1cml0eUNvbnRleHQsXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgY2xpcGJvYXJkT3B0aW9uczogQ2xpcGJvYXJkT3B0aW9ucyxcbiAgICBAT3B0aW9uYWwoKSBvcHRpb25zOiBNYXJrZWRPcHRpb25zLFxuICAgIHByaXZhdGUgc2FuaXRpemVyOiBEb21TYW5pdGl6ZXIsXG4gICAgcHJpdmF0ZSBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlclxuICApIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICB9XG5cbiAgcGFyc2UobWFya2Rvd246IHN0cmluZywgb3B0aW9uczogUGFyc2VPcHRpb25zID0gdGhpcy5ERUZBVUxUX1BBUlNFX09QVElPTlMpOiBzdHJpbmcge1xuICAgIGNvbnN0IHtcbiAgICAgIGRlY29kZUh0bWwsXG4gICAgICBpbmxpbmUsXG4gICAgICBlbW9qaSxcbiAgICAgIG1lcm1haWQsXG4gICAgICBtYXJrZWRPcHRpb25zID0gdGhpcy5vcHRpb25zISxcbiAgICB9ID0gb3B0aW9ucztcblxuICAgIGlmIChtZXJtYWlkKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyID0gdGhpcy5leHRlbmRSZW5kZXJlcihtYXJrZWRPcHRpb25zLnJlbmRlcmVyIHx8IG5ldyBSZW5kZXJlcigpKTtcbiAgICB9XG5cbiAgICBjb25zdCB0cmltbWVkID0gdGhpcy50cmltSW5kZW50YXRpb24obWFya2Rvd24pO1xuICAgIGNvbnN0IGRlY29kZWQgPSBkZWNvZGVIdG1sID8gdGhpcy5kZWNvZGVIdG1sKHRyaW1tZWQpIDogdHJpbW1lZDtcbiAgICBjb25zdCBlbW9qaWZpZWQgPSBlbW9qaSA/IHRoaXMucGFyc2VFbW9qaShkZWNvZGVkKSA6IGRlY29kZWQ7XG4gICAgY29uc3QgbWFya2VkID0gdGhpcy5wYXJzZU1hcmtlZChlbW9qaWZpZWQsIG1hcmtlZE9wdGlvbnMsIGlubGluZSk7XG5cbiAgICByZXR1cm4gdGhpcy5zYW5pdGl6ZXIuc2FuaXRpemUodGhpcy5zZWN1cml0eUNvbnRleHQsIG1hcmtlZCkgfHwgJyc7XG4gIH1cblxuICByZW5kZXIoZWxlbWVudDogSFRNTEVsZW1lbnQsIG9wdGlvbnM6IFJlbmRlck9wdGlvbnMgPSB0aGlzLkRFRkFVTFRfUkVOREVSX09QVElPTlMsIHZpZXdDb250YWluZXJSZWY/OiBWaWV3Q29udGFpbmVyUmVmKTogdm9pZCB7XG4gICAgY29uc3Qge1xuICAgICAgY2xpcGJvYXJkLFxuICAgICAgY2xpcGJvYXJkT3B0aW9ucyxcbiAgICAgIGthdGV4LFxuICAgICAga2F0ZXhPcHRpb25zLFxuICAgIH0gPSBvcHRpb25zO1xuXG4gICAgaWYgKGNsaXBib2FyZCkge1xuICAgICAgdGhpcy5yZW5kZXJDbGlwYm9hcmQoZWxlbWVudCwgdmlld0NvbnRhaW5lclJlZiwge1xuICAgICAgICAuLi50aGlzLkRFRkFVTFRfQ0xJUEJPQVJEX09QVElPTlMsXG4gICAgICAgIC4uLnRoaXMuY2xpcGJvYXJkT3B0aW9ucyxcbiAgICAgICAgLi4uY2xpcGJvYXJkT3B0aW9ucyxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoa2F0ZXgpIHtcbiAgICAgIHRoaXMucmVuZGVyS2F0ZXgoZWxlbWVudCwge1xuICAgICAgICAuLi50aGlzLkRFRkFVTFRfS0FURVhfT1BUSU9OUyxcbiAgICAgICAgLi4ua2F0ZXhPcHRpb25zLFxuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMuaGlnaGxpZ2h0KGVsZW1lbnQpO1xuICB9XG5cbiAgcmVsb2FkKCk6IHZvaWQge1xuICAgIHRoaXMuX3JlbG9hZCQubmV4dCgpO1xuICB9XG5cbiAgZ2V0U291cmNlKHNyYzogc3RyaW5nKTogT2JzZXJ2YWJsZTxzdHJpbmc+IHtcbiAgICBpZiAoIXRoaXMuaHR0cCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yU3JjV2l0aG91dEh0dHBDbGllbnQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5odHRwXG4gICAgICAuZ2V0KHNyYywgeyByZXNwb25zZVR5cGU6ICd0ZXh0JyB9KVxuICAgICAgLnBpcGUobWFwKG1hcmtkb3duID0+IHRoaXMuaGFuZGxlRXh0ZW5zaW9uKHNyYywgbWFya2Rvd24pKSk7XG4gIH1cblxuICBoaWdobGlnaHQoZWxlbWVudD86IEVsZW1lbnQgfCBEb2N1bWVudCk6IHZvaWQge1xuICAgIGlmICghaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBQcmlzbSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQ7XG4gICAgICB9XG4gICAgICBjb25zdCBub0xhbmd1YWdlRWxlbWVudHMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3ByZSBjb2RlOm5vdChbY2xhc3MqPVwibGFuZ3VhZ2UtXCJdKScpO1xuICAgICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChub0xhbmd1YWdlRWxlbWVudHMsICh4OiBFbGVtZW50KSA9PiB4LmNsYXNzTGlzdC5hZGQoJ2xhbmd1YWdlLW5vbmUnKSk7XG4gICAgICBQcmlzbS5oaWdobGlnaHRBbGxVbmRlcihlbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGV4dGVuZFJlbmRlcmVyKHJlbmRlcmVyOiBSZW5kZXJlcik6IFJlbmRlcmVyIHtcbiAgICBjb25zdCBleHRlbmRlZFJlbmRlcmVyID0gcmVuZGVyZXIgYXMgRXh0ZW5kZWRSZW5kZXJlcjtcbiAgICBpZiAoZXh0ZW5kZWRSZW5kZXJlci7JtU5neE1hcmtkb3duUmVuZGVyZXJFeHRlbmRlZCA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIHJlbmRlcmVyO1xuICAgIH1cblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvdW5ib3VuZC1tZXRob2RcbiAgICBjb25zdCBkZWZhdWx0Q29kZSA9IHJlbmRlcmVyLmNvZGU7XG4gICAgcmVuZGVyZXIuY29kZSA9IGZ1bmN0aW9uIChjb2RlOiBzdHJpbmcsIGxhbmd1YWdlOiBzdHJpbmcgfCB1bmRlZmluZWQsIGlzRXNjYXBlZDogYm9vbGVhbikge1xuICAgICAgcmV0dXJuIGxhbmd1YWdlID09PSAnbWVybWFpZCdcbiAgICAgICAgPyBgPGRpdiBjbGFzcz1cIm1lcm1haWRcIj4ke2NvZGV9PC9kaXY+YFxuICAgICAgICA6IGRlZmF1bHRDb2RlLmNhbGwodGhpcywgY29kZSwgbGFuZ3VhZ2UsIGlzRXNjYXBlZCk7XG4gICAgfTtcblxuICAgIGV4dGVuZGVkUmVuZGVyZXIuybVOZ3hNYXJrZG93blJlbmRlcmVyRXh0ZW5kZWQgPSB0cnVlO1xuXG4gICAgcmV0dXJuIHJlbmRlcmVyO1xuICB9XG5cbiAgcHJpdmF0ZSBkZWNvZGVIdG1sKGh0bWw6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKCFpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtKSkge1xuICAgICAgcmV0dXJuIGh0bWw7XG4gICAgfVxuICAgIGNvbnN0IHRleHRhcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgICB0ZXh0YXJlYS5pbm5lckhUTUwgPSBodG1sO1xuICAgIHJldHVybiB0ZXh0YXJlYS52YWx1ZTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlRXh0ZW5zaW9uKHNyYzogc3RyaW5nLCBtYXJrZG93bjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBleHRlbnNpb24gPSBzcmNcbiAgICAgID8gc3JjLnNwbGl0KCc/JylbMF0uc3BsaXQoJy4nKS5zcGxpY2UoLTEpLmpvaW4oKVxuICAgICAgOiAnJztcbiAgICByZXR1cm4gZXh0ZW5zaW9uICE9PSAnbWQnXG4gICAgICA/ICdgYGAnICsgZXh0ZW5zaW9uICsgJ1xcbicgKyBtYXJrZG93biArICdcXG5gYGAnXG4gICAgICA6IG1hcmtkb3duO1xuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZU1hcmtlZChodG1sOiBzdHJpbmcsIG1hcmtlZE9wdGlvbnM6IE1hcmtlZE9wdGlvbnMsIGlubGluZSA9IGZhbHNlKTogc3RyaW5nIHtcbiAgICBpZiAoIWlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm0pKSB7XG4gICAgICByZXR1cm4gaHRtbDtcbiAgICB9XG4gICAgaWYgKGlubGluZSkge1xuICAgICAgcmV0dXJuIG1hcmtlZC5wYXJzZUlubGluZShodG1sLCBtYXJrZWRPcHRpb25zKTtcbiAgICB9XG4gICAgcmV0dXJuIG1hcmtlZC5wYXJzZShodG1sLCBtYXJrZWRPcHRpb25zKTtcbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VFbW9qaShodG1sOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmICghaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybSkpIHtcbiAgICAgIHJldHVybiBodG1sO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGpveXBpeGVscyA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIGpveXBpeGVscy5zaG9ydG5hbWVUb1VuaWNvZGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JKb3lQaXhlbHNOb3RMb2FkZWQpO1xuICAgIH1cbiAgICByZXR1cm4gam95cGl4ZWxzLnNob3J0bmFtZVRvVW5pY29kZShodG1sKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyS2F0ZXgoZWxlbWVudDogSFRNTEVsZW1lbnQsIG9wdGlvbnM6IEthdGV4T3B0aW9ucyk6IHZvaWQge1xuICAgIGlmICghaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBrYXRleCA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHJlbmRlck1hdGhJbkVsZW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JLYXRleE5vdExvYWRlZCk7XG4gICAgfVxuICAgIHJlbmRlck1hdGhJbkVsZW1lbnQoZWxlbWVudCwgb3B0aW9ucyk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckNsaXBib2FyZChlbGVtZW50OiBIVE1MRWxlbWVudCwgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZiB8IHVuZGVmaW5lZCwgb3B0aW9uczogQ2xpcGJvYXJkUmVuZGVyT3B0aW9ucyk6IHZvaWQge1xuICAgIGlmICghaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBDbGlwYm9hcmRKUyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvckNsaXBib2FyZE5vdExvYWRlZCk7XG4gICAgfVxuICAgIGlmICghdmlld0NvbnRhaW5lclJlZikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yQ2xpcGJvYXJkVmlld0NvbnRhaW5lclJlcXVpcmVkKTtcbiAgICB9XG5cbiAgICBjb25zdCB7XG4gICAgICBidXR0b25Db21wb25lbnQsXG4gICAgICBidXR0b25UZW1wbGF0ZSxcbiAgICB9ID0gb3B0aW9ucztcblxuICAgIC8vIHRhcmdldCBldmVyeSA8cHJlPiBlbGVtZW50c1xuICAgIGNvbnN0IHByZUVsZW1lbnRzID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdwcmUnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByZUVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBwcmVFbGVtZW50ID0gcHJlRWxlbWVudHMuaXRlbShpKTtcblxuICAgICAgLy8gY3JlYXRlIDxwcmU+IHdyYXBwZXIgZWxlbWVudFxuICAgICAgY29uc3QgcHJlV3JhcHBlckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHByZVdyYXBwZXJFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICAgIHByZUVsZW1lbnQucGFyZW50Tm9kZSEuaW5zZXJ0QmVmb3JlKHByZVdyYXBwZXJFbGVtZW50LCBwcmVFbGVtZW50KTtcbiAgICAgIHByZVdyYXBwZXJFbGVtZW50LmFwcGVuZENoaWxkKHByZUVsZW1lbnQpO1xuXG4gICAgICAvLyBjcmVhdGUgdG9vbGJhciBlbGVtZW50XG4gICAgICBjb25zdCB0b29sYmFyV3JhcHBlckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRvb2xiYXJXcmFwcGVyRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICB0b29sYmFyV3JhcHBlckVsZW1lbnQuc3R5bGUudG9wID0gJy41ZW0nO1xuICAgICAgdG9vbGJhcldyYXBwZXJFbGVtZW50LnN0eWxlLnJpZ2h0ID0gJy41ZW0nO1xuICAgICAgdG9vbGJhcldyYXBwZXJFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAnMCc7XG4gICAgICB0b29sYmFyV3JhcHBlckVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9ICdvcGFjaXR5IDI1MG1zIGVhc2Utb3V0JztcbiAgICAgIHByZVdyYXBwZXJFbGVtZW50Lmluc2VydEFkamFjZW50RWxlbWVudCgnYmVmb3JlZW5kJywgdG9vbGJhcldyYXBwZXJFbGVtZW50KTtcblxuICAgICAgLy8gcmVnaXN0ZXIgbGlzdGVuZXIgdG8gc2hvdy9oaWRlIHRvb2xiYXJcbiAgICAgIHByZUVsZW1lbnQub25tb3VzZW92ZXIgPSAoKSA9PiB0b29sYmFyV3JhcHBlckVsZW1lbnQuc3R5bGUub3BhY2l0eSA9ICcxJztcbiAgICAgIHByZUVsZW1lbnQub25tb3VzZW91dCA9ICgpID0+IHRvb2xiYXJXcmFwcGVyRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuXG4gICAgICAvLyBkZWNsYXJlIGVtYmVkZGVkVmlld1JlZiBob2xkaW5nIHZhcmlhYmxlXG4gICAgICBsZXQgZW1iZWRkZWRWaWV3UmVmOiBFbWJlZGRlZFZpZXdSZWY8dW5rbm93bj47XG5cbiAgICAgIC8vIHVzZSBwcm92aWRlZCBjb21wb25lbnQgdmlhIGlucHV0IHByb3BlcnR5XG4gICAgICAvLyBvciBwcm92aWRlZCB2aWEgQ2xpcGJvYXJkT3B0aW9ucyBwcm92aWRlclxuICAgICAgaWYgKGJ1dHRvbkNvbXBvbmVudCkge1xuICAgICAgICBjb25zdCBidXR0b25GYWN0b3J5ID1cbiAgICAgICAgICB0aGlzLmNvbXBvbmVudEZhY3RvcnlSZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShidXR0b25Db21wb25lbnQpO1xuICAgICAgICBjb25zdCBjb21wb25lbnRSZWYgPSB2aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudChidXR0b25GYWN0b3J5KTtcbiAgICAgICAgZW1iZWRkZWRWaWV3UmVmID0gY29tcG9uZW50UmVmLmhvc3RWaWV3IGFzIEVtYmVkZGVkVmlld1JlZjx1bmtub3duPjtcbiAgICAgIH1cbiAgICAgIC8vIHVzZSBwcm92aWRlZCB0ZW1wbGF0ZSB2aWEgaW5wdXQgcHJvcGVydHlcbiAgICAgIGVsc2UgaWYgKGJ1dHRvblRlbXBsYXRlKSB7XG4gICAgICAgIGVtYmVkZGVkVmlld1JlZiA9IHZpZXdDb250YWluZXJSZWYuY3JlYXRlRW1iZWRkZWRWaWV3KGJ1dHRvblRlbXBsYXRlKTtcbiAgICAgIH1cbiAgICAgIC8vIHVzZSBkZWZhdWx0IGNvbXBvbmVudFxuICAgICAgZWxzZSB7XG4gICAgICAgIGNvbnN0IGJ1dHRvbkZhY3RvcnkgPVxuICAgICAgICAgIHRoaXMuY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KENsaXBib2FyZEJ1dHRvbkNvbXBvbmVudCk7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudFJlZiA9IHZpZXdDb250YWluZXJSZWYuY3JlYXRlQ29tcG9uZW50KGJ1dHRvbkZhY3RvcnkpO1xuICAgICAgICBlbWJlZGRlZFZpZXdSZWYgPSBjb21wb25lbnRSZWYuaG9zdFZpZXcgYXMgRW1iZWRkZWRWaWV3UmVmPHVua25vd24+O1xuICAgICAgfVxuXG4gICAgICAvLyBkZWNsYXJlIGNsaXBib2FyZCBpbnN0YW5jZSB2YXJpYWJsZVxuICAgICAgbGV0IGNsaXBib2FyZEluc3RhbmNlOiB0eXBlb2YgQ2xpcGJvYXJkSlM7XG5cbiAgICAgIC8vIGF0dGFjaCBjbGlwYm9hcmQuanMgdG8gcm9vdCBub2RlXG4gICAgICBlbWJlZGRlZFZpZXdSZWYucm9vdE5vZGVzLmZvckVhY2goKG5vZGU6IEhUTUxFbGVtZW50KSA9PiB7XG4gICAgICAgIG5vZGUub25tb3VzZW92ZXIgPSAoKSA9PiB0b29sYmFyV3JhcHBlckVsZW1lbnQuc3R5bGUub3BhY2l0eSA9ICcxJztcbiAgICAgICAgdG9vbGJhcldyYXBwZXJFbGVtZW50LmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICBjbGlwYm9hcmRJbnN0YW5jZSA9IG5ldyBDbGlwYm9hcmRKUyhub2RlLCB7IHRleHQ6ICgpID0+IHByZUVsZW1lbnQuaW5uZXJUZXh0IH0pO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIGRlc3Ryb3kgY2xpcGJvYXJkIGluc3RhbmNlIHdoZW4gdmlldyBpcyBkZXN0cm95ZWRcbiAgICAgIGVtYmVkZGVkVmlld1JlZi5vbkRlc3Ryb3koKCkgPT4gY2xpcGJvYXJkSW5zdGFuY2UuZGVzdHJveSgpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHRyaW1JbmRlbnRhdGlvbihtYXJrZG93bjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAoIW1hcmtkb3duKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGxldCBpbmRlbnRTdGFydDogbnVtYmVyO1xuICAgIHJldHVybiBtYXJrZG93blxuICAgICAgLnNwbGl0KCdcXG4nKVxuICAgICAgLm1hcChsaW5lID0+IHtcbiAgICAgICAgbGV0IGxpbmVJZGVudFN0YXJ0ID0gaW5kZW50U3RhcnQ7XG4gICAgICAgIGlmIChsaW5lLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBsaW5lSWRlbnRTdGFydCA9IGlzTmFOKGxpbmVJZGVudFN0YXJ0KVxuICAgICAgICAgICAgPyBsaW5lLnNlYXJjaCgvXFxTfCQvKVxuICAgICAgICAgICAgOiBNYXRoLm1pbihsaW5lLnNlYXJjaCgvXFxTfCQvKSwgbGluZUlkZW50U3RhcnQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc05hTihpbmRlbnRTdGFydCkpIHtcbiAgICAgICAgICBpbmRlbnRTdGFydCA9IGxpbmVJZGVudFN0YXJ0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsaW5lSWRlbnRTdGFydFxuICAgICAgICAgID8gbGluZS5zdWJzdHJpbmcobGluZUlkZW50U3RhcnQpXG4gICAgICAgICAgOiBsaW5lO1xuICAgICAgfSkuam9pbignXFxuJyk7XG4gIH1cbn1cbiJdfQ==