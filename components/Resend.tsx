"use client";

import { useEffect } from "react";
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { RectAreaLightUniformsLib, RectAreaLightHelper } from "three/addons";
import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  FXAAEffect,
  RenderPass,
} from "postprocessing";

const Resend = () => {
  useEffect(() => {
    const cubesPerSide = 3;

    function toRadians(angle: number) {
      return angle * (Math.PI / 180);
    }

    function createBoxWithRoundedEdges(
      width: number,
      height: number,
      depth: number,
      radius0: number,
      smoothness: number,
    ) {
      let shape = new THREE.Shape();
      let eps = 0.00001; // eps for epsilon (small value)
      let radius = radius0 - eps;

      shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
      shape.absarc(eps, height - radius * 2, eps, Math.PI, Math.PI / 2, true);
      shape.absarc(
        width - radius * 2,
        height - radius * 2,
        eps,
        Math.PI / 2,
        0,
        true,
      );
      shape.absarc(width - radius * 2, eps, eps, 0, -Math.PI / 2, true);

      let geometry = new THREE.ExtrudeGeometry(shape, {
        depth: depth - radius0 * 2,
        bevelEnabled: true,
        bevelSegments: smoothness * 2,
        steps: 1,
        bevelSize: radius,
        bevelThickness: radius0,
        curveSegments: smoothness,
      });

      geometry.center();

      return geometry;
    }

    function createCubes() {
      const material = new THREE.MeshStandardMaterial({
        color: 0x424242,
        metalness: 1,
        roughness: 0,
      });
      const numCubes = cubesPerSide;
      const cubes = new THREE.Object3D();
      const offset = (numCubes - 1) / 2;

      for (let i = 0; i < numCubes; i++) {
        const layer = new THREE.Object3D();

        for (let j = 0; j < numCubes; j++) {
          for (let k = 0; k < numCubes; k++) {
            const geom = createBoxWithRoundedEdges(1, 1, 1, 0.15, 10); // Adjust smoothness, radius etc here (smoothness causes performance issues)
            const x = (i - offset) * 1.01; // Adjust values to change gap between cubes
            const y = (j - offset) * 1.01;
            const z = (k - offset) * 1.01;

            geom.translate(x, y, z);

            const cube = new THREE.Mesh(geom, material);

            layer.add(cube);
          }
        }

        cubes.add(layer);
      }

      const innerWrapper = new THREE.Object3D();
      innerWrapper.add(cubes);

      const outerWrapper = new THREE.Object3D();
      outerWrapper.add(innerWrapper);

      return outerWrapper;
    }

    function layerRotation(cube: THREE.Object3D, delay: number) {
      // Rotate the  wrapped cube 90 degrees along y/z axis
      if (Math.random() > 0.5) {
        cube.rotateY(Math.PI / 2);
      } else {
        cube.rotateZ(Math.PI / 2);
      }

      // Pick a random layer to rotate
      const sideIndex = Math.floor(Math.random() * cubesPerSide);
      const side = cube.children[sideIndex];

      // Pick a random direction to rotate
      const angles = {
        x: Math.random() > 0.5 ? -Math.PI : Math.PI,
        y: 0,
        z: 0,
      };

      // Pick a random time to wait between rotations
      const pause = Math.random() * 2000; // Change this value to influence pauses

      // Create the animation with tweenjs
      new TWEEN.Tween(side.rotation)
        .delay(pause)
        .to(
          {
            x: side.rotation.x + angles.x,
            y: side.rotation.y + angles.y,
            z: side.rotation.z + angles.z,
          },
          delay,
        )
        .easing(TWEEN.Easing.Quadratic.InOut) // https://sbcode.net/threejs/tween/
        .onComplete(function () {
          setTimeout(layerRotation, pause, cube, delay);
        })
        .start();
    }

    function buildScene() {
      // Create the scene
      const scene = new THREE.Scene();

      // Create the light panels
      RectAreaLightUniformsLib.init();

      const panel1 = new THREE.RectAreaLight(0xea7bd9, 50, 20, 20);
      panel1.position.set(10, 10, 0);
      panel1.lookAt(0, 0, 0);
      scene.add(panel1);

      const panel2 = new THREE.RectAreaLight(0xffffff, 100, 20, 20);
      panel2.position.set(10, -10, 0);
      panel2.lookAt(0, 0, 0);
      //scene.add(panel2);

      const panel3 = new THREE.RectAreaLight(0xffffff, 100, 20, 20);
      panel3.position.set(-10, -10, 0);
      panel3.lookAt(0, 0, 0);
      //scene.add(panel3);

      const panel4 = new THREE.RectAreaLight(0xffffff, 100, 20, 20);
      panel4.position.set(-10, 10, 0);
      panel4.lookAt(0, 0, 0);
      //scene.add(panel4);

      const panel5 = new THREE.RectAreaLight(0xffffff, 100, 20, 20);
      panel5.position.set(20, 0, 0);
      panel5.lookAt(0, 0, 0);
      //scene.add(panel5);

      const panel6 = new THREE.RectAreaLight(0x79e3c0, 30, 20, 20);
      panel6.position.set(10, -20, 10);
      panel6.lookAt(0, 0, 0);
      scene.add(panel6);

      const panel7 = new THREE.RectAreaLight(0x83e19e, 30, 20, 20);
      panel7.position.set(-20, 0, 10);
      panel7.lookAt(0, 0, 0);
      scene.add(panel7);

      const panel8 = new THREE.RectAreaLight(0xffffff, 100, 20, 20);
      panel8.position.set(0, 20, 0);
      panel8.lookAt(0, 0, 0);
      //scene.add(panel8);

      // RectAreaLightHelper helps visualize the panels
      //scene.add(new RectAreaLightHelper(panel1));
      //scene.add(new RectAreaLightHelper(panel2));
      //scene.add(new RectAreaLightHelper(panel3));
      //scene.add(new RectAreaLightHelper(panel4));
      //scene.add(new RectAreaLightHelper(panel5));
      //scene.add(new RectAreaLightHelper(panel6));
      //scene.add(new RectAreaLightHelper(panel7));
      //scene.add(new RectAreaLightHelper(panel8));

      // Create a Rubik's Cube
      const cube = createCubes();
      scene.add(cube);

      return { scene, cube };
    }

    function addControls() {
      addEventListener("mousedown", () => {
        isDragging = true;
      });

      addEventListener("mousemove", (e) => {
        // Know how much the mouse has moved
        let deltaMove = {
          x: e.offsetX - previousMousePosition.x,
          y: e.offsetY - previousMousePosition.y,
        };

        if (isDragging) {
          // Prepare the rotation
          let deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(
              toRadians(deltaMove.y * 1),
              toRadians(deltaMove.x * 1),
              0,
              "XYZ",
            ),
          );

          // Rotate the cube (outerWrapper)
          cube.quaternion.multiplyQuaternions(
            deltaRotationQuaternion,
            cube.quaternion,
          );
        }

        // Store the previous position
        previousMousePosition = {
          x: e.offsetX,
          y: e.offsetY,
        };
      });

      addEventListener("mouseup", () => {
        isDragging = false;
      });
    }

    function addCamera() {
      // Create the camera
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Mainly change FOV (first value) to zoom in or out

      // Position the camera
      camera.position.x = 0;
      camera.position.y = 0;
      camera.position.z = 12; // Increase to zoom out
      camera.lookAt(0, 0, 0);

      return camera;
    }

    function addRenderer() {
      // Create the renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        depth: false,
      });

      renderer.autoClear = false;

      // Append renderer's canvas to the container div
      const container = document.getElementById("cube");
      container?.appendChild(renderer.domElement);

      // Add bloom
      const bloomOptions = {
        luminanceThreshold: 0,
        intensity: 0.7,
        mipmapBlur: true,
      };
      const bloomPass = new BloomEffect(bloomOptions);
      const FXAAPass = new FXAAEffect();

      var composer = new EffectComposer(renderer);
      composer.setSize(1200, 1200); // Sets the size for the actual scene in px
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(new EffectPass(camera, FXAAPass, bloomPass));

      return composer;
    }

    function update(dt = 0, totalTime = 0) {
      setTimeout(function () {
        let currTime = new Date().getTime() / 1000;
        dt = currTime - (lastFrameTime || currTime);
        totalTime += dt;
        update(dt, totalTime);
        lastFrameTime = currTime;
      }, 0);
    }

    let isDragging = false;
    let previousMousePosition = {
      x: 0,
      y: 0,
    };

    let lastFrameTime = new Date().getTime() / 1000;

    const { scene, cube } = buildScene();
    const camera = addCamera();
    const composer = addRenderer();

    layerRotation(cube.children[0].children[0], 3000);

    requestAnimationFrame(function render() {
      requestAnimationFrame(render);

      // Comment out these lines to stop the cube's rotation
      cube.children[0].rotation.x += 0.005;
      cube.children[0].rotation.y += 0.005;
      cube.children[0].rotation.z += 0.005;

      TWEEN.update();

      composer.render();
    });

    addControls();

    update();
  }, []);

  return (
    <>
      <div id="cube" className="canvas-container" />
      {/*
      <div className="god-rays-wrapper">
        <div className="god-rays" />
      </div>
      */}
    </>
  );
};

export default Resend;
