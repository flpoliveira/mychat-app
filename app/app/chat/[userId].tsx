import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { Message } from "@/components/chat/Message";
import { IconButton } from "@/components/IconButton";
import { Label } from "@/components/Label";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useChat } from "@/context/chat";
import { getDayLabel } from "@/helpers/getDayLabel";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  SectionList,
} from "react-native";

export default function UserChat() {
  const { userId } = useLocalSearchParams();

  const {
    sendMessage,
    setSelectedUserID,
    selectedUser,
    messages,
    likeMessage,
  } = useChat();
  const backgroundColor = useThemeColor({}, "background");

  const sectionListRef = useRef<SectionList>(null);
  const [canScroll, setCanScroll] = useState(true);
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    console.log("Sending message", message, "to", userId);
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

  const scrollToEnd = useCallback(() => {
    if (sectionListRef.current) {
      const sectionIndex = messages.length - 1;
      const itemIndex = messages?.[sectionIndex]?.data?.length - 1;
      if (sectionIndex >= 0 && itemIndex >= 0) {
        sectionListRef.current.scrollToLocation({
          animated: false,
          sectionIndex,
          itemIndex,
        });
      }
      setCanScroll(true);
    }
  }, [messages]);

  useEffect(() => {
    if (canScroll) {
      scrollToEnd();
    }
  }, [canScroll, scrollToEnd]);

  return (
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
        <ThemedView
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <SectionList
            sections={messages}
            keyExtractor={(item, index) => item.id || index.toString()}
            renderItem={({ item }) => (
              <Message
                message={item}
                isSelf={item.to === userId}
                onLike={() => likeMessage(item)}
              />
            )}
            renderSectionHeader={({ section: { title } }) => (
              <Label>
                <ThemedText type="smallSemiBold">{title}</ThemedText>
              </Label>
            )}
            onLayout={() => {
              scrollToEnd();
            }}
            contentContainerStyle={{ paddingBottom: 80 }}
            style={{ paddingVertical: 8, flexGrow: 1 }}
            stickySectionHeadersEnabled={false}
            ref={sectionListRef}
            onScrollToIndexFailed={() => {
              console.log("Scroll to index failed");
              const wait = new Promise((resolve) => setTimeout(resolve, 50));
              wait.then(() => {
                scrollToEnd();
              });
            }}
            onScroll={(e) => {
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
          />
          {/* <ScrollView
            style={{ flex: 1, paddingVertical: 8 }}
            ref={scrollViewRef}
            onContentSizeChange={() => {
              if (canScroll) {
                scrollViewRef?.current?.scrollToEnd({ animated: true });
              }
            }}
           
            contentContainerStyle={{ paddingBottom: 50 }}
          >
            <ThemedView style={{ flexGrow: 1 }}>
              {days.map((day, index) => {
                const dayMessages = messages[day];
                return (
                  <Fragment>
                    <Label>
                      <ThemedText type="smallSemiBold">
                        {getDayLabel(day)}
                      </ThemedText>
                    </Label>
                    {dayMessages.map((message, index) => {
                      return (
                        <Message
                          message={message}
                          isSelf={message.to === userId}
                        />
                      );
                    })}
                  </Fragment>
                );
              })}
              
            </ThemedView>
          </ScrollView> */}
          {!canScroll && (
            <View
              style={{
                alignSelf: "flex-end",
                position: "absolute",
                bottom: 80,
                right: 8,
              }}
            >
              <IconButton onPress={() => scrollToEnd()}>
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
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    // </TouchableWithoutFeedback>
  );
}
