export type SessionType = {
  username: string;
  userID: string;
};

export type UserMessageType = {
  id?: string;
  timestamp: string;
  content: string;
  from: string;
  to: string;
  liked?: boolean;
  imgUrl?: string;
};

export type UserType = {
  userID: string;
  username: string;
  connected: boolean;
  lastActive?: string;
  imgUrl?: string;
  messages?: Array<UserMessageType>;
};
