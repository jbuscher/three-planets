import * as THREE from 'three';

export default class Axes extends THREE.LineSegments {
  constructor ( size ) {
    let vertices = [
      -size, 0, 0,  size, 0, 0,
      0, -size, 0,  0, size, 0,
      0, 0, -size,  0, 0, size
    ];

    let colors = [
      1, 0, 0,  1, 0.6, 0,
      0, 1, 0,  0.6, 1, 0,
      0, 0, 1,  0, 0.6, 1
    ];

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

    var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );

    super( geometry, material );
  }
}
