import { Animated, Dimensions, PanResponder } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";

const Container = styled.View`
  flex: 1;
  background-color: #00a8ff;
  justify-content: center;
  align-items: center;
`;

const Card = styled.View`
  background-color: white;
  width: 300px;
  height: 300px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
`;

const AnimatedCard = Animated.createAnimatedComponent(Card);

const { width: windowWidth } = Dimensions.get("window");
const leftDimension = -windowWidth / 2 - 20;
const rightDimension = windowWidth / 2 + 20;

export default function App() {
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.Value(0)).current;
  const rotation = position.interpolate({
    inputRange: [leftDimension, rightDimension],
    outputRange: ["-15deg", "15deg"],
    extrapolate: "extend",
  });

  const onPressIn = Animated.spring(scale, {
    toValue: 0.85,
    useNativeDriver: true,
  });
  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });
  const goCenter = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true,
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => onPressIn.start(),
      onPanResponderMove: (_, { dx }) => {
        position.setValue(dx);
      },
      onPanResponderRelease: (_, { dx }) => {
        if (dx < leftDimension) {
          Animated.spring(position, {
            toValue: -windowWidth - 100,
            useNativeDriver: true,
          }).start();
        } else if (dx > rightDimension) {
          Animated.spring(position, {
            toValue: windowWidth + 100,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.parallel([onPressOut, goCenter]).start();
        }
      },
    }),
  ).current;

  return (
    <Container>
      <AnimatedCard
        style={{
          elevation: 10,
          transform: [
            { scale },
            { translateX: position },
            { rotateZ: rotation },
          ],
        }}
        {...panResponder.panHandlers}
      >
        <Ionicons name="pizza" color="#192a56" size={98} />
      </AnimatedCard>
    </Container>
  );
}
