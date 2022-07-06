/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, EventEmitter, Input, Output, } from '@angular/core';
import { PrismPlugin } from './prism-plugin';
import * as i0 from "@angular/core";
import * as i1 from "./markdown.service";
export class MarkdownComponent {
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
MarkdownComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: MarkdownComponent, deps: [{ token: i0.ElementRef }, { token: i1.MarkdownService }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Component });
MarkdownComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.0.5", type: MarkdownComponent, selector: "markdown, [markdown]", inputs: { data: "data", src: "src", inline: "inline", clipboard: "clipboard", clipboardButtonComponent: "clipboardButtonComponent", clipboardButtonTemplate: "clipboardButtonTemplate", emoji: "emoji", katex: "katex", katexOptions: "katexOptions", lineHighlight: "lineHighlight", line: "line", lineOffset: "lineOffset", lineNumbers: "lineNumbers", start: "start" }, outputs: { error: "error", load: "load", ready: "ready" }, usesOnChanges: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: MarkdownComponent, decorators: [{
            type: Component,
            args: [{
                    // eslint-disable-next-line @angular-eslint/component-selector
                    selector: 'markdown, [markdown]',
                    template: '<ng-content></ng-content>',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.MarkdownService }, { type: i0.ViewContainerRef }]; }, propDecorators: { data: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFya2Rvd24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGliL3NyYy9tYXJrZG93bi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsc0RBQXNEO0FBQ3RELE9BQU8sRUFFTCxTQUFTLEVBRVQsWUFBWSxFQUNaLEtBQUssRUFHTCxNQUFNLEdBSVAsTUFBTSxlQUFlLENBQUM7QUFJdkIsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7QUFPN0MsTUFBTSxPQUFPLGlCQUFpQjtJQTJENUIsWUFDUyxPQUFnQyxFQUNoQyxlQUFnQyxFQUNoQyxnQkFBa0M7UUFGbEMsWUFBTyxHQUFQLE9BQU8sQ0FBeUI7UUFDaEMsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQ2hDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFoQjNDLGlCQUFpQjtRQUNQLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQ25DLFNBQUksR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFDO1FBQ2xDLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBUSxDQUFDO1FBRW5DLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFDbkIsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUNmLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUNmLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLGlCQUFZLEdBQUcsS0FBSyxDQUFDO0lBTXpCLENBQUM7SUFwREwsSUFDSSxNQUFNLEtBQWMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUM5QyxJQUFJLE1BQU0sQ0FBQyxLQUFjLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWhGLHFCQUFx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c0JBQWhDLEtBQUs7Z0JBQ0csdUJBQXVCO3NCQUEvQixLQUFLO2dCQUlGLEtBQUs7c0JBRFIsS0FBSztnQkFNRixLQUFLO3NCQURSLEtBQUs7Z0JBR0csWUFBWTtzQkFBcEIsS0FBSztnQkFJRixhQUFhO3NCQURoQixLQUFLO2dCQUdHLElBQUk7c0JBQVosS0FBSztnQkFDRyxVQUFVO3NCQUFsQixLQUFLO2dCQUlGLFdBQVc7c0JBRGQsS0FBSztnQkFHRyxLQUFLO3NCQUFiLEtBQUs7Z0JBR0ksS0FBSztzQkFBZCxNQUFNO2dCQUNHLElBQUk7c0JBQWIsTUFBTTtnQkFDRyxLQUFLO3NCQUFkLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnMgKi9cbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE91dHB1dCxcbiAgVGVtcGxhdGVSZWYsXG4gIFR5cGUsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBLYXRleE9wdGlvbnMgfSBmcm9tICcuL2thdGV4LW9wdGlvbnMnO1xuaW1wb3J0IHsgTWFya2Rvd25TZXJ2aWNlLCBQYXJzZU9wdGlvbnMsIFJlbmRlck9wdGlvbnMgfSBmcm9tICcuL21hcmtkb3duLnNlcnZpY2UnO1xuaW1wb3J0IHsgUHJpc21QbHVnaW4gfSBmcm9tICcuL3ByaXNtLXBsdWdpbic7XG5cbkBDb21wb25lbnQoe1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQGFuZ3VsYXItZXNsaW50L2NvbXBvbmVudC1zZWxlY3RvclxuICBzZWxlY3RvcjogJ21hcmtkb3duLCBbbWFya2Rvd25dJyxcbiAgdGVtcGxhdGU6ICc8bmctY29udGVudD48L25nLWNvbnRlbnQ+Jyxcbn0pXG5leHBvcnQgY2xhc3MgTWFya2Rvd25Db21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xuXG4gIHByb3RlY3RlZCBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfY2xpcGJvYXJkOiBib29sZWFuIHwgJyc7XG4gIHByb3RlY3RlZCBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZW1vamk6IGJvb2xlYW4gfCAnJztcbiAgcHJvdGVjdGVkIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9rYXRleDogYm9vbGVhbiB8ICcnO1xuICBwcm90ZWN0ZWQgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2xpbmVIaWdobGlnaHQ6IGJvb2xlYW4gfCAnJztcbiAgcHJvdGVjdGVkIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9saW5lTnVtYmVyczogYm9vbGVhbiB8ICcnO1xuXG4gIEBJbnB1dCgpIGRhdGE6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgc3JjOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgQElucHV0KClcbiAgZ2V0IGlubGluZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2lubGluZTsgfVxuICBzZXQgaW5saW5lKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX2lubGluZSA9IHRoaXMuY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuXG4gIC8vIFBsdWdpbiAtIGNsaXBib2FyZFxuICBASW5wdXQoKVxuICBnZXQgY2xpcGJvYXJkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fY2xpcGJvYXJkOyB9XG4gIHNldCBjbGlwYm9hcmQodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fY2xpcGJvYXJkID0gdGhpcy5jb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIEBJbnB1dCgpIGNsaXBib2FyZEJ1dHRvbkNvbXBvbmVudDogVHlwZTx1bmtub3duPiB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgY2xpcGJvYXJkQnV0dG9uVGVtcGxhdGU6IFRlbXBsYXRlUmVmPHVua25vd24+IHwgdW5kZWZpbmVkO1xuXG4gIC8vIFBsdWdpbiAtIGVtb2ppXG4gIEBJbnB1dCgpXG4gIGdldCBlbW9qaSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2Vtb2ppOyB9XG4gIHNldCBlbW9qaSh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLl9lbW9qaSA9IHRoaXMuY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuXG4gIC8vIFBsdWdpbiAtIGthdGV4XG4gIEBJbnB1dCgpXG4gIGdldCBrYXRleCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2thdGV4OyB9XG4gIHNldCBrYXRleCh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLl9rYXRleCA9IHRoaXMuY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuICBASW5wdXQoKSBrYXRleE9wdGlvbnM6IEthdGV4T3B0aW9ucyB8IHVuZGVmaW5lZDtcblxuICAvLyBQbHVnaW4gLSBsaW5lSGlnaGxpZ2h0XG4gIEBJbnB1dCgpXG4gIGdldCBsaW5lSGlnaGxpZ2h0KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fbGluZUhpZ2hsaWdodDsgfVxuICBzZXQgbGluZUhpZ2hsaWdodCh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLl9saW5lSGlnaGxpZ2h0ID0gdGhpcy5jb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIEBJbnB1dCgpIGxpbmU6IHN0cmluZyB8IHN0cmluZ1tdIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBsaW5lT2Zmc2V0OiBudW1iZXIgfCB1bmRlZmluZWQ7XG5cbiAgLy8gUGx1Z2luIC0gbGluZU51bWJlcnNcbiAgQElucHV0KClcbiAgZ2V0IGxpbmVOdW1iZXJzKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fbGluZU51bWJlcnM7IH1cbiAgc2V0IGxpbmVOdW1iZXJzKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX2xpbmVOdW1iZXJzID0gdGhpcy5jb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIEBJbnB1dCgpIHN0YXJ0OiBudW1iZXIgfCB1bmRlZmluZWQ7XG5cbiAgLy8gRXZlbnQgZW1pdHRlcnNcbiAgQE91dHB1dCgpIGVycm9yID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG4gIEBPdXRwdXQoKSBsb2FkID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG4gIEBPdXRwdXQoKSByZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICBwcml2YXRlIF9jb21tYW5kTGluZSA9IGZhbHNlO1xuICBwcml2YXRlIF9jbGlwYm9hcmQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfZW1vamkgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfaW5saW5lID0gZmFsc2U7XG4gIHByaXZhdGUgX2thdGV4ID0gZmFsc2U7XG4gIHByaXZhdGUgX2xpbmVIaWdobGlnaHQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfbGluZU51bWJlcnMgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHVibGljIG1hcmtkb3duU2VydmljZTogTWFya2Rvd25TZXJ2aWNlLFxuICAgIHB1YmxpYyB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICApIHsgfVxuXG4gIG5nT25DaGFuZ2VzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRhdGEgIT0gbnVsbCkge1xuICAgICAgdGhpcy5oYW5kbGVEYXRhKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLnNyYyAhPSBudWxsKSB7XG4gICAgICB0aGlzLmhhbmRsZVNyYygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZGF0YSAmJiAhdGhpcy5zcmMpIHtcbiAgICAgIHRoaXMuaGFuZGxlVHJhbnNjbHVzaW9uKCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKG1hcmtkb3duOiBzdHJpbmcsIGRlY29kZUh0bWwgPSBmYWxzZSk6IHZvaWQge1xuICAgIGNvbnN0IHBhcnNlZE9wdGlvbnM6IFBhcnNlT3B0aW9ucyA9IHtcbiAgICAgIGRlY29kZUh0bWwsXG4gICAgICBpbmxpbmU6IHRoaXMuaW5saW5lLFxuICAgICAgZW1vamk6IHRoaXMuZW1vamksXG4gICAgfTtcblxuICAgIGNvbnN0IHJlbmRlck9wdGlvbnM6IFJlbmRlck9wdGlvbnMgPSB7XG4gICAgICBjbGlwYm9hcmQ6IHRoaXMuY2xpcGJvYXJkLFxuICAgICAgY2xpcGJvYXJkT3B0aW9uczoge1xuICAgICAgICBidXR0b25Db21wb25lbnQ6IHRoaXMuY2xpcGJvYXJkQnV0dG9uQ29tcG9uZW50LFxuICAgICAgICBidXR0b25UZW1wbGF0ZTogdGhpcy5jbGlwYm9hcmRCdXR0b25UZW1wbGF0ZSxcbiAgICAgIH0sXG4gICAgICBrYXRleDogdGhpcy5rYXRleCxcbiAgICAgIGthdGV4T3B0aW9uczogdGhpcy5rYXRleE9wdGlvbnMsXG4gICAgfTtcblxuICAgIGNvbnN0IHBhcnNlZCA9IHRoaXMubWFya2Rvd25TZXJ2aWNlLnBhcnNlKG1hcmtkb3duLCBwYXJzZWRPcHRpb25zKTtcblxuICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LmlubmVySFRNTCA9IHBhcnNlZDtcblxuICAgIHRoaXMuaGFuZGxlUGx1Z2lucygpO1xuXG4gICAgdGhpcy5tYXJrZG93blNlcnZpY2UucmVuZGVyKHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LCByZW5kZXJPcHRpb25zLCB0aGlzLnZpZXdDb250YWluZXJSZWYpO1xuXG4gICAgdGhpcy5yZWFkeS5lbWl0KCk7XG4gIH1cblxuICBwcml2YXRlIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZTogYm9vbGVhbiB8ICcnKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgYCR7U3RyaW5nKHZhbHVlKX1gICE9PSAnZmFsc2UnO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVEYXRhKCk6IHZvaWQge1xuICAgIHRoaXMucmVuZGVyKHRoaXMuZGF0YSEpO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVTcmMoKTogdm9pZCB7XG4gICAgdGhpcy5tYXJrZG93blNlcnZpY2VcbiAgICAgIC5nZXRTb3VyY2UodGhpcy5zcmMhKVxuICAgICAgLnN1YnNjcmliZSh7XG4gICAgICAgIG5leHQ6IG1hcmtkb3duID0+IHtcbiAgICAgICAgICB0aGlzLnJlbmRlcihtYXJrZG93bik7XG4gICAgICAgICAgdGhpcy5sb2FkLmVtaXQobWFya2Rvd24pO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZXJyb3IgPT4gdGhpcy5lcnJvci5lbWl0KGVycm9yKSxcbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVUcmFuc2NsdXNpb24oKTogdm9pZCB7XG4gICAgdGhpcy5yZW5kZXIodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MLCB0cnVlKTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlUGx1Z2lucygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5saW5lSGlnaGxpZ2h0KSB7XG4gICAgICB0aGlzLnNldFBsdWdpbk9wdGlvbnModGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIHsgZGF0YUxpbmU6IHRoaXMubGluZSwgZGF0YUxpbmVPZmZzZXQ6IHRoaXMubGluZU9mZnNldCB9KTtcbiAgICB9XG4gICAgaWYgKHRoaXMubGluZU51bWJlcnMpIHtcbiAgICAgIHRoaXMuc2V0UGx1Z2luQ2xhc3ModGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIFByaXNtUGx1Z2luLkxpbmVOdW1iZXJzKTtcbiAgICAgIHRoaXMuc2V0UGx1Z2luT3B0aW9ucyh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgeyBkYXRhU3RhcnQ6IHRoaXMuc3RhcnQgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRQbHVnaW5DbGFzcyhlbGVtZW50OiBIVE1MRWxlbWVudCwgcGx1Z2luOiBzdHJpbmcgfCBzdHJpbmdbXSk6IHZvaWQge1xuICAgIGNvbnN0IHByZUVsZW1lbnRzID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdwcmUnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByZUVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjbGFzc2VzID0gcGx1Z2luIGluc3RhbmNlb2YgQXJyYXkgPyBwbHVnaW4gOiBbcGx1Z2luXTtcbiAgICAgIHByZUVsZW1lbnRzLml0ZW0oaSkuY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNldFBsdWdpbk9wdGlvbnMoZWxlbWVudDogSFRNTEVsZW1lbnQsIG9wdGlvbnM6IHsgW2tleTogc3RyaW5nXTogbnVtYmVyIHwgc3RyaW5nIHwgc3RyaW5nW10gfCB1bmRlZmluZWQgfSk6IHZvaWQge1xuICAgIGNvbnN0IHByZUVsZW1lbnRzID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdwcmUnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByZUVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBPYmplY3Qua2V5cyhvcHRpb25zKS5mb3JFYWNoKG9wdGlvbiA9PiB7XG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZVZhbHVlID0gb3B0aW9uc1tvcHRpb25dO1xuICAgICAgICBpZiAoYXR0cmlidXRlVmFsdWUpIHtcbiAgICAgICAgICBjb25zdCBhdHRyaWJ1dGVOYW1lID0gdGhpcy50b0xpc3BDYXNlKG9wdGlvbik7XG4gICAgICAgICAgcHJlRWxlbWVudHMuaXRlbShpKS5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSwgYXR0cmlidXRlVmFsdWUudG9TdHJpbmcoKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdG9MaXNwQ2FzZSh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCB1cHBlckNoYXJzID0gdmFsdWUubWF0Y2goLyhbQS1aXSkvZyk7XG4gICAgaWYgKCF1cHBlckNoYXJzKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIGxldCBzdHIgPSB2YWx1ZS50b1N0cmluZygpO1xuICAgIGZvciAobGV0IGkgPSAwLCBuID0gdXBwZXJDaGFycy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKG5ldyBSZWdFeHAodXBwZXJDaGFyc1tpXSksICctJyArIHVwcGVyQ2hhcnNbaV0udG9Mb3dlckNhc2UoKSk7XG4gICAgfVxuICAgIGlmIChzdHIuc2xpY2UoMCwgMSkgPT09ICctJykge1xuICAgICAgc3RyID0gc3RyLnNsaWNlKDEpO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG4iXX0=