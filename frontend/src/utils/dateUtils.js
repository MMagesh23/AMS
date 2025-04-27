export const mapDateToDay = (date) => {
  const startDate = new Date('2025-04-25');
  const diffInDays = Math.ceil((new Date(date) - startDate) / (1000 * 60 * 60 * 24)) + 1;
  return `Day ${diffInDays}`;
};