import { Animated, PanResponder } from "react-native";
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

export default function App() {
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => onPressIn(),
      onPanResponderMove: (_, { dx }) => {
        position.setValue(dx);
      },
      onPanResponderRelease: () => {
        Animated.parallel([
          onPressOut,
          Animated.spring(position, {
            toValue: 0,
            useNativeDriver: true,
          }),
        ]).start();
      },
    }),
  ).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });
  return (
    <Container>
      <AnimatedCard
        style={{
          elevation: 10,
          transform: [{ scale }, { translateX: position }],
        }}
        {...panResponder.panHandlers}
      >
        <Ionicons name="pizza" color="#192a56" size={98} />
      </AnimatedCard>
    </Container>
  );
}
