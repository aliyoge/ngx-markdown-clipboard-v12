import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class LanguagePipe {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZ3VhZ2UucGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9zcmMvbGFuZ3VhZ2UucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQzs7QUFLcEQsTUFBTSxPQUFPLFlBQVk7SUFFdkIsU0FBUyxDQUFDLEtBQWEsRUFBRSxRQUFnQjtRQUN2QyxJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7WUFDakIsS0FBSyxHQUFHLEVBQUUsQ0FBQztTQUNaO1FBQ0QsSUFBSSxRQUFRLElBQUksSUFBSSxFQUFFO1lBQ3BCLFFBQVEsR0FBRyxFQUFFLENBQUM7U0FDZjtRQUNELElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1lBQzdCLE9BQU8sQ0FBQyxLQUFLLENBQUMsNkRBQTZELE9BQU8sS0FBSyxHQUFHLENBQUMsQ0FBQztZQUM1RixPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLEVBQUU7WUFDaEMsT0FBTyxDQUFDLEtBQUssQ0FBQyw0REFBNEQsT0FBTyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBQzlGLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxPQUFPLEtBQUssR0FBRyxRQUFRLEdBQUcsSUFBSSxHQUFJLEtBQUssR0FBRyxPQUFPLENBQUM7SUFDcEQsQ0FBQzs7eUdBbEJVLFlBQVk7dUdBQVosWUFBWTsyRkFBWixZQUFZO2tCQUh4QixJQUFJO21CQUFDO29CQUNKLElBQUksRUFBRSxVQUFVO2lCQUNqQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQFBpcGUoe1xuICBuYW1lOiAnbGFuZ3VhZ2UnLFxufSlcbmV4cG9ydCBjbGFzcyBMYW5ndWFnZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcblxuICB0cmFuc2Zvcm0odmFsdWU6IHN0cmluZywgbGFuZ3VhZ2U6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICAgIHZhbHVlID0gJyc7XG4gICAgfVxuICAgIGlmIChsYW5ndWFnZSA9PSBudWxsKSB7XG4gICAgICBsYW5ndWFnZSA9ICcnO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgY29uc29sZS5lcnJvcihgTGFuZ3VhZ2VQaXBlIGhhcyBiZWVuIGludm9rZWQgd2l0aCBhbiBpbnZhbGlkIHZhbHVlIHR5cGUgWyR7dHlwZW9mIHZhbHVlfV1gKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBsYW5ndWFnZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYExhbmd1YWdlUGlwZSBoYXMgYmVlbiBpbnZva2VkIHdpdGggYW4gaW52YWxpZCBwYXJhbWV0ZXIgWyR7dHlwZW9mIGxhbmd1YWdlfV1gKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuICdgYGAnICsgbGFuZ3VhZ2UgKyAnXFxuJyArICB2YWx1ZSArICdcXG5gYGAnO1xuICB9XG59XG4iXX0=