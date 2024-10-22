import { UserMessageType } from "@/context/chat.interface";
import {
  Dimensions,
  View,
  Text,
  Image,
  Touchable,
  TouchableWithoutFeedback,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import getRelativeTime from "@/helpers/getRelativeTime";
import { getMessageTime } from "@/helpers/getMessageTime";
import { DoubleTapLike } from "../DoubleTapLike";
import { LikeIcon } from "./LikeIcon";

function Message({
  message,
  isSelf,
  onLike,
  onImageFocus,
}: {
  message: UserMessageType;
  isSelf: boolean;
  onLike: () => void;
  onImageFocus: () => void;
}) {
  const screenWidth = Dimensions.get("screen").width;
  const backgroundColor = useThemeColor(
    {},
    isSelf ? "selfMessageBackground" : "messageBackground"
  );
  const hasImage = !!message.imgUrl;

  return (
    <DoubleTapLike
      onDoubleTap={onLike}
      onSingleTap={() => {
        if (hasImage) {
          onImageFocus();
        }
      }}
    >
      <View
        style={{
          padding: 8,
          paddingVertical: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: isSelf ? "flex-end" : "flex-start",
          alignSelf: isSelf ? "flex-end" : "flex-start",
        }}
      >
        <View
          style={{
            backgroundColor,
            borderRadius: 8,
            padding: 8,
            maxWidth: screenWidth * 0.7,
          }}
        >
          {hasImage && (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <Image
                  source={{ uri: message.imgUrl }}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            </View>
          )}
          <ThemedText style={{ flexWrap: "wrap" }} selectable>
            {message.content}
          </ThemedText>
          <View
            style={{
              display: "flex",
              flexDirection: message.liked
                ? isSelf
                  ? "row"
                  : "row-reverse"
                : isSelf
                ? "row-reverse"
                : "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 8,
              gap: 8,
              minWidth: 50,
            }}
          >
            {message.liked && <LikeIcon isSelf={isSelf} />}
            <Text
              style={{
                fontSize: 10,
                color: "gray",
                textAlign: "right",
                marginTop: 4,
              }}
            >
              {getMessageTime(message.timestamp)}
            </Text>
          </View>
        </View>
      </View>
    </DoubleTapLike>
  );
}

export { Message };
