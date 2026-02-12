import { useRef, useState } from "react";
import { Animated, Dimensions, Easing } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Box = styled.Pressable`
  background-color: tomato;
  width: 200px;
  height: 200px;
`;

const AnimatedBox = Animated.createAnimatedComponent(Box);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function App() {
  const position = useRef(
    new Animated.ValueXY({
      x: 0,
      y: 0,
    }),
  ).current;
  const topLeft = Animated.timing(position, {
    toValue: {
      x: -SCREEN_WIDTH / 2 + 100,
      y: -SCREEN_HEIGHT / 2 + 100,
    },
    useNativeDriver: true,
  });
  const bottomLeft = Animated.timing(position, {
    toValue: {
      x: -SCREEN_WIDTH / 2 + 100,
      y: SCREEN_HEIGHT / 2 - 100,
    },
    useNativeDriver: true,
  });
  const bottomRight = Animated.timing(position, {
    toValue: {
      x: SCREEN_WIDTH / 2 - 100,
      y: SCREEN_HEIGHT / 2 - 100,
    },
    useNativeDriver: true,
  });
  const topRight = Animated.timing(position, {
    toValue: {
      x: SCREEN_WIDTH / 2 - 100,
      y: -SCREEN_HEIGHT / 2 + 100,
    },
    useNativeDriver: true,
  });
  const moveUp = () => {
    Animated.loop(
      Animated.sequence([topLeft, bottomLeft, bottomRight, topRight]),
      { resetBeforeIteration: false },
    ).start();
  };
  const rotation = position.y.interpolate({
    inputRange: [-300, 300],
    outputRange: ["-360deg", "360deg"],
  });
  const borderRadius = position.y.interpolate({
    inputRange: [-300, 300],
    outputRange: [100, 0],
  });
  const backgroundColor = position.y.interpolate({
    inputRange: [-300, 300],
    outputRange: ["rgb(255, 99, 71)", "rgb(71, 166, 255)"],
  });
  position.addListener(() => console.log());
  return (
    <Container>
      <AnimatedBox
        onPress={moveUp}
        style={{
          transform: [
            ...position.getTranslateTransform(),
            { rotate: rotation },
          ],
          borderRadius,
          backgroundColor,
        }}
      />
    </Container>
  );
}
