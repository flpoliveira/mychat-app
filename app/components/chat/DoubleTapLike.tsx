import { useRef } from "react";
import { View } from "react-native";
import {
  HandlerStateChangeEvent,
  State,
  TapGestureHandler,
  TapGestureHandlerEventPayload,
} from "react-native-gesture-handler";

const DoubleTapLike = ({
  onDoubleTap,
  onSingleTap,
  children,
}: {
  onDoubleTap: () => void;
  onSingleTap: () => void;
  children: React.ReactNode;
}) => {
  const doubleTapRef = useRef();
  const handleSingleTap = (
    e: HandlerStateChangeEvent<TapGestureHandlerEventPayload>
  ) => {
    if (e.nativeEvent.state === State.ACTIVE) {
      onSingleTap();
    }
  };

  return (
    <TapGestureHandler
      onHandlerStateChange={handleSingleTap}
      waitFor={doubleTapRef}
    >
      <TapGestureHandler
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === 4) {
            onDoubleTap();
          }
        }}
        numberOfTaps={2}
        ref={doubleTapRef}
      >
        <View>{children}</View>
      </TapGestureHandler>
    </TapGestureHandler>
  );
};

export { DoubleTapLike };
