/**
 * Stellt eine benutzerdefinierte Übergangskomponente dar, die `Collapse` von Material-UI
 * mit animierten Übergängen von `@react-spring/web` kombiniert. Diese Komponente kann verwendet werden,
 * um geschmeidige Animationen für ein- und ausblendbare Elemente zu erstellen.
 *
 * @module TransitionComponent
 */

import { Collapse } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { animated, SpringValue, useSpring } from '@react-spring/web';
import { CSSProperties, ReactNode } from 'react';

/**
 * Props für die animierte `div`-Komponente.
 *
 * @interface AnimatedDivProps
 * @property {CSSProperties} style - Die CSS-Styles, die von `react-spring` generiert werden.
 * @property {ReactNode} [children] - Der Inhalt, der innerhalb der animierten `div` angezeigt wird.
 */
interface AnimatedDivProps {
  style: CSSProperties & {
    opacity: SpringValue<number>;
    transform: SpringValue<string>;
  };
  children?: ReactNode;
}

// Erweitert die animierte `div`-Komponente, um `children` zu unterstützen.
const ExtendedAnimatedDiv = animated.div as React.FC<AnimatedDivProps>;

/**
 * TransitionComponent
 *
 * Diese Komponente kombiniert die `Collapse`-Funktionalität von Material-UI mit einer benutzerdefinierten
 * Animation von `@react-spring/web`. Sie sorgt für geschmeidige Übergänge beim Ein- und Ausblenden von Inhalten.
 *
 * @component
 * @param {TransitionProps & { children?: React.ReactNode }} props - Die Props der Komponente.
 * @returns {JSX.Element} Die JSX-Struktur der animierten Übergangskomponente.
 *
 * @example
 * Verwendung innerhalb eines TreeView-Elements
 * <TransitionComponent in={true}>
 *   <div>Inhalt wird eingeblendet</div>
 * </TransitionComponent>
 */
export default function TransitionComponent(
  props: TransitionProps & { children?: React.ReactNode },
) {
  // Definiert die Animationseigenschaften mit react-spring
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0, // Übergang der Sichtbarkeit
      transform: `translate3d(${props.in ? 0 : 20}px, 0, 0)`, // Bewegung entlang der x-Achse
    },
    config: { tension: 200, friction: 20 }, // Konfiguration der Animation
  });

  return (
    <ExtendedAnimatedDiv style={style as AnimatedDivProps['style']}>
      {/* Kombiniert die Animation mit dem Material-UI Collapse */}
      <Collapse {...props} />
    </ExtendedAnimatedDiv>
  );
}
