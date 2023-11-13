// import {OrbitControls} from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";
// import "https://cdn.jsdelivr.net/npm/three@0.138.0/examples/js/loaders/GLTFLoader.js";

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

//Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.z = 5;
camera.position.y = 1.5;

// Render
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('modelContainer').appendChild(renderer.domElement);

// Control
const control = new OrbitControls(camera, renderer.domElement);
control.enableDamping = true;

//Light
const ambient = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambient);

let light1 = new THREE.PointLight(0xffffff, 1);
light1.position.set(-100,450,500);
scene.add(light1);

let light2 = new THREE.PointLight(0xffffff, 1);
light2.position.set(500,100,50);
scene.add(light2);

const loader = new THREE.TextureLoader();
loader.load('./scape.jpg' , (texture) => {
    scene.background = texture;
});

const models = [
    './models/bmw e34/scene.gltf',
    './models/bmw e38/scene.gltf',
    './models/bmw e36/scene.gltf',
    './models/skull/scene.gltf',
    './models/porsche/scene.gltf',
    './models/human/scene.gltf',
    './models/emoji/scene.gltf',
    './models/dino/scene.gltf',
    './models/guitar/scene.gltf',
    './models/nike/scene.gltf',
];

let currentModelIndex = 0;

scene.environment = new RGBELoader().load( 'three/examples/textures/equirectangular/venice_sunset_1k.hdr' );
scene.environment.mapping = THREE.EquirectangularReflectionMapping;
scene.fog = new THREE.Fog( 0x333333, 10, 15 );

function loadModel(modelIndex) {
    const loader = new GLTFLoader();
    loader.load(models[modelIndex], (gltf) => {
        scene.clear();
        gltf.scene.rotation.y = Math.PI * -0.8;
        scene.add(gltf.scene);
    });
}

document.getElementById('next-model').addEventListener('click', () => {
    currentModelIndex = (currentModelIndex + 1) % models.length;
    loadModel(currentModelIndex);
});

document.getElementById('prev-model').addEventListener('click', () => {
    currentModelIndex = (currentModelIndex - 1 + models.length) % models.length;
    loadModel(currentModelIndex);
});

let autoRotate = false;
document.getElementById('toggle-rotation').addEventListener('click', () => {
    autoRotate = !autoRotate;
    const toggleButton = document.getElementById('toggle-rotation');

    if (autoRotate) {
        toggleButton.textContent = 'Остановить вращение';
        toggleButton.classList.add('stopped');
    } else {
        toggleButton.textContent = 'Запустить вращение';
        toggleButton.classList.remove('stopped');
    }
});

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener('resize', onWindowResize);
function animate() {
    window.requestAnimationFrame(animate);
    if (autoRotate) {
        scene.rotation.y += 0.005;
    }
    control.update();
    renderer.render(scene, camera);
}

loadModel(currentModelIndex);
animate();

