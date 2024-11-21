export const fragment = `
uniform sampler2D uTexture; // The image texture
varying vec2 vUv;           // UV coordinates

void main() {
    vec4 textureColor = texture2D(uTexture, vUv);
    gl_FragColor = textureColor; // Render the texture color directly
}


`