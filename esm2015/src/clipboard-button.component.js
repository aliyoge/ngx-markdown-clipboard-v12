import { ChangeDetectionStrategy, Component } from '@angular/core';
import { merge, of, Subject, timer } from 'rxjs';
import { switchMap, mapTo, distinctUntilChanged, shareReplay, startWith, map } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
const BUTTON_TEXT_COPY = 'Copy';
const BUTTON_TEXT_COPIED = 'Copied';
export class ClipboardButtonComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpcGJvYXJkLWJ1dHRvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWIvc3JjL2NsaXBib2FyZC1idXR0b24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkUsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNqRCxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxvQkFBb0IsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7QUFFckcsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7QUFDaEMsTUFBTSxrQkFBa0IsR0FBRyxRQUFRLENBQUM7QUFhcEMsTUFBTSxPQUFPLHdCQUF3QjtJQVhyQztRQWFVLGtCQUFhLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQUVuQyxZQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQ3hDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQ25CLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFDUixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUMvQixDQUFDLEVBQ0Ysb0JBQW9CLEVBQUUsRUFDdEIsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUNmLENBQUM7UUFFTyxnQkFBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUN0QyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQ2hCLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU07WUFDbEIsQ0FBQyxDQUFDLGtCQUFrQjtZQUNwQixDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FDdEIsQ0FBQztLQUtIO0lBSEMsc0JBQXNCO1FBQ3BCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDNUIsQ0FBQzs7cUhBdEJVLHdCQUF3Qjt5R0FBeEIsd0JBQXdCLDBEQVR6Qjs7Ozs7O0dBTVQ7MkZBR1Usd0JBQXdCO2tCQVhwQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxvQkFBb0I7b0JBQzlCLFFBQVEsRUFBRTs7Ozs7O0dBTVQ7b0JBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07aUJBQ2hEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgbWVyZ2UsIG9mLCBTdWJqZWN0LCB0aW1lciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgc3dpdGNoTWFwLCBtYXBUbywgZGlzdGluY3RVbnRpbENoYW5nZWQsIHNoYXJlUmVwbGF5LCBzdGFydFdpdGgsIG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuY29uc3QgQlVUVE9OX1RFWFRfQ09QWSA9ICdDb3B5JztcbmNvbnN0IEJVVFRPTl9URVhUX0NPUElFRCA9ICdDb3BpZWQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXJrZG93bi1jbGlwYm9hcmQnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxidXR0b25cbiAgICAgIGNsYXNzPVwibWFya2Rvd24tY2xpcGJvYXJkLWJ1dHRvblwiXG4gICAgICBbY2xhc3MuY29waWVkXT1cImNvcGllZCQgfCBhc3luY1wiXG4gICAgICAoY2xpY2spPVwib25Db3B5VG9DbGlwYm9hcmRDbGljaygpXCJcbiAgICA+e3sgY29waWVkVGV4dCQgfCBhc3luYyB9fTwvYnV0dG9uPlxuICBgLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgQ2xpcGJvYXJkQnV0dG9uQ29tcG9uZW50IHtcblxuICBwcml2YXRlIF9idXR0b25DbGljayQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIHJlYWRvbmx5IGNvcGllZCQgPSB0aGlzLl9idXR0b25DbGljayQucGlwZShcbiAgICBzd2l0Y2hNYXAoKCkgPT4gbWVyZ2UoXG4gICAgICBvZih0cnVlKSxcbiAgICAgIHRpbWVyKDMwMDApLnBpcGUobWFwVG8oZmFsc2UpKSxcbiAgICApKSxcbiAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpLFxuICAgIHNoYXJlUmVwbGF5KDEpLFxuICApO1xuXG4gIHJlYWRvbmx5IGNvcGllZFRleHQkID0gdGhpcy5jb3BpZWQkLnBpcGUoXG4gICAgc3RhcnRXaXRoKGZhbHNlKSxcbiAgICBtYXAoY29waWVkID0+IGNvcGllZFxuICAgICAgPyBCVVRUT05fVEVYVF9DT1BJRURcbiAgICAgIDogQlVUVE9OX1RFWFRfQ09QWSksXG4gICk7XG5cbiAgb25Db3B5VG9DbGlwYm9hcmRDbGljaygpOiB2b2lkIHtcbiAgICB0aGlzLl9idXR0b25DbGljayQubmV4dCgpO1xuICB9XG59XG4iXX0=