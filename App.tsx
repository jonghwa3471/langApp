import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import icons from "./icons";
import { useRef } from "react";
import { Animated, PanResponder, View } from "react-native";

const BLACK_COLOR = "#1e272e";
const GRAY = "#485460";
const GREEN = "#2ecc71";
const RED = "#e74c3c";

const Container = styled.View`
  flex: 1;
  background-color: ${BLACK_COLOR};
`;

const Edge = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const WordContainer = styled(Animated.createAnimatedComponent(View))`
  width: 100px;
  height: 100px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: ${GRAY};
`;

const Word = styled.Text<{ $color: string }>`
  font-size: 38px;
  font-weight: 500;
  color: ${(props) => props.$color};
`;

const Center = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
`;

const IconCard = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
`;

export default function App() {
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(
    new Animated.ValueXY({
      x: 0,
      y: 0,
    }),
  ).current;

  const onPressIn = Animated.spring(scale, {
    toValue: 0.9,
    useNativeDriver: true,
  });

  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });

  const goHome = Animated.spring(position, {
    toValue: {
      x: 0,
      y: 0,
    },
    useNativeDriver: true,
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onPressIn.start();
      },
      onPanResponderMove: (_, { dx, dy }) =>
        position.setValue({ x: dx, y: dy }),
      onPanResponderRelease: () => {
        Animated.parallel([onPressOut, goHome]).start();
      },
    }),
  ).current;
  return (
    <Container>
      <Edge>
        <WordContainer>
          <Word $color={GREEN}>알아</Word>
        </WordContainer>
      </Edge>
      <Center>
        <IconCard
          {...panResponder.panHandlers}
          style={{
            transform: [{ scale }, ...position.getTranslateTransform()],
          }}
        >
          <Ionicons name="beer" color={GRAY} size={76} />
        </IconCard>
      </Center>
      <Edge>
        <WordContainer>
          <Word $color={RED}>몰라</Word>
        </WordContainer>
      </Edge>
    </Container>
  );
}
