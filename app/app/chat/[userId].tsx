import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatPlaceholder } from "@/components/chat/ChatPlaceholder";
import { ImageFocus } from "@/components/chat/ImageFocus";
import { Message } from "@/components/chat/Message";
import { IconButton } from "@/components/IconButton";
import { Label } from "@/components/Label";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useChat } from "@/context/chat";
import { UserMessageType } from "@/context/chat.interface";
import getMessageItemLayout from "@/helpers/getMessageItemLayout";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

export default function UserChat() {
  const { userId } = useLocalSearchParams();
  const router = useRouter();

  const {
    sendMessage,
    setSelectedUserID,
    selectedUser,
    messagesWithDays,
    likeMessage,
    connectPrivateChat,
    loadingPrivateMessages,
  } = useChat();

  const backgroundColor = useThemeColor({}, "background");
  const flatListRef = useRef<FlatList<UserMessageType>>(null);
  const [canScroll, setCanScroll] = useState(true);
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (userId) {
      sendMessage({
        content: message,
      });
      setMessage("");
    }
  };

  useEffect(() => {
    setSelectedUserID(userId as string);
  }, [setSelectedUserID]);

  const isScrolling = useRef(false);
  const scrollToEnd = useCallback(
    (animated?: boolean) => {
      if (flatListRef.current && !isScrolling.current) {
        isScrolling.current = true;
        flatListRef.current.scrollToEnd({
          animated,
        });
        setCanScroll(true);
        isScrolling.current = false;
      }
    },
    [messagesWithDays]
  );

  useFocusEffect(
    useCallback(() => {
      connectPrivateChat(userId as string);
    }, [userId, connectPrivateChat])
  );

  return (
    <SafeAreaView
      style={{
        backgroundColor,
        flex: 1,
      }}
    >
      <Stack.Screen
        options={{
          title: `${selectedUser?.username || "Chat"}`,
          headerBackTitleVisible: false,
          headerTitle: () => <ChatHeader user={selectedUser} />,
          headerStyle: {
            backgroundColor,
          },
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "transparent" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ThemedView style={styles.chatContainer}>
          {!!messagesWithDays && messagesWithDays.length !== 0 ? (
            <FlatList<UserMessageType & { type?: "date" }>
              data={messagesWithDays}
              keyExtractor={(item) => item.id || `date-${item.content}`}
              renderItem={({ item }) => (
                <View>
                  {item?.type === "date" ? (
                    <Label>
                      <ThemedText type="smallSemiBold">
                        {item.content}
                      </ThemedText>
                    </Label>
                  ) : (
                    <Message
                      message={item}
                      isSelf={item.to === userId}
                      onLike={() => likeMessage(item)}
                      onImageFocus={() => {
                        router.push(`/chat/image/${item.id}`);
                      }}
                    />
                  )}
                </View>
              )}
              onEndReachedThreshold={1}
              onScroll={(e) => {
                if (isScrolling.current) {
                  return;
                }

                const scrollPosition = e.nativeEvent.contentOffset.y;
                const scrollHeight = e.nativeEvent.contentSize.height;
                const screenHeight = e.nativeEvent.layoutMeasurement.height;

                const isAtBottom =
                  scrollHeight - screenHeight - scrollPosition < 100;
                if (isAtBottom) {
                  setCanScroll(true);
                } else {
                  setCanScroll(false);
                }
              }}
              onContentSizeChange={() => {
                if (canScroll) {
                  scrollToEnd(false);
                }
              }}
              getItemLayout={(data, index) => {
                return getMessageItemLayout(data, index);
              }}
              contentContainerStyle={{ paddingBottom: 30 }}
              style={{ paddingVertical: 8, flexGrow: 1 }}
              ref={flatListRef}
            />
          ) : (
            <View style={{ flexGrow: 1 }} />
          )}

          {!canScroll && (
            <View style={styles.scrollButton}>
              <IconButton onPress={() => scrollToEnd(true)}>
                <Ionicons name="arrow-down-circle" size={24} color="white" />
              </IconButton>
            </View>
          )}
          <ThemedView>
            <ChatInput
              value={message}
              onChange={(e) => setMessage(e)}
              userId={userId as string}
              onSend={handleSendMessage}
            />
          </ThemedView>
          {loadingPrivateMessages && (
            <View
              style={{
                flexGrow: 1,
                position: "absolute",
                flex: 1,
                width: "100%",
                height: "100%",
                backgroundColor,
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size="large" color="#F158FF" />
            </View>
          )}
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollButton: {
    alignSelf: "flex-end",
    position: "absolute",
    bottom: 80,
    right: 8,
  },
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 1,
  },
});
