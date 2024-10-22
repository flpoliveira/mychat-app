import { UserMessageType } from "@/context/chat.interface";

function countNumberOfLines(text: string): number {
  const splited = text.split("\n");
  return (
    splited.length +
    splited.reduce((acc, line) => acc + Math.ceil(line.length / 40), 0)
  );
}

function getMessageItemLayout(
  item: Array<{ title: string; data: UserMessageType[] }>,
  rowIndex: number
): {
  length: number;
  offset: number;
  index: number;
} {
  if (!item || !item.length) {
    return {
      length: 0,
      offset: 0,
      index: rowIndex,
    };
  }

  const allMessages = item.reduce(
    (acc, section) => [...acc, { content: section.title }, ...section.data],
    [] as Partial<UserMessageType>[]
  );

  let offset = 0;
  for (let i = 0; i < rowIndex && i < allMessages.length - 1; i++) {
    const message = allMessages[i];
    const numberOfLines = countNumberOfLines(message?.content || "");
    offset += numberOfLines * 24 + 40;
    if (message.imgUrl) {
      offset += 200;
    }
  }

  const length =
    countNumberOfLines(allMessages?.[rowIndex]?.content || "") * 24 +
    40 +
    (allMessages?.[rowIndex]?.imgUrl ? 200 : 0);

  console.log("offset", offset, "length", length, "index", rowIndex);

  return {
    length,
    offset,
    index: rowIndex,
  };
}

export default getMessageItemLayout;
