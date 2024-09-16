const createYearList = (year: number) => {
  const yearsArray: string[] = [];
  const currentYear = new Date().getFullYear();
  for (let i = year; i <= currentYear; i++) {
    yearsArray.push(i.toString());
  }

  return yearsArray;
};

export default createYearList;
