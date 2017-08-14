import { Component, OnInit, DoCheck, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Field } from 'ng-formly';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'formly-ngx-material-textarea',
    styles: [`
    textarea {
        resize: vertical;
    }
  `],
    template: `
    <div class="" [ngStyle]="{color:formControl.errors?'#f44336':'inherit'}">
        <md-input-container style="width: 100%">
            <textarea [mdAutosizeMaxRows]="to.maxRows" [mdAutosizeMinRows]="to.minRows" [disabled]="to.disabled" mdInput mdTextareaAutosize placeholder="{{to.placeholder}}" [formControl]="formControl" (keydown)="keydown($event)"></textarea>
        </md-input-container>
    </div>
  `,
})
export class FormlyTextareaComponent extends Field implements OnInit, OnDestroy {

    private ngUnsubscribe: Subject<void> = new Subject<void>();
    public value: string;

    constructor(private changeDetectorRef: ChangeDetectorRef) {
        super();
    }

    public ngOnInit() {
        if (this.to.defaultValue && !this.formControl.value) {
            this.formControl.setValue(this.to.defaultValue);
        }
        this.formControl.valueChanges.takeUntil(this.ngUnsubscribe).subscribe(e => {
            let result = e;
            if (this.to.maxLength && e.length > this.to.maxLength) {
                result = result.substr(0, this.to.maxLength);
            }
            if (this.to.format) {
                result = this.to.format(e);
            }

            this.formControl.setValue(result, { emitEvent: false });
        });
    }

    keydown(e: any) {
        if (this.to.keydown) {
            this.to.keydown(e);
        }
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
