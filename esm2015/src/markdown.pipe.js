import { Pipe } from '@angular/core';
import { first } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "./markdown.service";
export class MarkdownPipe {
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
MarkdownPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: MarkdownPipe, deps: [{ token: i0.ElementRef }, { token: i1.MarkdownService }, { token: i0.ViewContainerRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Pipe });
MarkdownPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: MarkdownPipe, name: "markdown" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: MarkdownPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'markdown',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.MarkdownService }, { type: i0.ViewContainerRef }, { type: i0.NgZone }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFya2Rvd24ucGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9zcmMvbWFya2Rvd24ucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQXNCLElBQUksRUFBbUMsTUFBTSxlQUFlLENBQUM7QUFDMUYsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7QUFTdkMsTUFBTSxPQUFPLFlBQVk7SUFFdkIsWUFDVSxVQUFtQyxFQUNuQyxlQUFnQyxFQUNoQyxnQkFBa0MsRUFDbEMsSUFBWTtRQUhaLGVBQVUsR0FBVixVQUFVLENBQXlCO1FBQ25DLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLFNBQUksR0FBSixJQUFJLENBQVE7SUFDbEIsQ0FBQztJQUVMLFNBQVMsQ0FBQyxLQUFhLEVBQUUsT0FBNkI7UUFDcEQsSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFO1lBQ2pCLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFFRCxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtZQUM3QixPQUFPLENBQUMsS0FBSyxDQUFDLDZEQUE2RCxPQUFPLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDNUYsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUU1RCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVE7YUFDZixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDYixTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7UUFFL0csT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQzs7eUdBMUJVLFlBQVk7dUdBQVosWUFBWTsyRkFBWixZQUFZO2tCQUh4QixJQUFJO21CQUFDO29CQUNKLElBQUksRUFBRSxVQUFVO2lCQUNqQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVsZW1lbnRSZWYsIE5nWm9uZSwgUGlwZSwgUGlwZVRyYW5zZm9ybSwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZmlyc3QgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IE1hcmtkb3duU2VydmljZSwgUGFyc2VPcHRpb25zLCBSZW5kZXJPcHRpb25zIH0gZnJvbSAnLi9tYXJrZG93bi5zZXJ2aWNlJztcblxuZXhwb3J0IHR5cGUgTWFya2Rvd25QaXBlT3B0aW9ucyA9IFBhcnNlT3B0aW9ucyAmIFJlbmRlck9wdGlvbnM7XG5cbkBQaXBlKHtcbiAgbmFtZTogJ21hcmtkb3duJyxcbn0pXG5leHBvcnQgY2xhc3MgTWFya2Rvd25QaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIG1hcmtkb3duU2VydmljZTogTWFya2Rvd25TZXJ2aWNlLFxuICAgIHByaXZhdGUgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSxcbiAgKSB7IH1cblxuICB0cmFuc2Zvcm0odmFsdWU6IHN0cmluZywgb3B0aW9ucz86IE1hcmtkb3duUGlwZU9wdGlvbnMpOiBzdHJpbmcge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYE1hcmtkb3duUGlwZSBoYXMgYmVlbiBpbnZva2VkIHdpdGggYW4gaW52YWxpZCB2YWx1ZSB0eXBlIFske3R5cGVvZiB2YWx1ZX1dYCk7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgY29uc3QgbWFya2Rvd24gPSB0aGlzLm1hcmtkb3duU2VydmljZS5wYXJzZSh2YWx1ZSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLnpvbmUub25TdGFibGVcbiAgICAgIC5waXBlKGZpcnN0KCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMubWFya2Rvd25TZXJ2aWNlLnJlbmRlcih0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgb3B0aW9ucywgdGhpcy52aWV3Q29udGFpbmVyUmVmKSk7XG5cbiAgICByZXR1cm4gbWFya2Rvd247XG4gIH1cbn1cbiJdfQ==