import { IFrequencyPeriodDirection } from '@interfaces/home/i-frequency-period-direction';

export class DrugModel {
  drugDosageCount: IFrequencyPeriodDirection[];
  drugFrequencyCount: IFrequencyPeriodDirection[];
  drugFrequencyPeriod: IFrequencyPeriodDirection[];
  drugPeriodCount: IFrequencyPeriodDirection[];
  drugPeriodPeriod: IFrequencyPeriodDirection[];
  drugDirection: IFrequencyPeriodDirection[];

    constructor() {
    this.drugDosageCount = [
      { id: 1, text: 1, value: 1 },
      { id: 2, text: 2, value: 2 },
      { id: 3, text: 3, value: 3 },
      { id: 4, text: 4, value: 4 },
      { id: 5, text: 5, value: 5 },
    ];

    this.drugFrequencyCount = [
      { id: 1, text: 1, value: 1 },
      { id: 2, text: 2, value: 2 },
      { id: 3, text: 3, value: 3 },
      { id: 4, text: 4, value: 4 },
      { id: 5, text: 5, value: 5 },
    ];

    this.drugFrequencyPeriod = [
      { id: 1, text: 'Day', value: 'يوم' },
      { id: 2, text: 'Week', value: 'إسبوع' },
      { id: 3, text: 'Month', value: 'شهر' },
    ];

    this.drugPeriodCount = [
      { id: 1, text: 1, value: 1 },
      { id: 2, text: 2, value: 2 },
      { id: 3, text: 3, value: 3 },
      { id: 4, text: 4, value: 4 },
      { id: 5, text: 5, value: 5 },
      { id: 6, text: 6, value: 6 },
      { id: 7, text: 7, value: 7 },
      { id: 8, text: 8, value: 8 },
      { id: 19, text: 9, value: 9 },
      { id: 10, text: 10, value: 10 },
      { id: 11, text: 11, value: 11 },
      { id: 12, text: 12, value: 12 },
      { id: 13, text: 13, value: 13 },
      { id: 14, text: 14, value: 14 },
      { id: 15, text: 15, value: 15 },
    ];

    this.drugPeriodPeriod = [
      { id: 1, text: 'Day', value: 'يوم' },
      { id: 2, text: 'Week', value: 'إسبوع' },
      { id: 3, text: 'Month', value: 'شهر' },
    ];

    this.drugDirection = [
      { id: 1, text: 'Before Meal', value: 'قبل الأكل' },
      { id: 2, text: 'After Meal', value: 'بعد الأكل' },
      { id: 3, text: 'With Food', value: 'أثناء الأكل' },
      { id: 4, text: '2 hours after eating', value: 'بعد الأكل ب ساعتين' },
      { id: 5, text: '15 minutes before eating', value: 'قبل الأكل ب ربع ساعه' },
      { id: 6, text: '1 hour before eating', value: 'قبل الأكل ب ساعه' },
      { id: 7, text: 'before sleeping', value: 'قبل النوم' },
      { id: 8, text: 'on an empty stomach', value: 'على معده فارغة' },
      { id: 9, text: 'none', value: 'لا يوجد' },
    ];
  }
}
