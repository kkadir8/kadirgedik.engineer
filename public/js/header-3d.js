import * as THREE from 'three';

export function initHeader3D() {
    const canvas = document.getElementById('header-canvas');
    if (!canvas) return;

    // ============== AYARLAR ==============
    const CONFIG = {
        // Grid ayarları
        gridSize: 8,            // 8x8 küp grid
        gridSizeZ: 8,
        cubeSize: 30,           // Küp boyutu
        cubeHeight: 30,         // Küp yüksekliği
        gap: 12,                // Küpler arası boşluk

        // Hover efekti
        hoverRadius: 90,        // Fare etki alanı (geniş - 4'lü grup için)
        maxLift: 30,            // Maksimum yukarı kalkma (zemine yapışık)
        liftSpeed: 0.2,         // Kalkma hızı (daha snappy)
        startHidden: -35,       // Başlangıç pozisyonu (gizli)

        // Renkler
        bgColor: '#030303'      // Arka plan (Site ile uyumlu çok koyu gri/siyah)
    };

    // Gradient renkleri (sol alttan sağ üste)
    const GRADIENT_COLORS = {
        cyan: new THREE.Color('#00ffff'),
        blue: new THREE.Color('#0088ff'),
        purple: new THREE.Color('#8844ff'),
        magenta: new THREE.Color('#ff44ff')
    };

    // ============== SCENE SETUP ==============
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(CONFIG.bgColor); // Background transparent olsun, CSS halletsin
    scene.background = null;

    // Orthographic Camera (izometrik görünüm)
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 400; // Biraz daha zoom in
    const camera = new THREE.OrthographicCamera(
        -frustumSize * aspect / 2,
        frustumSize * aspect / 2,
        frustumSize / 2,
        -frustumSize / 2,
        -2000,
        2000
    );

    // İzometrik açı - orijinale yakın
    camera.position.set(300, 320, 300);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true // Saydam arka plan
    });
    renderer.setSize(window.innerWidth, window.innerHeight); // Full screen
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ============== CLIPPING PLANE ==============
    // Zemin seviyesinde kesme - altı görünmez
    const clippingPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), CONFIG.cubeHeight / 2 + 2);
    renderer.localClippingEnabled = true;

    // ============== IŞIKLANDIRMA ==============
    // Minimal ambient light (küpler koyu kalmalı)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
    scene.add(ambientLight);

    // ============== KÜP OLUŞTURMA ==============
    const cubes = [];
    const cubeGroup = new THREE.Group();

    // Gradient renk hesaplama
    let colorTime = 0;
    const colorSpeed = 0.2;

    function getAnimatedGradientColor(normalizedX, normalizedZ, time) {
        const baseT = (normalizedX + normalizedZ) / 2;
        const t = (baseT + time) % 1;

        if (t < 0.25) {
            return GRADIENT_COLORS.cyan.clone().lerp(GRADIENT_COLORS.blue, t / 0.25);
        } else if (t < 0.5) {
            return GRADIENT_COLORS.blue.clone().lerp(GRADIENT_COLORS.purple, (t - 0.25) / 0.25);
        } else if (t < 0.75) {
            return GRADIENT_COLORS.purple.clone().lerp(GRADIENT_COLORS.magenta, (t - 0.5) / 0.25);
        } else {
            return GRADIENT_COLORS.magenta.clone().lerp(GRADIENT_COLORS.cyan, (t - 0.75) / 0.25);
        }
    }

    function getGradientColor(normalizedX, normalizedZ) {
        return getAnimatedGradientColor(normalizedX, normalizedZ, 0);
    }

    // Küp parametreleri
    const geometry = new THREE.BoxGeometry(CONFIG.cubeSize, CONFIG.cubeHeight, CONFIG.cubeSize);
    const totalWidth = (CONFIG.gridSize - 1) * (CONFIG.cubeSize + CONFIG.gap);
    const totalDepth = (CONFIG.gridSizeZ - 1) * (CONFIG.cubeSize + CONFIG.gap);

    for (let i = 0; i < CONFIG.gridSize; i++) {
        for (let j = 0; j < CONFIG.gridSizeZ; j++) {
            const x = i * (CONFIG.cubeSize + CONFIG.gap) - totalWidth / 2;
            const z = j * (CONFIG.cubeSize + CONFIG.gap) - totalDepth / 2;

            const normalizedX = i / (CONFIG.gridSize - 1);
            const normalizedZ = j / (CONFIG.gridSizeZ - 1);
            const edgeColor = getGradientColor(normalizedX, normalizedZ);

            // Küp materyali
            const cubeMaterial = new THREE.MeshBasicMaterial({
                color: 0x0a0a12,
                transparent: true,
                opacity: 0.9,
                clippingPlanes: [clippingPlane],
                clipShadows: true
            });

            const cube = new THREE.Mesh(geometry, cubeMaterial);
            cube.position.set(x, CONFIG.startHidden, z);

            // Kenarlar
            const edgeRadius = 0.8;
            const edgeMaterial = new THREE.MeshBasicMaterial({
                color: edgeColor,
                transparent: true,
                opacity: 1.0,
                clippingPlanes: [clippingPlane],
                clipShadows: true
            });

            const halfSize = CONFIG.cubeSize / 2;
            const halfHeight = CONFIG.cubeHeight / 2;
            const edgesGroup = new THREE.Group();

            const edgeLines = [
                [[-halfSize, -halfHeight, -halfSize], [halfSize, -halfHeight, -halfSize]],
                [[halfSize, -halfHeight, -halfSize], [halfSize, -halfHeight, halfSize]],
                [[halfSize, -halfHeight, halfSize], [-halfSize, -halfHeight, halfSize]],
                [[-halfSize, -halfHeight, halfSize], [-halfSize, -halfHeight, -halfSize]],
                [[-halfSize, halfHeight, -halfSize], [halfSize, halfHeight, -halfSize]],
                [[halfSize, halfHeight, -halfSize], [halfSize, halfHeight, halfSize]],
                [[halfSize, halfHeight, halfSize], [-halfSize, halfHeight, halfSize]],
                [[-halfSize, halfHeight, halfSize], [-halfSize, halfHeight, -halfSize]],
                [[-halfSize, -halfHeight, -halfSize], [-halfSize, halfHeight, -halfSize]],
                [[halfSize, -halfHeight, -halfSize], [halfSize, halfHeight, -halfSize]],
                [[halfSize, -halfHeight, halfSize], [halfSize, halfHeight, halfSize]],
                [[-halfSize, -halfHeight, halfSize], [-halfSize, halfHeight, halfSize]]
            ];

            edgeLines.forEach(([start, end], edgeIndex) => {
                const startVec = new THREE.Vector3(...start);
                const endVec = new THREE.Vector3(...end);
                const direction = new THREE.Vector3().subVectors(endVec, startVec);
                const length = direction.length();
                const edgeGeometry = new THREE.CylinderGeometry(edgeRadius, edgeRadius, length, 6);
                const edge = new THREE.Mesh(edgeGeometry, edgeMaterial.clone());
                edge.position.copy(startVec).add(endVec).multiplyScalar(0.5);
                edge.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());

                edge.userData = {
                    originalLength: length,
                    edgeIndex: edgeIndex,
                    edgeType: edgeIndex < 4 ? 'bottom' : (edgeIndex < 8 ? 'top' : 'vertical')
                };
                edge.scale.y = 0.01;
                edgesGroup.add(edge);
            });

            // Köşeler
            const corners = [
                [-halfSize, -halfHeight, -halfSize], [halfSize, -halfHeight, -halfSize],
                [halfSize, -halfHeight, halfSize], [-halfSize, -halfHeight, halfSize],
                [-halfSize, halfHeight, -halfSize], [halfSize, halfHeight, -halfSize],
                [halfSize, halfHeight, halfSize], [-halfSize, halfHeight, halfSize]
            ];
            const sphereGeometry = new THREE.SphereGeometry(edgeRadius * 1.1, 8, 8);
            corners.forEach((pos, cornerIndex) => {
                const sphere = new THREE.Mesh(sphereGeometry, edgeMaterial.clone());
                sphere.position.set(...pos);
                sphere.userData = { isCorner: true, cornerIndex: cornerIndex };
                sphere.scale.set(0.01, 0.01, 0.01);
                edgesGroup.add(sphere);
            });

            cube.add(edgesGroup);
            cube.visible = false;

            // Zemin (Floor)
            const floorSize = CONFIG.cubeSize + CONFIG.gap;
            const floorGeometry = new THREE.PlaneGeometry(floorSize, floorSize);
            const floorMaterial = new THREE.MeshBasicMaterial({
                color: edgeColor,
                transparent: true,
                opacity: 0,
                side: THREE.DoubleSide
            });
            const floor = new THREE.Mesh(floorGeometry, floorMaterial);
            floor.rotation.x = -Math.PI / 2;
            floor.position.set(x, -CONFIG.cubeHeight / 2 - 2, z);
            floor.visible = false;
            cubeGroup.add(floor);

            cube.userData = {
                originalY: CONFIG.startHidden,
                targetY: CONFIG.startHidden,
                currentY: CONFIG.startHidden,
                gridX: i,
                gridZ: j,
                floor: floor,
                targetScale: 0,
                currentScale: 0
            };

            cubes.push(cube);
            cubeGroup.add(cube);
        }
    }

    // Dots Pattern
    const dotsGroup = new THREE.Group();
    const gridDots = [];
    for (let i = 0; i < CONFIG.gridSize; i++) {
        for (let j = 0; j < CONFIG.gridSizeZ; j++) {
            const x = i * (CONFIG.cubeSize + CONFIG.gap) - totalWidth / 2;
            const z = j * (CONFIG.cubeSize + CONFIG.gap) - totalDepth / 2;
            const normalizedX = i / (CONFIG.gridSize - 1);
            const normalizedZ = j / (CONFIG.gridSizeZ - 1);
            const dotColor = getGradientColor(normalizedX, normalizedZ);

            const corners = [[-15, -15], [15, -15], [-15, 15], [15, 15]]; // Approximate positions
            corners.forEach(([dx, dz]) => {
                const dotGeometry = new THREE.CircleGeometry(2, 8);
                const dotMaterial = new THREE.MeshBasicMaterial({ color: dotColor, transparent: true, opacity: 0.4 });
                const dot = new THREE.Mesh(dotGeometry, dotMaterial);
                dot.rotation.x = -Math.PI / 2;
                dot.position.set(x + dx, -CONFIG.cubeHeight / 2 + 1, z + dz);
                dot.userData = { normalizedX, normalizedZ };
                gridDots.push(dot);
                dotsGroup.add(dot);
            });
        }
    }
    cubeGroup.add(dotsGroup);
    scene.add(cubeGroup);

    // Mouse Interaction
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let mouseWorldPos = new THREE.Vector3();

    function updateMouseWorldPosition(event) {
        // Canvas konumu ve boyutlarını al (offset'leri hesaba kat)
        // Eğer canvas full screen fixed değilse, getBoundingClientRect önemli
        const rect = canvas.getBoundingClientRect();

        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        raycaster.ray.intersectPlane(plane, mouseWorldPos);
    }

    window.addEventListener('mousemove', updateMouseWorldPosition);
    window.addEventListener('touchmove', (e) => {
        if (e.touches[0]) updateMouseWorldPosition(e.touches[0]);
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        let maxFactor = 0;
        cubes.forEach((cube) => {
            const dx = cube.position.x - mouseWorldPos.x;
            const dz = cube.position.z - mouseWorldPos.z;
            const distance = Math.sqrt(dx * dx + dz * dz);
            const outerRadius = CONFIG.hoverRadius * 0.3;

            if (distance < CONFIG.hoverRadius) {
                const rawProx = 1 - (distance / CONFIG.hoverRadius);
                const prox = Math.min(1, rawProx * 2.5);
                const liftAmount = 0.5 + (prox * 0.5);
                maxFactor = Math.max(maxFactor, prox);

                cube.userData.targetY = CONFIG.startHidden + CONFIG.maxLift * liftAmount;
                cube.visible = true;

                // Floor Opacity
                const liftProgress = (cube.userData.currentY - CONFIG.startHidden) / CONFIG.maxLift;
                const floorFade = Math.max(0, Math.min(1, (liftProgress - 0.5) / 0.3));
                if (cube.userData.floor) {
                    cube.userData.floor.visible = floorFade > 0.01;
                    cube.userData.floor.material.opacity = (0.85 + prox * 0.15) * floorFade;
                }

                // Edges Animation
                const edgesGroup = cube.children[0];
                if (edgesGroup) {
                    const unfoldProgress = Math.max(0, Math.min(1, (liftAmount - 0.5) * 3));
                    edgesGroup.children.forEach(el => {
                        el.material.opacity = 0.9 + prox * 0.1;
                        if (el.userData.isCorner) {
                            const newScale = el.userData.isCorner ? unfoldProgress : 0; // Simple logic
                            el.scale.set(unfoldProgress, unfoldProgress, unfoldProgress);
                        } else {
                            // Simplified edge scale logic
                            el.scale.y = unfoldProgress;
                        }
                    });
                }
                cube.material.opacity = 0.85 + prox * 0.15;
            } else if (distance < outerRadius) {
                // Simplified outer radius logic
                cube.userData.targetY = CONFIG.startHidden;
                cube.material.opacity = 0.1;
            } else {
                cube.userData.targetY = CONFIG.startHidden;
                if (cube.userData.currentY < CONFIG.startHidden + 3) {
                    cube.visible = false;
                    if (cube.userData.floor) cube.userData.floor.visible = false;
                }
            }

            // Colors
            const normalizedX = cube.userData.gridX / (CONFIG.gridSize - 1);
            const normalizedZ = cube.userData.gridZ / (CONFIG.gridSizeZ - 1);
            const newColor = getAnimatedGradientColor(normalizedX, normalizedZ, colorTime);

            cube.children[0].children.forEach(c => {
                if (c.material) c.material.color.copy(newColor);
            });
            if (cube.userData.floor) cube.userData.floor.material.color.copy(newColor);

            cube.userData.currentY += (cube.userData.targetY - cube.userData.currentY) * CONFIG.liftSpeed;
            cube.position.y = cube.userData.currentY;
        });

        colorTime += colorSpeed * 0.016;
        gridDots.forEach(dot => {
            const newColor = getAnimatedGradientColor(dot.userData.normalizedX, dot.userData.normalizedZ, colorTime);
            dot.material.color.copy(newColor);
        });

        renderer.render(scene, camera);
    }

    animate();

    // Resize
    window.addEventListener('resize', () => {
        const aspect = window.innerWidth / window.innerHeight;
        camera.left = -frustumSize * aspect / 2;
        camera.right = frustumSize * aspect / 2;
        camera.top = frustumSize / 2;
        camera.bottom = -frustumSize / 2;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    console.log('✅ Header 3D Inited');
}
