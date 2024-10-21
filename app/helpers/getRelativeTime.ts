import { formatDistanceToNow } from "date-fns";

const getRelativeTime = (isoDateString?: string) => {
  if (!isoDateString) {
    return "";
  }
  return formatDistanceToNow(new Date(isoDateString), { addSuffix: true });
};

export default getRelativeTime;
