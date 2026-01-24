// =====================
// Escena básica
// =====================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

// Cámara
const camera = new THREE.PerspectiveCamera(
  60, // FOV
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(6, 4, 6);

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('scene-container').appendChild(renderer.domElement);

// Controles (opcional)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Iluminación
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 7.5);
scene.add(dirLight);

// Suelo
const floorGeo = new THREE.PlaneGeometry(12, 12);
const floorMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Paredes (4 paredes)
const wallMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
function crearPared(ancho, alto, posicion, rotationY = 0) {
  const wallGeo = new THREE.BoxGeometry(ancho, alto, 0.2);
  const wall = new THREE.Mesh(wallGeo, wallMat);
  wall.position.set(posicion.x, alto / 2, posicion.z);
  wall.rotation.y = rotationY;
  wall.receiveShadow = true;
  scene.add(wall);
}

// Frente
crearPared(6, 3, new THREE.Vector3(0, 0, -3.1), 0);
// Atrás
crearPared(6, 3, new THREE.Vector3(0, 0, 3.1), 0);
// Izquierda
crearPared(6, 3, new THREE.Vector3(-3.1, 0, 0), Math.PI / 2);
// Derecha
crearPared(6, 3, new THREE.Vector3(3.1, 0, 0), Math.PI / 2);

// Puerta (rectángulo negro simple como hueco)
const doorGeo = new THREE.BoxGeometry(1.2, 2.3, 0.1);
const doorMat = new THREE.MeshStandardMaterial({ color: 0x2f2f2f });
const door = new THREE.Mesh(doorGeo, doorMat);
door.position.set(-1.3, 1.15, -3.05);
scene.add(door);

// Ventana (caja transparente para simular vidrio)
const glassMat = new THREE.MeshStandardMaterial({ color: 0x88c9ff, opacity: 0.6, transparent: true });
const windowGeo = new THREE.BoxGeometry(1.8, 1.2, 0.1);
const windowMesh = new THREE.Mesh(windowGeo, glassMat);
windowMesh.position.set(2, 1.2, -3.05);
scene.add(windowMesh);

// Mueble simple (cubito)
const cubeGeo = new THREE.BoxGeometry(1.2, 0.8, 0.6);
const cubeMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
const cabinet = new THREE.Mesh(cubeGeo, cubeMat);
cabinet.position.set(0, 0.4, -1.5);
scene.add(cabinet);

// Animación
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
