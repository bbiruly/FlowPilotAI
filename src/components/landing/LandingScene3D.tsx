import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface LandingScene3DProps {
  onEnterApp: () => void;
}

// Pre-allocated scratch helpers outside animation loop to prevent GC stalls
const _vec3 = new THREE.Vector3();
const _targetCameraPos = new THREE.Vector3(0, 3.2, 9.5);
const _targetLookAt = new THREE.Vector3(0, 1.2, 0);
const _currentLookAt = new THREE.Vector3(0, 1.2, 0);
const _dummyMatrix = new THREE.Matrix4();
const _dummyPos = new THREE.Vector3();
const _dummyScale = new THREE.Vector3();
const _dummyQuat = new THREE.Quaternion();

interface ChannelSatelliteData {
  name: string;
  channel: string;
  color: number;
  metric: string;
  speed: number;
  radius: number;
  angleOffset: number;
  inclination: number;
  group: THREE.Group;
}

export const LandingScene3D: React.FC<LandingScene3DProps> = ({ onEnterApp }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeChannelInfo, setActiveChannelInfo] = useState<{
    name: string;
    metric: string;
    color: string;
  } | null>(null);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);
  const [cameraPreset, setCameraPreset] = useState<'orbit' | 'core' | 'tactical'>('orbit');
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [isSoftwareGlDetected, setIsSoftwareGlDetected] = useState(false);

  // References to communicate with Three loop
  const sceneStateRef = useRef({
    speed: 1.0,
    wireframe: false,
    cameraPreset: 'orbit',
    hoveredSatellite: null as ChannelSatelliteData | null
  });

  useEffect(() => {
    sceneStateRef.current.speed = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    sceneStateRef.current.wireframe = wireframeMode;
  }, [wireframeMode]);

  useEffect(() => {
    sceneStateRef.current.cameraPreset = cameraPreset;
    if (cameraPreset === 'orbit') {
      _targetCameraPos.set(0, 3.2, 9.5);
      _targetLookAt.set(0, 1.2, 0);
    } else if (cameraPreset === 'core') {
      _targetCameraPos.set(0, 1.6, 4.2);
      _targetLookAt.set(0, 1.4, 0);
    } else if (cameraPreset === 'tactical') {
      _targetCameraPos.set(0, 7.5, 6.0);
      _targetLookAt.set(0, 0.8, 0);
    }
  }, [cameraPreset]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect Software WebGL
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();
    setIsSoftwareGlDetected(isSoftwareGl);

    // 2. Initialize WebGL Renderer
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Scene & Horizon-matched Fog
    const scene = new THREE.Scene();
    const bgColor = new THREE.Color(0x0a0f1d); // Deep obsidian slate
    scene.background = bgColor;
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.045);

    // 4. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 9.5);
    camera.lookAt(0, 1.2, 0);

    // 5. Environment Map (RoomEnvironment with PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 6. Studio Lighting Rig (Warm key light + Cool fill + Sharp rim)
    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
      const d = 5;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
    }
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0x7c9bf5, 0x1a2130, 1.4);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0x635bff, 2.2);
    rimLight.position.set(-6, 3, -6);
    scene.add(rimLight);

    // 7. Composite Procedural Models (THREE.Group hierarchy)
    const hubGroup = new THREE.Group();
    hubGroup.position.set(0, 0, 0);
    scene.add(hubGroup);

    // A. Ground Pedestal (Stepped lathed disc)
    const pedestalPoints: THREE.Vector2[] = [];
    pedestalPoints.push(new THREE.Vector2(0, 0));
    pedestalPoints.push(new THREE.Vector2(3.2, 0));
    pedestalPoints.push(new THREE.Vector2(3.15, 0.08));
    pedestalPoints.push(new THREE.Vector2(2.6, 0.12));
    pedestalPoints.push(new THREE.Vector2(2.55, 0.22));
    pedestalPoints.push(new THREE.Vector2(1.8, 0.25));
    pedestalPoints.push(new THREE.Vector2(1.75, 0.35));
    pedestalPoints.push(new THREE.Vector2(0, 0.35));

    const pedestalGeo = new THREE.LatheGeometry(pedestalPoints, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x141a29,
      metalness: 0.85,
      roughness: 0.25
    });
    const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestalMesh.receiveShadow = !isSoftwareGl;
    hubGroup.add(pedestalMesh);

    // B. Soft Radial Contact Shadow Plane
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;
    const shadowPlaneGeo = new THREE.PlaneGeometry(7.5, 7.5);
    const shadowPlaneMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.65
    });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.01;
    hubGroup.add(shadowPlane);

    // C. Central Quantum Processing Core (3-part composite)
    const coreAssembly = new THREE.Group();
    coreAssembly.position.set(0, 1.6, 0);
    hubGroup.add(coreAssembly);

    // Part 1: Outer Glass Faceted Cage
    const outerCoreGeo = new THREE.IcosahedronGeometry(0.9, 1);
    const outerCoreMat = new THREE.MeshPhysicalMaterial({
      color: 0x635bff,
      metalness: 0.1,
      roughness: 0.08,
      transmission: isSoftwareGl ? 0 : 0.85,
      transparent: true,
      opacity: isSoftwareGl ? 0.45 : 0.9,
      ior: 1.52,
      thickness: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    const outerCoreMesh = new THREE.Mesh(outerCoreGeo, outerCoreMat);
    outerCoreMesh.castShadow = !isSoftwareGl;
    coreAssembly.add(outerCoreMesh);

    // Part 2: Inner Pulsing Emissive Core
    const innerCoreGeo = new THREE.OctahedronGeometry(0.5, 0);
    const innerCoreMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x635bff,
      emissiveIntensity: 2.2,
      roughness: 0.3,
      metalness: 0.2
    });
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    coreAssembly.add(innerCoreMesh);

    // Part 3: Gimbal Gyro Ring 1 (Lathed Torus - Gold Titanium)
    const gyroRing1Geo = new THREE.TorusGeometry(1.4, 0.035, 16, 64);
    const gyroRing1Mat = new THREE.MeshStandardMaterial({
      color: 0xe5c07b,
      metalness: 0.95,
      roughness: 0.18
    });
    const gyroRing1 = new THREE.Mesh(gyroRing1Geo, gyroRing1Mat);
    gyroRing1.rotation.x = Math.PI / 4;
    coreAssembly.add(gyroRing1);

    // Part 4: Gimbal Gyro Ring 2 (Dark Brushed Steel)
    const gyroRing2Geo = new THREE.TorusGeometry(1.65, 0.04, 16, 64);
    const gyroRing2Mat = new THREE.MeshStandardMaterial({
      color: 0x5145e5,
      metalness: 0.9,
      roughness: 0.22
    });
    const gyroRing2 = new THREE.Mesh(gyroRing2Geo, gyroRing2Mat);
    gyroRing2.rotation.y = Math.PI / 3;
    coreAssembly.add(gyroRing2);

    // D. Five Channel Satellite Pods with Orbital Conduits
    const channelSatellites: ChannelSatelliteData[] = [
      {
        name: 'WhatsApp Business',
        channel: 'whatsapp',
        color: 0x10b981,
        metric: '94.2% AI Resolution · 842 handled',
        speed: 0.65,
        radius: 2.6,
        angleOffset: 0,
        inclination: 0.18,
        group: new THREE.Group()
      },
      {
        name: 'Instagram DMs',
        channel: 'instagram',
        color: 0xec4899,
        metric: '62% Lead Conversion · 321 inquiries',
        speed: 0.55,
        radius: 3.1,
        angleOffset: (Math.PI * 2) / 5,
        inclination: -0.22,
        group: new THREE.Group()
      },
      {
        name: 'Website Live Chat',
        channel: 'website',
        color: 0x635bff,
        metric: '12s Avg Response · 205 visits',
        speed: 0.72,
        radius: 2.3,
        angleOffset: ((Math.PI * 2) / 5) * 2,
        inclination: 0.35,
        group: new THREE.Group()
      },
      {
        name: 'Email Support',
        channel: 'email',
        color: 0xf59e0b,
        metric: '100% Inbound Parsed · 116 threads',
        speed: 0.48,
        radius: 3.5,
        angleOffset: ((Math.PI * 2) / 5) * 3,
        inclination: -0.15,
        group: new THREE.Group()
      },
      {
        name: 'Shopify & CRM Sync',
        channel: 'shopify',
        color: 0x06b6d4,
        metric: '₹4,82,000 Ops Attributed · Real-time',
        speed: 0.60,
        radius: 2.85,
        angleOffset: ((Math.PI * 2) / 5) * 4,
        inclination: 0.12,
        group: new THREE.Group()
      }
    ];

    // Build each satellite as a 3-part composite model
    channelSatellites.forEach(sat => {
      // 1. Pod Body
      const bodyGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.3, 16);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.9,
        roughness: 0.2
      });
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      sat.group.add(bodyMesh);

      // 2. Glowing Identity Ring
      const ringGeo = new THREE.TorusGeometry(0.24, 0.03, 12, 32);
      const ringMat = new THREE.MeshStandardMaterial({
        color: sat.color,
        emissive: sat.color,
        emissiveIntensity: 1.8,
        metalness: 0.5,
        roughness: 0.2
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      sat.group.add(ringMesh);

      // 3. Sensor Dome
      const domeGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const domeMat = new THREE.MeshStandardMaterial({
        color: sat.color,
        emissive: sat.color,
        emissiveIntensity: 1.2,
        metalness: 0.2,
        roughness: 0.1
      });
      const domeMesh = new THREE.Mesh(domeGeo, domeMat);
      domeMesh.position.y = 0.18;
      sat.group.add(domeMesh);

      // Attach metadata for raycasting
      sat.group.userData = {
        isSatellite: true,
        satelliteData: sat
      };

      hubGroup.add(sat.group);

      // Create glowing orbital trace curve
      const orbitCurve = new THREE.EllipseCurve(
        0,
        0,
        sat.radius,
        sat.radius,
        0,
        2 * Math.PI,
        false,
        0
      );
      const orbitPoints = orbitCurve.getPoints(64).map(p => new THREE.Vector3(p.x, 0, p.y));
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
      const orbitMat = new THREE.LineBasicMaterial({
        color: sat.color,
        transparent: true,
        opacity: 0.22
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      orbitLine.position.y = 1.6;
      orbitLine.rotation.x = sat.inclination;
      hubGroup.add(orbitLine);
    });

    // E. InstancedMesh Data Particles (40 micro-packets streaming around the core)
    const particleCount = 45;
    const particleGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const particleMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.85
    });
    const instancedParticles = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
    instancedParticles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    hubGroup.add(instancedParticles);

    // Particle state tracking
    const particleState = Array.from({ length: particleCount }, (_, idx) => {
      const sat = channelSatellites[idx % channelSatellites.length];
      return {
        sat,
        t: (idx / particleCount) * Math.PI * 2,
        speed: (0.8 + Math.random() * 0.4) * (idx % 2 === 0 ? 1 : -1)
      };
    });

    // 8. Raycaster for Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-1000, -1000);

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleClick = () => {
      if (sceneStateRef.current.hoveredSatellite) {
        const sat = sceneStateRef.current.hoveredSatellite;
        setActiveChannelInfo({
          name: sat.name,
          metric: sat.metric,
          color: '#' + sat.color.toString(16).padStart(6, '0')
        });
      }
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('click', handleClick);

    // 9. Resize Observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 10. Animation Loop with Exponential Damping & Software GL pacing
    let frameId = 0;
    let clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const speed = sceneStateRef.current.speed;

      // Exponential camera damping
      const dampingFactor = 1 - Math.exp(-3.5 * delta);
      camera.position.lerp(_targetCameraPos, dampingFactor);
      _currentLookAt.lerp(_targetLookAt, dampingFactor);
      camera.lookAt(_currentLookAt);

      // Core rotation
      outerCoreMesh.rotation.y += 0.4 * speed * delta;
      outerCoreMesh.rotation.x += 0.2 * speed * delta;
      innerCoreMesh.rotation.y -= 0.8 * speed * delta;
      const pulseScale = 1.0 + Math.sin(elapsed * 3.5) * 0.08;
      innerCoreMesh.scale.set(pulseScale, pulseScale, pulseScale);

      // Gimbal rings
      gyroRing1.rotation.z += 0.6 * speed * delta;
      gyroRing2.rotation.x += 0.45 * speed * delta;

      // Satellites orbiting
      channelSatellites.forEach(sat => {
        const currentAngle = sat.angleOffset + elapsed * sat.speed * speed;
        const x = Math.cos(currentAngle) * sat.radius;
        const z = Math.sin(currentAngle) * sat.radius;
        const y = 1.6 + Math.sin(currentAngle) * Math.sin(sat.inclination) * 0.8;

        sat.group.position.set(x, y, z);
        sat.group.rotation.y = currentAngle + Math.PI / 2;
      });

      // Update instanced particles
      particleState.forEach((p, idx) => {
        p.t += p.speed * speed * delta;
        const x = Math.cos(p.t) * p.sat.radius;
        const z = Math.sin(p.t) * p.sat.radius;
        const y = 1.6 + Math.sin(p.t) * Math.sin(p.sat.inclination) * 0.8;

        _dummyPos.set(x, y, z);
        _dummyScale.set(1, 1, 1);
        _dummyQuat.identity();
        _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
        instancedParticles.setMatrixAt(idx, _dummyMatrix);
      });
      instancedParticles.instanceMatrix.needsUpdate = true;

      // Wireframe mode handling
      const currentWire = sceneStateRef.current.wireframe;
      if (pedestalMat.wireframe !== currentWire) {
        pedestalMat.wireframe = currentWire;
        outerCoreMat.wireframe = currentWire;
        gyroRing1Mat.wireframe = currentWire;
        gyroRing2Mat.wireframe = currentWire;
      }

      // Raycasting for hovered satellite
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(hubGroup.children, true);
      let foundSat: ChannelSatelliteData | null = null;
      for (const hit of intersects) {
        let curr: THREE.Object3D | null = hit.object;
        while (curr && curr !== hubGroup) {
          if (curr.userData?.isSatellite) {
            foundSat = curr.userData.satelliteData;
            break;
          }
          curr = curr.parent;
        }
        if (foundSat) break;
      }

      sceneStateRef.current.hoveredSatellite = foundSat;
      if (container) {
        if (foundSat) {
          container.style.cursor = 'pointer';
        } else {
          container.style.cursor = 'default';
        }
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    if (isSoftwareGl) {
      afterDraw(tick);
    } else {
      frameId = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.removeEventListener('pointermove', handlePointerMove);
        container.removeEventListener('click', handleClick);
      }

      // Resource management
      pedestalGeo.dispose();
      pedestalMat.dispose();
      shadowPlaneGeo.dispose();
      shadowPlaneMat.dispose();
      shadowTex.dispose();
      outerCoreGeo.dispose();
      outerCoreMat.dispose();
      innerCoreGeo.dispose();
      innerCoreMat.dispose();
      gyroRing1Geo.dispose();
      gyroRing1Mat.dispose();
      gyroRing2Geo.dispose();
      gyroRing2Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      instancedParticles.dispose();
      renderer.dispose();
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0A0F1D] text-white select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Top Bar Header strictly following Top Bar Contract (3 zones, single line) */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 lg:px-12 py-5 border-b border-white/10 bg-[#0A0F1D]/80 backdrop-blur-none">
        {/* Zone 1: Single Brand wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#635BFF] flex items-center justify-center font-bold text-white shadow-sm">
            FP
          </div>
          <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
            FlowPilot AI
          </span>
        </div>

        {/* Zone 2: Clean single-line links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => setCameraPreset('orbit')}
            className={`hover:text-white transition-colors whitespace-nowrap ${cameraPreset === 'orbit' ? 'text-white' : ''}`}
          >
            Neural Architecture
          </button>
          <button
            onClick={() => setCameraPreset('core')}
            className={`hover:text-white transition-colors whitespace-nowrap ${cameraPreset === 'core' ? 'text-white' : ''}`}
          >
            Agentic Core
          </button>
          <button
            onClick={() => setCameraPreset('tactical')}
            className={`hover:text-white transition-colors whitespace-nowrap ${cameraPreset === 'tactical' ? 'text-white' : ''}`}
          >
            Channel Streams
          </button>
        </nav>

        {/* Zone 3: Primary Action to launch the SaaS Workspace */}
        <div className="flex items-center gap-3">
          <button
            onClick={onEnterApp}
            className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#635BFF] hover:bg-[#5145E5] rounded-lg transition-colors whitespace-nowrap shadow-lg shadow-[#635BFF]/30 cursor-pointer"
          >
            Launch Operations Console →
          </button>
        </div>
      </header>

      {/* Hero Headline Overlay (Left Flank, clean typography, text-wrap balance, no pill badge sandwich) */}
      <div className="absolute top-28 left-6 lg:left-12 max-w-xl z-10 pointer-events-none">
        <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight text-balance">
          Every Conversation. <br />
          <span className="text-[#818CF8]">One Intelligent Operation.</span>
        </h1>
        <p className="mt-4 text-sm lg:text-base text-slate-300 leading-relaxed font-normal">
          Autonomous AI agents engineered for Indian D2C & e-commerce brands. Automate support,
          qualify wholesale leads, verify couriers, and resolve operations in seconds.
        </p>

        <div className="mt-6 flex items-center gap-4 pointer-events-auto">
          <button
            onClick={onEnterApp}
            className="px-6 py-3 text-sm font-medium text-white bg-[#635BFF] hover:bg-[#5145E5] rounded-lg transition-all shadow-md cursor-pointer"
          >
            Explore Live Dashboard
          </button>
          <button
            onClick={() => setCameraPreset('core')}
            className="px-4 py-3 text-sm font-medium text-slate-200 bg-white/10 hover:bg-white/15 rounded-lg border border-white/15 transition-all cursor-pointer"
          >
            Inspect 3D Core
          </button>
        </div>

        {/* Key proof metrics adjacent to claim */}
        <div className="mt-8 flex items-center gap-6 text-xs text-slate-400">
          <div>
            <div className="text-xl font-bold text-white tabular-nums">68%</div>
            <div className="text-slate-400">Autonomous Resolution</div>
          </div>
          <div className="h-6 w-px bg-white/15" />
          <div>
            <div className="text-xl font-bold text-white tabular-nums">11s</div>
            <div className="text-slate-400">First Response Time</div>
          </div>
          <div className="h-6 w-px bg-white/15" />
          <div>
            <div className="text-xl font-bold text-white tabular-nums">₹4.42</div>
            <div className="text-slate-400">Cost Per Ticket</div>
          </div>
        </div>
      </div>

      {/* Interactive Channel Popover (if clicked/hovered) */}
      {activeChannelInfo && (
        <div className="absolute top-28 right-6 lg:right-12 z-20 w-80 p-5 rounded-xl bg-[#141A29] border border-white/15 text-white shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: activeChannelInfo.color }}
              />
              <span className="font-semibold text-sm">{activeChannelInfo.name}</span>
            </div>
            <button
              onClick={() => setActiveChannelInfo(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-300">{activeChannelInfo.metric}</p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={onEnterApp}
              className="w-full py-2 text-xs font-semibold bg-[#635BFF] hover:bg-[#5145E5] rounded-md transition-colors"
            >
              View in Unified Inbox
            </button>
          </div>
        </div>
      )}

      {/* Collapsible Unified Bottom Control Dock (Strict Three.js Skill Rule: <= 15% viewport height, solid/rgba surfaces) */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-3xl px-4 transition-transform duration-300 ${
          isControlsCollapsed ? 'translate-y-[calc(100%-2.5rem)]' : 'translate-y-0'
        }`}
      >
        <div className="flex justify-center mb-1">
          <button
            onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
            className="px-3 py-1 text-xs font-medium bg-[#141A29] text-slate-300 hover:text-white rounded-t-lg border-t border-x border-white/15 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{isControlsCollapsed ? '▲ Show 3D Dock' : '▼ Collapse Dock (Zen Mode)'}</span>
          </button>
        </div>

        <div className="bg-[#141A29] border border-white/15 rounded-xl px-5 py-3.5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
          {/* Camera View Presets */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">View:</span>
            <div className="flex items-center bg-[#0A0F1D] rounded-lg p-1 border border-white/10">
              <button
                onClick={() => setCameraPreset('orbit')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  cameraPreset === 'orbit'
                    ? 'bg-[#635BFF] text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Orbit
              </button>
              <button
                onClick={() => setCameraPreset('core')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  cameraPreset === 'core'
                    ? 'bg-[#635BFF] text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                AI Core
              </button>
              <button
                onClick={() => setCameraPreset('tactical')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  cameraPreset === 'tactical'
                    ? 'bg-[#635BFF] text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Tactical
              </button>
            </div>
          </div>

          {/* Speed Multiplier */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Stream Speed:</span>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.1"
              value={speedMultiplier}
              onChange={e => setSpeedMultiplier(parseFloat(e.target.value))}
              className="w-24 accent-[#635BFF] cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-300 tabular-nums w-8">
              {speedMultiplier.toFixed(1)}x
            </span>
          </div>

          {/* Wireframe & Software GL indicator */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setWireframeMode(!wireframeMode)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                wireframeMode
                  ? 'bg-white/20 border-white text-white'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              Wireframe: {wireframeMode ? 'ON' : 'OFF'}
            </button>

            {isSoftwareGlDetected && (
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Paced WebGL
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
