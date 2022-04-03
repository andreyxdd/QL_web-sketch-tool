import React from 'react';
import { Circle } from '@react-three/drei';
import { useDrag } from '@use-gesture/react';
import shallow from 'zustand/shallow';
import { SketchPlane, helperPoint, arrayToVector3 } from '../../utils/geometryHelpers';
import useSketchStore, { ISketchStore } from '../../hooks/useSketchStore';

interface IPoint {
  id: number;
  position: Array<number>;
}

const Point: React.FC<IPoint> = ({ id, position }) => {
  const [vertices, setVertices] = useSketchStore(
    (state: ISketchStore) => [state.vertices, state.setVertices],
    shallow,
  );

  const [hovered, setHovered] = React.useState(false);

  const bind = useDrag(({ event }: any) => {
    event.ray.intersectPlane(SketchPlane, helperPoint);

    const vertexIndex = vertices.findIndex((v) => v.id === id);
    vertices[vertexIndex].position = [
      helperPoint.x, vertices[vertexIndex].position[1], helperPoint.z,
    ];

    setVertices([...vertices]);
  }, { pointerEvents: true });

  return (
    // @ts-ignore
    <Circle
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...bind()}
      position={arrayToVector3(position)}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      args={[0.1, 32]}
    >
      <meshBasicMaterial color={hovered ? 'hotpink' : 'white'} />
    </Circle>
  );
};

export default Point;