import { formatDate } from "date-fns";

function getMessageTime(time: string): string {
  return formatDate(time, "HH:mm");
}

export { getMessageTime };
