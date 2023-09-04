export function getSingularPluralPeriod(count: number, currentPeriod: string) : string {
  if(count > 1){
    if(currentPeriod.includes('يوم'))
      return 'أيام';
    else if(currentPeriod.includes('إسبوع'))
      return 'أسابيع';
    else if(currentPeriod.includes('شهر'))
      return 'شهور';
  }
  return currentPeriod;
}
