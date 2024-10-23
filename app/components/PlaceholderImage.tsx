import { useState } from "react";
import { ImageProps, Animated, View } from "react-native";

function PlaceholderImage(
  props: ImageProps & {
    width?: number | string;
    height?: number | string;
  }
) {
  const [opacity] = useState(new Animated.Value(0));

  const onLoad = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const width = props.width || "100%";
  const height = props.height || "100%";
  return (
    <View
      style={{
        width,
        height,
      }}
    >
      <View
        style={[
          props.style,
          {
            backgroundColor: "rgba(0,0,0,0.1)",
            width,
            height,
          },
        ]}
      />
      <Animated.Image
        {...props}
        style={[props.style, { position: "absolute", opacity }]}
        onLoad={onLoad}
      />
    </View>
  );
}

export { PlaceholderImage };
