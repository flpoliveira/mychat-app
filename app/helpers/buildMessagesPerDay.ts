import { UserMessageType } from "@/context/chat.interface";
import { getDayLabel } from "./getDayLabel";

function buildMessagesPerDay(messages: UserMessageType[]): Array<{
  title: string;
  data: UserMessageType[];
}> {
  const messagesPerDay = {} as Record<
    string,
    {
      title: string;
      data: UserMessageType[];
    }
  >;

  messages.forEach((message) => {
    const date = new Date(message.timestamp).toDateString();

    if (!messagesPerDay[date]) {
      messagesPerDay[date] = { title: getDayLabel(date), data: [] };
    }

    messagesPerDay[date].data.push(message);
  });

  return Object.keys(messagesPerDay).map((key) => messagesPerDay[key]);
}

export { buildMessagesPerDay };
