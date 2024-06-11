export function convertToUnixTimestamp(dateString: string): number {
  //this function converts a string with "dd/mm/yyyy hh24:mi" format to unix timestamp number
  // Split the date and time parts
  const [datePart, timePart] = dateString.split(' ');

  // Split the date part into day, month, and year
  const [day, month, year] = datePart.split('/').map(Number);

  // Split the time part into hours and minutes
  const [hours, minutes] = timePart.split(':').map(Number);

  // Create a new Date object
  const date = new Date(year, month - 1, day, hours, minutes);

  // Convert to Unix timestamp (seconds)
  return Math.floor(date.getTime() / 1000);
}
