export const generateDate = (month: string, day: string): Date => {
  const currentDate = new Date();

  const year: number = currentDate.getFullYear();

  const requiredMonth = parseInt(month) - 1;
  const requiredDay = parseInt(day);

  const formattedDate = new Date(year, requiredMonth, requiredDay);

  if (requiredMonth < currentDate.getMonth())
    return new Date(year + 1, requiredMonth, requiredDay);

  return formattedDate;
};
