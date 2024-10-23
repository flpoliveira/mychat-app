import { Dimensions } from "react-native";

function countNumberOfLines(text: string): number {
  const splited = text.split("\n");
  const maxCharactersPerLine = Math.max(
    Math.ceil(Dimensions.get("screen").width / 16),
    1
  );
  return (
    splited.length +
    splited.reduce(
      (acc, line) => acc + Math.ceil(line.length / maxCharactersPerLine),
      0
    )
  );
}

function getMessageItemLayout(
  data?: ArrayLike<{
    content: string;
    imgUrl?: string;
  }> | null,
  rowIndex?: number
): {
  length: number;
  offset: number;
  index: number;
} {
  if (!data || !data.length) {
    return {
      length: 0,
      offset: 0,
      index: rowIndex || 0,
    };
  }
  const index = rowIndex || 0;

  let offset = 30;
  for (let i = 0; i < index && i < data.length - 1; i++) {
    const message = data[i];
    const numberOfLines = countNumberOfLines(message?.content || "");
    offset += numberOfLines * 24 + 40;
    if (message.imgUrl) {
      offset += 200;
    }
  }

  const length =
    countNumberOfLines(data?.[index]?.content || "") * 24 +
    40 +
    (data?.[index]?.imgUrl ? 200 : 0);

  return {
    length,
    offset,
    index,
  };
}

export default getMessageItemLayout;
