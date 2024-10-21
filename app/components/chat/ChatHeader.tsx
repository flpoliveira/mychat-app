import { UserType } from "@/context/chat.interface";
import { ThemedText } from "../ThemedText";

function ChatHeader({ user }: { user: UserType | null }) {
  return <ThemedText>{user?.username || "Chat"}</ThemedText>;
}

export { ChatHeader };
