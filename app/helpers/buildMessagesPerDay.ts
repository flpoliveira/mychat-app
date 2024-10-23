import { UserMessageType } from "@/context/chat.interface";
import { getDayLabel } from "./getDayLabel";
import lodash from "lodash";

function buildMessagesPerDay(
  messages: UserMessageType[]
): Array<{ type?: "date" } & UserMessageType> {
  const groupedMessages = lodash.groupBy(messages, (message) => {
    return new Date(message.timestamp).toDateString();
  });

  const sortedDates = Object.keys(groupedMessages).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return lodash.flatMap(sortedDates, (date) => {
    return [
      { type: "date", content: getDayLabel(date) },
      ...groupedMessages[date],
    ] as Array<{ type: "date" } & UserMessageType>;
  });
}

export { buildMessagesPerDay };
