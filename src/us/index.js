import Detector from "three/examples/js/Detector";
import { CustomRingGeometry } from "./customRing";
import mountainPoints from "./scaledPoints.json";
import {
  addObjectToControls,
  controlsUpdate,
  ignoreFromElement,
  initControls,
  getScroll,
  adjustSpeed,
} from "./controls";
import "./us.html";

if (!Detector.webgl) Detector.addGetWebGLMessage();

const camInnerRadiusMM = 17.5;
const aishaInnerRadiusMM = 16.57;
const thicknessMM = 1.7;
const togetherDistance = 1.8;
const maxDistance = 20;
const thetaSegments = 128;
const refractionRatio = 0.47; // https://pixelandpoly.com/ior.html

let container;
let camera;
let scene;
let renderer;
let material;
let ambientLight;
let aishaRingMesh;
let cameronRingMesh;

init();
initControls(container);
requestAnimationFrame(animate);

// https://github.com/mrdoob/three.js/pull/9746
function textureFromEquirectangular(source, size, detail) {
  const scene = new THREE.Scene();

  const gl = renderer.getContext();
  const maxSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);

  const camera = new THREE.CubeCamera(1, 100000, Math.min(size, maxSize));

  source.wrapS = source.wrapT = THREE.RepeatWrapping;

  const material = new THREE.MeshBasicMaterial({
    map: source,
    side: THREE.BackSide,
  });

  const mesh = new THREE.Mesh(
    new THREE.SphereBufferGeometry(100, 10 * (detail || 3), 10 * (detail || 3)),
    material,
  );

  scene.add(mesh);

  camera.updateCubeMap(renderer, scene);
  camera.renderTarget.texture.isRenderTargetCubeTexture = true;

  return camera.renderTarget.texture;
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

async function loadTexture(source) {
  return new Promise(resolve => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(source, resolve);
  });
}

async function loadEnvTexture() {
  return new Promise(resolve => {
    new THREE.CubeTextureLoader().load(
      [
        require("./media/env/px.jpg"),
        require("./media/env/nx.jpg"),
        require("./media/env/py.jpg"),
        require("./media/env/ny.jpg"),
        require("./media/env/pz.jpg"),
        require("./media/env/nz.jpg"),
      ],
      resolve,
    );
  });
}

function init() {
  container = document.getElementById("rings");

  camera = new THREE.PerspectiveCamera(
    35,
    container.offsetWidth / container.offsetHeight,
    1,
    1000,
  );
  camera.position.set(0, 0, 120);
  camera.lookAt(0, 0, 0);

  scene = new THREE.Scene();

  var ringGroup = new THREE.Group();
  ringGroup.rotateX(-Math.PI / 2);
  scene.add(ringGroup);
  addObjectToControls(ringGroup);

  const aishaRingGeometry = new CustomRingGeometry({
    innerRadius: aishaInnerRadiusMM,
    outerRadius: aishaInnerRadiusMM + thicknessMM,
    thetaSegments,
    height: 4.7,
    points: mountainPoints,
    pointsEdgeHeightPercent: 0.1,
    invert: true,
  });
  aishaRingGeometry.computeVertexNormals();

  const cameronRingGeometry = new CustomRingGeometry({
    innerRadius: camInnerRadiusMM,
    outerRadius: camInnerRadiusMM + thicknessMM,
    thetaSegments,
    height: 6,
    pointsEdgeHeightPercent: 0.2,
    points: mountainPoints,
  });
  cameronRingGeometry.computeVertexNormals();

  (async () => {
    const [envMap, normalMap] = await Promise.all([
      loadEnvTexture(),
      loadTexture(require("./media/normalMap.png")),
    ]);

    const cameronMaterial = new THREE.MeshStandardMaterial({
      color: 0xd2d0ca,
      roughness: 0.45,
      metalness: 1,
      normalMap,
      envMap,
      envMapIntensity: 1,
    });
    cameronMaterial.refractionRatio = refractionRatio;

    cameronRingMesh = new THREE.Mesh(cameronRingGeometry, cameronMaterial);

    ringGroup.add(cameronRingMesh);

    const aishaMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xdcd6bc,
      roughness: 0.2,
      reflectivity: 0.5,
      metalness: 1,
      envMap,
      envMapIntensity: 1,
    });
    material = aishaMaterial;
    aishaMaterial.refractionRatio = refractionRatio;

    aishaRingMesh = new THREE.Mesh(aishaRingGeometry, aishaMaterial);

    updatePositionByScroll();
    ringGroup.add(aishaRingMesh);
  })();

  // Lights

  ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  addShadowedLight(1, 1, 1, 0xffffff, 1.35);

  // renderer

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.offsetWidth, container.offsetHeight);

  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  renderer.shadowMap.enabled = true;

  container.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize, false);
}

function addShadowedLight(x, y, z, color, intensity) {
  var directionalLight = new THREE.DirectionalLight(color, intensity);
  directionalLight.position.set(x, y, z);
  scene.add(directionalLight);

  directionalLight.castShadow = true;

  var d = 1;
  directionalLight.shadow.camera.left = -d;
  directionalLight.shadow.camera.right = d;
  directionalLight.shadow.camera.top = d;
  directionalLight.shadow.camera.bottom = -d;

  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 4;

  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;

  directionalLight.shadow.bias = -0.002;
}

function onWindowResize() {
  camera.aspect = container.offsetWidth / container.offsetHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.offsetWidth, container.offsetHeight);
}

function animate() {
  requestAnimationFrame(animate);

  render();
}

function updatePositionByScroll() {
  let { x: scrollX, y: scrollY } = getScroll();

  const { top, bottom, height } = container.getBoundingClientRect();
  // 1 when at bottom of screen, 0 when at top
  const percent = top / (window.innerHeight - height);

  const activationScrollPercent = 0.2;
  let distance;
  if (percent > 1) {
    distance = maxDistance + togetherDistance;
  } else if (percent < activationScrollPercent) {
    distance = togetherDistance;
  } else {
    distance =
      (percent - activationScrollPercent) *
        (1 / (1 - activationScrollPercent)) *
        maxDistance +
      togetherDistance;
  }
  aishaRingMesh.position.setZ(distance);
  cameronRingMesh.position.setZ(-distance);

  if (percent < 1 && percent > 0) {
    adjustSpeed(
      ({ speed, hasInteracted }) =>
        hasInteracted
          ? speed
          : {
              x: easeInOutQuad(1 - percent) * 0.02,
              y: easeInOutQuad(1 - percent) * 0.02,
            },
    );
  }
}

function render() {
  controlsUpdate();

  if (aishaRingMesh && cameronRingMesh) {
    updatePositionByScroll();
    // console.log({ top, bottom, mid, percent, scrollY, h: window.innerHeight });
    //   const distance =
    //     (Math.sin(Date.now() / 1000) + 1) / 2 * 10 + togetherDistance;
    //   aishaRingMesh.position.setZ(distance);
    //   cameronRingMesh.position.setZ(-distance);
  }

  renderer.render(scene, camera);
}
