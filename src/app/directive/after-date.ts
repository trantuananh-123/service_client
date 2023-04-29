import { AbstractControl, ValidatorFn } from "@angular/forms";

export class CustomeDateValidators {
    static fromToDate(fromDateField: string, toDateField: string): ValidatorFn {
        return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
            const fromDate = formGroup.get(fromDateField)!.value;
            const toDate = formGroup.get(toDateField)!.value;
            if ((fromDate !== null && toDate !== null) && fromDate > toDate) {
                return { ['fromToDate']: true };
            }
            return null;
        };
    }

    static startDate(dateField: string): ValidatorFn {
        return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
            const date = new Date();
            const currentDate = formGroup.get(dateField)!.value;
            if (currentDate !== null && currentDate > date) {
                return { ['startDate']: true };
            }
            return null;
        };
    }

    static endDate(dateField: string): ValidatorFn {
        return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
            const date = new Date();
            const currentDate = formGroup.get(dateField)!.value;
            if (currentDate !== null && currentDate > date) {
                return { ['endDate']: true };
            }
            return null;
        };
    }

}