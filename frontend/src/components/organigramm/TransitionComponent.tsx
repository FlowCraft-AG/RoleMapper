import Collapse from '@mui/material/Collapse';
import { TransitionProps } from '@mui/material/transitions';
import { animated, useSpring } from '@react-spring/web';

function TransitionComponent(
  props: TransitionProps & { children?: React.ReactNode },
) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px, 0, 0)`,
    },
    config: { tension: 200, friction: 20 }, // Kontrolliere die Animation
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

export default TransitionComponent;
