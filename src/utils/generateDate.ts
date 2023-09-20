export const generateDate = (month: string, day: string): Date => {
  const year: number = new Date().getFullYear();
  return new Date(year, parseInt(month) - 1, parseInt(day));
};
