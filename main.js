import * as THREE from "three";
import "./style.css";
import { SceneInit } from "./utils/SceneInit.module";
import stars from "/img/bg.png";
import sunTexture from "/img/sun.jpg";
import mercuryTexture from "/img/mercury.jpg";
import venusTexture from "/img/venus.jpg";
import earthTexture from "/img/earth.jpg";
import marsTexture from "/img/mars.jpg";
import jupiterTexture from "/img/jupiter.jpg";
import saturnTexture from "/img/saturn.jpg";
import saturnRingTexture from "/img/saturnRing.png";
import uranusTexture from "/img/uranus.jpg";
import uranusRingTexture from "/img/uranusRing.png";
import neptuneTexture from "/img/neptune.jpg";
import plutoTexture from "/img/pluto.jpg";

const screen = new SceneInit();
screen.initScene();

const textureLoader = new THREE.TextureLoader();

const geometry = new THREE.SphereGeometry(16, 30, 30);
const mat = new THREE.MeshBasicMaterial({
	map: textureLoader.load(sunTexture),
});
const sun = new THREE.Mesh(geometry, mat);
screen.scene.add(sun);

function createPlanet(size, texture, position, ring) {
	const geo = new THREE.SphereGeometry(size, 30, 30);
	const mat = new THREE.MeshStandardMaterial({
		map: textureLoader.load(texture),
	});
	const mesh = new THREE.Mesh(geo, mat);
	const obj = new THREE.Object3D();
	obj.add(mesh);
	if (ring) {
		const ringGeo = new THREE.RingGeometry(
			ring.innerRadius,
			ring.outerRadius,
			32
		);
		const ringMat = new THREE.MeshBasicMaterial({
			map: textureLoader.load(ring.texture),
			side: THREE.DoubleSide,
		});
		const ringMesh = new THREE.Mesh(ringGeo, ringMat);
		obj.add(ringMesh);
		ringMesh.position.x = position;
		ringMesh.rotation.x = -0.5 * Math.PI;
	}
	screen.scene.add(obj);
	mesh.position.x = position;

	const orbitGeo = new THREE.RingGeometry(
		position + 1,
		position,
		position + 4
	);
	const ringMat = new THREE.MeshBasicMaterial({
		color: 0xffffff,
		side: THREE.DoubleSide,
	});
	const orbitMesh = new THREE.Mesh(orbitGeo, ringMat);
	screen.scene.add(orbitMesh);
	// orbitMesh.position.x = position;
	orbitMesh.rotation.x = -0.5 * Math.PI;

	return { mesh, obj };
}

const mercury = createPlanet(3.2, mercuryTexture, 28);
const venus = createPlanet(5.8, venusTexture, 44);
const earth = createPlanet(6, earthTexture, 62);
const mars = createPlanet(4, marsTexture, 78);
const jupiter = createPlanet(12, jupiterTexture, 100);

const saturn = createPlanet(10, saturnTexture, 138, {
	innerRadius: 10,
	outerRadius: 20,
	texture: saturnRingTexture,
});
const uranus = createPlanet(7, uranusTexture, 176, {
	innerRadius: 7,
	outerRadius: 12,
	texture: uranusRingTexture,
});
const neptune = createPlanet(7, neptuneTexture, 200);
const pluto = createPlanet(2.8, plutoTexture, 216);

const pointlight = new THREE.PointLight(0xffffff, 2, 300);
screen.scene.add(pointlight);

screen.camera.position.set(120, 80, 65);

const cubeTextureLoader = new THREE.CubeTextureLoader();
screen.scene.background = cubeTextureLoader.load([
	stars,
	stars,
	stars,
	stars,
	stars,
	stars,
]);

function addStar() {
	const geometry = new THREE.SphereGeometry(0.6, 24, 24);
	const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
	const star = new THREE.Mesh(geometry, material);

	const [x, y, z] = Array(3)
		.fill()
		.map(() => THREE.MathUtils.randFloatSpread(600));
	star.position.set(x, y, z);
	screen.scene.add(star);
}

Array(300).fill().forEach(addStar);

screen.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const render = (time) => {
	sun.rotateY(0.004);

	mercury.mesh.rotateY(0.004);
	venus.mesh.rotateY(0.002);
	earth.mesh.rotateY(0.02);
	mars.mesh.rotateY(0.018);
	jupiter.mesh.rotateY(0.04);
	saturn.mesh.rotateY(0.038);
	uranus.mesh.rotateY(0.03);
	neptune.mesh.rotateY(0.032);
	pluto.mesh.rotateY(0.008);

	//Around-sun-rotation
	mercury.obj.rotateY(0.04);
	venus.obj.rotateY(0.015);
	earth.obj.rotateY(0.01);
	mars.obj.rotateY(0.008);
	jupiter.obj.rotateY(0.002);
	saturn.obj.rotateY(0.0009);
	uranus.obj.rotateY(0.0004);
	neptune.obj.rotateY(0.0001);
	pluto.obj.rotateY(0.00009);

	requestAnimationFrame(render);
};

render();

screen.animate();
