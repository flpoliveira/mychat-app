import { View } from "react-native";
import { TapGestureHandler } from "react-native-gesture-handler";

const DoubleTapLike = ({
  onDoubleTap,
  children,
}: {
  onDoubleTap: () => void;
  children: React.ReactNode;
}) => {
  return (
    <TapGestureHandler
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === 4) {
          onDoubleTap();
        }
      }}
      numberOfTaps={2}
    >
      <View>{children}</View>
    </TapGestureHandler>
  );
};

export { DoubleTapLike };
