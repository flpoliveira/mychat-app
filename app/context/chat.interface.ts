import { MutableRefObject } from "react";
import { Socket } from "socket.io-client";

export type SessionType = {
  userID: string;
  username: string;
};

export type UserMessageType = {
  id?: string;
  content: string;
  from: string;
  imgUrl?: string;
  liked?: boolean;
  timestamp: string;
  to: string;
};

export type UserType = {
  connected: boolean;
  imgUrl?: string;
  lastActive?: string;
  lastMessage?: UserMessageType;
  userID: string;
  username: string;
};

export type SocketContextType = {
  connect: (
    username: string,
    randomAvatarUrl?: string,
    userID?: string
  ) => void;
  handleChangeSession: (value: SessionType) => void;
  updateStoreMessage: (message: Partial<UserMessageType>) => void;
  allUsers: Array<UserType>;
  session: SessionType | null;
  socket: MutableRefObject<Socket | null>;
};

export type ChatContextType = {
  connectPrivateChat: (to: string) => void;
  findMessage: (id?: string) => UserMessageType | undefined;
  likeMessage: (message: UserMessageType) => void;
  sendMessage: (message: { content: string; imgUrl?: string }) => void;
  setSelectedUserID: (id: string) => void;
  loadingPrivateMessages?: boolean;
  messages: Array<UserMessageType>;
  messagesWithDays: Array<
    {
      type?: "date";
    } & UserMessageType
  >;
  selectedUser: UserType | null;
  users: Array<UserType>;
};
