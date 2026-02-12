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
  position: absolute;
`;

const CardContainer = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
`;

const Btn = styled.TouchableOpacity``;

const BtnContainer = styled.View`
  flex-direction: row;
  gap: 20px;
  flex: 1;
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
  const secondScale = position.interpolate({
    inputRange: [leftDimension, 0, rightDimension],
    outputRange: [1, 0.7, 1],
    extrapolate: "clamp",
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
  const goLeft = Animated.spring(position, {
    toValue: -windowWidth - 100,
    tension: 1,
    useNativeDriver: true,
  });
  const goRight = Animated.spring(position, {
    toValue: windowWidth + 100,
    tension: 1,
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
          goLeft.start();
        } else if (dx > rightDimension) {
          goRight.start();
        } else {
          Animated.parallel([onPressOut, goCenter]).start();
        }
      },
    }),
  ).current;

  const pressClose = () => goLeft.start();
  const pressCheck = () => goRight.start();

  return (
    <Container>
      <CardContainer>
        <AnimatedCard style={{ transform: [{ scale: secondScale }] }}>
          <Ionicons name="beer" color="#192a56" size={98} />
        </AnimatedCard>
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
      </CardContainer>
      <BtnContainer>
        <Btn onPress={pressClose}>
          <Ionicons name="close-circle" color="white" size={58} />
        </Btn>
        <Btn onPress={pressCheck}>
          <Ionicons name="checkmark-circle" color="white" size={58} />
        </Btn>
      </BtnContainer>
    </Container>
  );
}
