import { UserType } from "@/context/chat.interface";
import { Link } from "expo-router";
import { FlatList, View } from "react-native";
import { Contact } from "./Contact";

function List({
  users,
  sessionUserID,
}: {
  users: UserType[];
  sessionUserID: string;
}) {
  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.userID}
      renderItem={({ item }) => (
        <Link href={`/chat/${item.userID}`}>
          <Contact
            user={item}
            isFromMe={item.lastMessage?.from === sessionUserID}
          />
        </Link>
      )}
      ItemSeparatorComponent={() => <View style={{ marginVertical: 8 }} />}
      style={{
        flex: 1,
        marginVertical: 8,
      }}
    />
  );
}

export { List };
