"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { profileBannerConfig } from "@/config/profile-banner";
import styles from "./profile-banner.module.css";

const VERTEX = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAGMENT = `
precision mediump float;
uniform sampler2D uPhoto;
uniform vec2 uResolution;
uniform float uImageAspect;
uniform float uPixel;
uniform float uDitherSteps;
uniform float uDitherStrength;
uniform vec3 uShadow;
uniform vec3 uLight;
varying vec2 vUv;
float bayer2(vec2 p) {
  return mod(2.0 * p.x + 3.0 * p.y, 4.0);
}
float bayer4(vec2 p) {
  return (4.0 * bayer2(mod(p, 2.0)) + bayer2(mod(floor(p / 2.0), 2.0)) + 0.5) / 16.0;
}
void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 crop = vec2(min(1.0, aspect / uImageAspect), min(1.0, uImageAspect / aspect));
  vec2 pixel = floor(gl_FragCoord.xy / uPixel);
  vec2 uv = ((pixel + 0.5) * uPixel / uResolution) * crop;
  uv += vec2((1.0 - crop.x) * 0.5, (1.0 - crop.y) * 0.9);
  vec3 photo = texture2D(uPhoto, uv).rgb;
  float luminance = dot(photo, vec3(0.299, 0.587, 0.114));
  float dithered = floor(luminance * uDitherSteps + bayer4(mod(pixel, 4.0))) / uDitherSteps;
  float ink = mix(luminance, dithered, uDitherStrength);
  gl_FragColor = vec4(mix(uShadow, uLight, ink), 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
}

/** One texture pass per resize/theme change. No idle animation or render loop. */
export function DitherPhoto() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photo = profileBannerConfig.photo;

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
    if (!gl) return;
    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) {
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      if (program) gl.deleteProgram(program);
      return;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }
    const buffer = gl.createBuffer();
    const texture = gl.createTexture();
    if (!buffer || !texture) {
      gl.deleteBuffer(buffer);
      gl.deleteTexture(texture);
      gl.deleteProgram(program);
      return;
    }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(gl.getUniformLocation(program, "uPhoto"), 0);
    const uniforms = ["uResolution", "uImageAspect", "uPixel", "uDitherSteps", "uDitherStrength", "uShadow", "uLight"];
    const locations = Object.fromEntries(uniforms.map((name) => [name, gl.getUniformLocation(program, name)]));
    const sample = document.createElement("canvas");
    sample.width = sample.height = 1;
    const colorContext = sample.getContext("2d");
    const resolveColor = (value: string) => {
      if (!colorContext) return [0, 0, 0];
      colorContext.fillStyle = value.trim();
      colorContext.fillRect(0, 0, 1, 1);
      return Array.from(colorContext.getImageData(0, 0, 1, 1).data).slice(0, 3).map((channel) => channel / 255);
    };
    let ready = false;
    let disposed = false;
    const source = new window.Image();
    function draw() {
      if (!ready || disposed || !gl || !canvas || !root || gl.isContextLost()) return;
      const rect = root.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
      gl.viewport(0, 0, canvas.width, canvas.height);
      const colors = getComputedStyle(root);
      gl.uniform2f(locations.uResolution, canvas.width, canvas.height);
      gl.uniform1f(locations.uImageAspect, source.naturalWidth / source.naturalHeight);
      gl.uniform1f(locations.uPixel, ratio * 0.85);
      gl.uniform1f(locations.uDitherSteps, Number(colors.getPropertyValue("--portrait-dither-steps")));
      gl.uniform1f(locations.uDitherStrength, Number(colors.getPropertyValue("--portrait-dither-strength")));
      gl.uniform3fv(locations.uShadow, resolveColor(colors.getPropertyValue("--portrait-shadow")));
      gl.uniform3fv(locations.uLight, resolveColor(colors.getPropertyValue("--portrait-light")));
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      root.dataset.rendered = "true";
    }
    source.onload = () => {
      if (disposed) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      ready = true;
      draw();
    };
    source.src = photo.src;
    const resize = new ResizeObserver(draw);
    resize.observe(root);
    const theme = new MutationObserver(draw);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });
    const loseContext = (event: Event) => {
      event.preventDefault();
      delete root.dataset.rendered;
    };
    canvas.addEventListener("webglcontextlost", loseContext);
    return () => {
      disposed = true;
      source.onload = null;
      resize.disconnect();
      theme.disconnect();
      canvas.removeEventListener("webglcontextlost", loseContext);
      delete root.dataset.rendered;
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [photo.src]);

  return (
    <div ref={rootRef} className={styles.photo}>
      <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 800px) 100vw, 760px" preload className={styles.photoFallback} />
      <canvas ref={canvasRef} role="img" aria-label={photo.shaderLabel} className={styles.canvas} />
    </div>
  );
}
