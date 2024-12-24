import { Collapse } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { animated, SpringValue, useSpring } from '@react-spring/web';
import { CSSProperties, ReactNode } from 'react';

interface AnimatedDivProps {
  style: CSSProperties & {
    opacity: SpringValue<number>;
    transform: SpringValue<string>;
  };
  children?: ReactNode;
}

// Typ erweitern, um `children` zu unterstützen
const ExtendedAnimatedDiv = animated.div as React.FC<AnimatedDivProps>;

export default function TransitionComponent(
  props: TransitionProps & { children?: React.ReactNode },
) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px, 0, 0)`,
    },
    config: { tension: 200, friction: 20 },
  });

  return (
    <ExtendedAnimatedDiv style={style as AnimatedDivProps['style']}>
      <Collapse {...props} />
    </ExtendedAnimatedDiv>
  );
}
