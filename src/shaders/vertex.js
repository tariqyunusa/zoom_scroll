export const vertex = `
varying vec2 vUv;
uniform float progress;


		void main() {

			vUv = uv;
            vec3 pos = position;
            pos.z += progress ;

            vec3 vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
			gl_Position = projectionMatrix * viewMatrix * vec4(vWorldPosition, 1.0);

		}
`