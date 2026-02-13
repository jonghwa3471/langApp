import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import icons from "./icons";
import { useRef, useState } from "react";
import { Animated, Dimensions, Easing, PanResponder, View } from "react-native";

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
  z-index: 1;
`;

const IconCard = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
`;

const { height: WINDOW_HEIGHT } = Dimensions.get("window");
const topDimensionMax = -WINDOW_HEIGHT / 2;
const topDimensionMin = -WINDOW_HEIGHT / 20;
const bottomDimensionMax = WINDOW_HEIGHT / 2;
const bottomDimensionMin = WINDOW_HEIGHT / 20;

const topLimit = -WINDOW_HEIGHT / 3;
const bottomLimit = WINDOW_HEIGHT / 3;

export default function App() {
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(
    new Animated.ValueXY({
      x: 0,
      y: 0,
    }),
  ).current;
  const scaleOne = position.y.interpolate({
    inputRange: [topDimensionMax, topDimensionMin],
    outputRange: [2, 1],
    extrapolate: "clamp",
  });
  const scaleTow = position.y.interpolate({
    inputRange: [bottomDimensionMin, bottomDimensionMax],
    outputRange: [1, 2],
    extrapolate: "clamp",
  });

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

  const onDropScale = Animated.timing(scale, {
    toValue: 0,
    useNativeDriver: true,
    duration: 200,
    easing: Easing.linear,
  });

  const onDropOpacity = Animated.timing(opacity, {
    toValue: 0,
    duration: 200,
    useNativeDriver: true,
    easing: Easing.linear,
  });

  const onDropPosition = Animated.timing(position, {
    toValue: {
      x: 0,
      y: 0,
    },
    useNativeDriver: true,
    duration: 200,
    easing: Easing.linear,
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onPressIn.start();
      },
      onPanResponderMove: (_, { dx, dy }) => {
        position.setValue({ x: dx, y: dy });
      },
      onPanResponderRelease: (_, { dy }) => {
        if (dy < topLimit || dy > bottomLimit) {
          Animated.sequence([
            Animated.parallel([onDropOpacity, onDropScale]),
            onDropPosition,
          ]).start(nextIcon);
        } else {
          Animated.parallel([onPressOut, goHome]).start();
        }
      },
    }),
  ).current;
  const [index, setIndex] = useState(0);
  const nextIcon = () => {
    setIndex((prev) => prev + 1);
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(opacity, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };
  return (
    <Container>
      <Edge>
        <WordContainer style={{ transform: [{ scale: scaleOne }] }}>
          <Word $color={GREEN}>알아</Word>
        </WordContainer>
      </Edge>
      <Center>
        <IconCard
          {...panResponder.panHandlers}
          style={{
            opacity,
            transform: [...position.getTranslateTransform(), { scale }],
          }}
        >
          <Ionicons name={icons[index] as any} color={GRAY} size={76} />
        </IconCard>
      </Center>
      <Edge>
        <WordContainer style={{ transform: [{ scale: scaleTow }] }}>
          <Word $color={RED}>몰라</Word>
        </WordContainer>
      </Edge>
    </Container>
  );
}
