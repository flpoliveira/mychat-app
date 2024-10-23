import { UserMessageType } from "@/context/chat.interface";
import { getDayLabel } from "./getDayLabel";

function buildMessagesPerDay(
  messages: UserMessageType[]
): Array<{ type?: "date" } & UserMessageType> {
  const messagesPerDay = {} as Record<string, UserMessageType[]>;

  messages.forEach((message) => {
    const date = new Date(message.timestamp).toDateString();

    if (!messagesPerDay[date]) {
      messagesPerDay[date] = [];
    }

    messagesPerDay[date].push(message);
  });

  const days = Object.keys(messagesPerDay).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return days.reduce((acc, key) => {
    return [
      ...acc,
      { type: "date", content: getDayLabel(key) },
      ...messagesPerDay[key],
    ] as Array<{ type: "date" } & UserMessageType>;
  }, [] as Array<{ type: "date" } & UserMessageType>);
}

export { buildMessagesPerDay };
