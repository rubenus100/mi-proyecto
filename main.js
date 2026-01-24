// =====================
// Habitación 3D en Three.js (tamaño medio 4.5m x 6.0m x 3.0m)
// =====================

/* Configuración básica
   - Suelo: 4.5 x 6.0
   - Paredes: 3.0 m de alto
   - Puerta y ventana proporcionadas
*/
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

// Cámara
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(6, 2.2, 8); // altura de ojo ~2.2 m
camera.lookAt(0, 1, 0);

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

// Suelo (habitación de tamaño medio)
const floorWidth = 4.5;
const floorLength = 6.0;
const floorGeo = new THREE.PlaneGeometry(floorWidth, floorLength);
const floorMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.8, metalness: 0.0 });
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Paredes (aproximadas, grosor simulando paredes)
const wallColor = 0xffffff;
const wallMat = new THREE.MeshStandardMaterial({ color: wallColor });

// Función para crear una pared como muro del tamaño especificado
function crearPared(ancho, alto, posicion, rotationY = 0) {
  const wallGeo = new THREE.BoxGeometry(ancho, alto, 0.15); // grosor de pared 15 cm
  const wall = new THREE.Mesh(wallGeo, wallMat);
  wall.position.set(posicion.x, alto / 2, posicion.z);
  wall.rotation.y = rotationY;
  wall.receiveShadow = true;
  scene.add(wall);
}

// Altura de paredes
const wallAltura = 3.0;
const muroThick = 0.15;

// Frente (z negativo)
crearPared(4.5, wallAltura, new THREE.Vector3(0, 0, - (floorLength / 2) + muroThick), 0);
// Atrás (z positivo)
crearPared(4.5, wallAltura, new THREE.Vector3(0, 0, (floorLength / 2) - muroThick), 0);
// Izquierda (x negativo)
crearPared((floorLength), wallAltura, new THREE.Vector3(- (floorWidth / 2) + muroThick, 0, 0), Math.PI / 2);
// Derecha (x positivo)
crearPared((floorLength), wallAltura, new THREE.Vector3((floorWidth / 2) - muroThick, 0, 0), Math.PI / 2);

// Puerta (rectángulo negro simple)
const doorWidth = 0.9;
const doorHeight = 2.0;
const doorDepth = 0.08;
const doorGeo = new THREE.BoxGeometry(doorWidth, doorHeight, doorDepth);
const doorMat = new THREE.MeshStandardMaterial({ color: 0x2f2f2f });
const door = new THREE.Mesh(doorGeo, doorMat);
// Ubicación de la puerta en la pared frontal
door.position.set(- (floorWidth / 2) + (doorWidth / 2) + 0.2, doorHeight / 2, - (floorLength / 2) + 0.075);
scene.add(door);

// Ventana (vidrio translúcido)
const windowWidth = 1.5;
const windowHeight = 1.2;
const windowDepth = 0.08;
const glassMat = new THREE.MeshStandardMaterial({ color: 0x88c9ff, opacity: 0.6, transparent: true });
const windowGeo = new THREE.BoxGeometry(windowWidth, windowHeight, windowDepth);
const windowMesh = new THREE.Mesh(windowGeo, glassMat);
// Ubicación en pared frontal opuesta a la puerta
windowMesh.position.set((floorWidth / 2) - (windowWidth / 2) - 0.2, windowHeight / 2 + 0.2, - (floorLength / 2) + 0.075);
scene.add(windowMesh);

// Mueble simple (apilado/estante)
const cabinetGeo = new THREE.BoxGeometry(1.8, 1.0, 0.6);
const cabinetMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
const cabinet = new THREE.Mesh(cabinetGeo, cabinetMat);
cabinet.position.set(-1.0, 0.5, -1.0);
scene.add(cabinet);

// Opcional: una lámpara pequeña (luz puntual) para realzar ambiente
const pointLight = new THREE.PointLight(0xffffff, 0.8, 6);
pointLight.position.set(-2.5, 2.5, 1.5);
scene.add(pointLight);

// Animación
function animate() {
  requestAnimationFrame(animate);

  // Pequeño dinamismo: girar mueble suavemente
  cabinet.rotation.y += 0.005;

  controls.update();
  renderer.render(scene, camera);
}
animate();

// Manejo de cambio de tamaño
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
