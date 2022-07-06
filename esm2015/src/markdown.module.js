import { CommonModule } from '@angular/common';
import { NgModule, SecurityContext } from '@angular/core';
import { ClipboardButtonComponent } from './clipboard-button.component';
import { LanguagePipe } from './language.pipe';
import { MarkdownComponent } from './markdown.component';
import { MarkdownPipe } from './markdown.pipe';
import { MarkdownService, SECURITY_CONTEXT } from './markdown.service';
import * as i0 from "@angular/core";
const sharedDeclarations = [
    ClipboardButtonComponent,
    LanguagePipe,
    MarkdownComponent,
    MarkdownPipe,
];
const sharedEntryComponents = [
    ClipboardButtonComponent,
];
export class MarkdownModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFya2Rvd24ubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGliL3NyYy9tYXJrZG93bi5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBdUIsUUFBUSxFQUFZLGVBQWUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV6RixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUN4RSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDekQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQzs7QUFhdkUsTUFBTSxrQkFBa0IsR0FBRztJQUN6Qix3QkFBd0I7SUFDeEIsWUFBWTtJQUNaLGlCQUFpQjtJQUNqQixZQUFZO0NBQ2IsQ0FBQztBQUVGLE1BQU0scUJBQXFCLEdBQUc7SUFDNUIsd0JBQXdCO0NBQ3pCLENBQUM7QUFRRixNQUFNLE9BQU8sY0FBYztJQUN6QixNQUFNLENBQUMsT0FBTyxDQUFDLG9CQUEyQztRQUN4RCxPQUFPO1lBQ0wsUUFBUSxFQUFFLGNBQWM7WUFDeEIsU0FBUyxFQUFFO2dCQUNULGVBQWU7Z0JBQ2Ysb0JBQW9CLElBQUksb0JBQW9CLENBQUMsTUFBTSxJQUFJLEVBQUU7Z0JBQ3pELG9CQUFvQixJQUFJLG9CQUFvQixDQUFDLGdCQUFnQixJQUFJLEVBQUU7Z0JBQ25FLG9CQUFvQixJQUFJLG9CQUFvQixDQUFDLGFBQWEsSUFBSSxFQUFFO2dCQUNoRTtvQkFDRSxPQUFPLEVBQUUsZ0JBQWdCO29CQUN6QixRQUFRLEVBQUUsb0JBQW9CLElBQUksb0JBQW9CLENBQUMsUUFBUSxJQUFJLElBQUk7d0JBQ3JFLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRO3dCQUMvQixDQUFDLENBQUMsZUFBZSxDQUFDLElBQUk7aUJBQ3pCO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQztJQUVELE1BQU0sQ0FBQyxRQUFRO1FBQ2IsT0FBTztZQUNMLFFBQVEsRUFBRSxjQUFjO1NBQ3pCLENBQUM7SUFDSixDQUFDOzsyR0F2QlUsY0FBYzs0R0FBZCxjQUFjLGlCQWhCekIsd0JBQXdCO1FBQ3hCLFlBQVk7UUFDWixpQkFBaUI7UUFDakIsWUFBWSxhQVFGLFlBQVksYUFYdEIsd0JBQXdCO1FBQ3hCLFlBQVk7UUFDWixpQkFBaUI7UUFDakIsWUFBWTs0R0FhRCxjQUFjLFlBTGhCLENBQUMsWUFBWSxDQUFDOzJGQUtaLGNBQWM7a0JBTjFCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN2QixPQUFPLEVBQUUsa0JBQWtCO29CQUMzQixZQUFZLEVBQUUsa0JBQWtCO29CQUNoQyxlQUFlLEVBQUUscUJBQXFCO2lCQUN2QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSwgUHJvdmlkZXIsIFNlY3VyaXR5Q29udGV4dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDbGlwYm9hcmRCdXR0b25Db21wb25lbnQgfSBmcm9tICcuL2NsaXBib2FyZC1idXR0b24uY29tcG9uZW50JztcbmltcG9ydCB7IExhbmd1YWdlUGlwZSB9IGZyb20gJy4vbGFuZ3VhZ2UucGlwZSc7XG5pbXBvcnQgeyBNYXJrZG93bkNvbXBvbmVudCB9IGZyb20gJy4vbWFya2Rvd24uY29tcG9uZW50JztcbmltcG9ydCB7IE1hcmtkb3duUGlwZSB9IGZyb20gJy4vbWFya2Rvd24ucGlwZSc7XG5pbXBvcnQgeyBNYXJrZG93blNlcnZpY2UsIFNFQ1VSSVRZX0NPTlRFWFQgfSBmcm9tICcuL21hcmtkb3duLnNlcnZpY2UnO1xuXG4vLyBoYXZpbmcgYSBkZXBlbmRlbmN5IG9uIGBIdHRwQ2xpZW50TW9kdWxlYCB3aXRoaW4gYSBsaWJyYXJ5XG4vLyBicmVha3MgYWxsIHRoZSBpbnRlcmNlcHRvcnMgZnJvbSB0aGUgYXBwIGNvbnN1bWluZyB0aGUgbGlicmFyeVxuLy8gaGVyZSwgd2UgZXhwbGljaXRlbHkgYXNrIHRoZSB1c2VyIHRvIHBhc3MgYSBwcm92aWRlciB3aXRoXG4vLyB0aGVpciBvd24gaW5zdGFuY2Ugb2YgYEh0dHBDbGllbnRNb2R1bGVgXG5leHBvcnQgaW50ZXJmYWNlIE1hcmtkb3duTW9kdWxlQ29uZmlnIHtcbiAgbG9hZGVyPzogUHJvdmlkZXI7XG4gIGNsaXBib2FyZE9wdGlvbnM/OiBQcm92aWRlcjtcbiAgbWFya2VkT3B0aW9ucz86IFByb3ZpZGVyO1xuICBzYW5pdGl6ZT86IFNlY3VyaXR5Q29udGV4dDtcbn1cblxuY29uc3Qgc2hhcmVkRGVjbGFyYXRpb25zID0gW1xuICBDbGlwYm9hcmRCdXR0b25Db21wb25lbnQsXG4gIExhbmd1YWdlUGlwZSxcbiAgTWFya2Rvd25Db21wb25lbnQsXG4gIE1hcmtkb3duUGlwZSxcbl07XG5cbmNvbnN0IHNoYXJlZEVudHJ5Q29tcG9uZW50cyA9IFtcbiAgQ2xpcGJvYXJkQnV0dG9uQ29tcG9uZW50LFxuXTtcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gIGV4cG9ydHM6IHNoYXJlZERlY2xhcmF0aW9ucyxcbiAgZGVjbGFyYXRpb25zOiBzaGFyZWREZWNsYXJhdGlvbnMsXG4gIGVudHJ5Q29tcG9uZW50czogc2hhcmVkRW50cnlDb21wb25lbnRzLFxufSlcbmV4cG9ydCBjbGFzcyBNYXJrZG93bk1vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290KG1hcmtkb3duTW9kdWxlQ29uZmlnPzogTWFya2Rvd25Nb2R1bGVDb25maWcpOiBNb2R1bGVXaXRoUHJvdmlkZXJzPE1hcmtkb3duTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBNYXJrZG93bk1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICBNYXJrZG93blNlcnZpY2UsXG4gICAgICAgIG1hcmtkb3duTW9kdWxlQ29uZmlnICYmIG1hcmtkb3duTW9kdWxlQ29uZmlnLmxvYWRlciB8fCBbXSxcbiAgICAgICAgbWFya2Rvd25Nb2R1bGVDb25maWcgJiYgbWFya2Rvd25Nb2R1bGVDb25maWcuY2xpcGJvYXJkT3B0aW9ucyB8fCBbXSxcbiAgICAgICAgbWFya2Rvd25Nb2R1bGVDb25maWcgJiYgbWFya2Rvd25Nb2R1bGVDb25maWcubWFya2VkT3B0aW9ucyB8fCBbXSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFNFQ1VSSVRZX0NPTlRFWFQsXG4gICAgICAgICAgdXNlVmFsdWU6IG1hcmtkb3duTW9kdWxlQ29uZmlnICYmIG1hcmtkb3duTW9kdWxlQ29uZmlnLnNhbml0aXplICE9IG51bGxcbiAgICAgICAgICAgID8gbWFya2Rvd25Nb2R1bGVDb25maWcuc2FuaXRpemVcbiAgICAgICAgICAgIDogU2VjdXJpdHlDb250ZXh0LkhUTUwsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZm9yQ2hpbGQoKTogTW9kdWxlV2l0aFByb3ZpZGVyczxNYXJrZG93bk1vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogTWFya2Rvd25Nb2R1bGUsXG4gICAgfTtcbiAgfVxufVxuIl19