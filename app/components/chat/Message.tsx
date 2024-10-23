import { UserMessageType } from "@/context/chat.interface";
import { Dimensions, View, Text, Image, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { getMessageTime } from "@/helpers/getMessageTime";
import { DoubleTapLike } from "../DoubleTapLike";
import { LikeIcon } from "./LikeIcon";
import { PlaceholderImage } from "../PlaceholderImage";

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
        style={[
          styles.container,
          {
            justifyContent: isSelf ? "flex-end" : "flex-start",
            alignSelf: isSelf ? "flex-end" : "flex-start",
          },
        ]}
      >
        <View
          style={[
            styles.messageContainer,
            {
              backgroundColor,
              maxWidth: screenWidth * 0.7,
            },
          ]}
        >
          {hasImage && (
            <View style={styles.imageContainer}>
              <View style={styles.imageContent}>
                <PlaceholderImage
                  source={{ uri: message.imgUrl }}
                  style={styles.image}
                />
              </View>
            </View>
          )}
          <ThemedText style={{ flexWrap: "wrap" }} selectable>
            {message.content}
          </ThemedText>
          <View
            style={[
              styles.messageFooter,
              {
                flexDirection: message.liked
                  ? isSelf
                    ? "row"
                    : "row-reverse"
                  : isSelf
                  ? "row-reverse"
                  : "row",
              },
            ]}
          >
            {message.liked && <LikeIcon isSelf={isSelf} />}
            <Text style={styles.time}>{getMessageTime(message.timestamp)}</Text>
          </View>
        </View>
      </View>
    </DoubleTapLike>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    paddingVertical: 4,
    display: "flex",
    flexDirection: "column",
  },
  messageContainer: {
    borderRadius: 8,
    padding: 8,
  },
  messageFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
    minWidth: 50,
  },
  imageContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  imageContent: {
    width: 200,
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  time: {
    fontSize: 10,
    color: "gray",
    textAlign: "right",
    marginTop: 4,
  },
});

export { Message };
