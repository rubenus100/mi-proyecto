import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Luz y Rejilla
scene.add(new THREE.AmbientLight(0xffffff, 0.7));
const grid = new THREE.GridHelper(10, 10);
scene.add(grid);

// --- GEOMETRÍA INICIAL ---
let currentHeight = 2;
const shape = new THREE.Shape();
shape.absarc(0, 0, 1, 0, Math.PI * 2); // Un cilindro simple para probar

function createExtrusion(height) {
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false });
    geometry.center();
    return geometry;
}

let material = new THREE.MeshPhongMaterial({ color: 0x3498db });
let mesh = new THREE.Mesh(createExtrusion(currentHeight), material);
scene.add(mesh);

// --- VARIABLES DE ESTADO ---
let isDragging = false;
let startMouseY = 0;
let initialHeight = currentHeight;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const controls = new OrbitControls(camera, renderer.domElement);

// --- EVENTOS ---

window.addEventListener('mousedown', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(mesh);

    if (intersects.length > 0) {
        // Si tocamos la tapa superior (en este caso el faceIndex varía, pero simplificamos)
        isDragging = true;
        startMouseY = e.clientY;
        initialHeight = currentHeight;
        controls.enabled = false; // Desactivar rotación de cámara mientras extruimos
        mesh.material.color.set(0xe74c3c); // Cambia a rojo al editar
    }
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    // Calcular cuánto se ha movido el mouse verticalmente
    const deltaY = (startMouseY - e.clientY) * 0.01; 
    currentHeight = Math.max(0.1, initialHeight + deltaY); // No permitir altura negativa

    // Actualizar Geometría (Eliminar vieja, crear nueva)
    mesh.geometry.dispose();
    mesh.geometry = createExtrusion(currentHeight);
});

window.addEventListener('mouseup', () => {
    isDragging = false;
    controls.enabled = true; // Reactivar cámara
    mesh.material.color.set(0x3498db); // Volver al azul original
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();