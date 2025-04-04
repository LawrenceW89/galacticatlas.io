import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface Star {
  name: string;
  x: number;
  y: number;
  z: number;
  color: string;
  size: number;
}

@Component({
  selector: 'app-star-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-map.component.html',
  styleUrls: ['./star-map.component.scss']
})
export class StarMapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('rendererContainer') rendererContainer!: ElementRef;
  
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private animationFrameId = 0;
  
  // Star data - Sol and a few nearby stars
  private stars: Star[] = [
    { name: 'Sol', x: 0, y: 0, z: 0, color: '#FFFF00', size: 1 },
    { name: 'Proxima Centauri', x: 1.3, y: 0.9, z: 0.4, color: '#FF6666', size: 0.3 },
    { name: 'Alpha Centauri A', x: 1.3, y: 1.1, z: 0.5, color: '#FFDD66', size: 0.9 },
    { name: 'Alpha Centauri B', x: 1.3, y: 1.05, z: 0.55, color: '#FFBB66', size: 0.7 },
    { name: 'Barnard\'s Star', x: -1.5, y: 1.2, z: -0.2, color: '#FF4444', size: 0.2 },
    { name: 'Sirius', x: -2.6, y: -0.6, z: -1.8, color: '#AAAAFF', size: 1.1 }
  ];

  constructor() { }

  ngAfterViewInit() {
    this.initThree();
    this.createStars();
    this.animate();
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.disposeThreeJS();
  }

  private initThree() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000005);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    this.camera.position.z = 5;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    // Add coordinate grid for reference
    const gridHelper = new THREE.GridHelper(10, 10, 0x555555, 0x222222);
    this.scene.add(gridHelper);

    // Handle window resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  private createStars() {
    // Add stars to the scene
    this.stars.forEach(star => {
      // Create the main star sphere
      const geometry = new THREE.SphereGeometry(star.size / 4, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: star.color });
      const starMesh = new THREE.Mesh(geometry, material);
      starMesh.position.set(star.x, star.y, star.z);
      this.scene.add(starMesh);
      
      // Add star name label with better positioning
      const textSprite = this.createTextSprite(star.name);
      
      // Position labels above stars with offset based on star size
      const labelOffset = Math.max(star.size / 2, 0.2) + 0.1;
      textSprite.position.set(star.x, star.y + labelOffset, star.z);
      
      // Scale label based on star importance/size
      const labelScale = 0.5 + (star.size * 0.2);
      textSprite.scale.set(labelScale, labelScale / 2, 1);
      
      this.scene.add(textSprite);
    });
  }

  private createTextSprite(text: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 128;
    
    if (context) {
      // Make background transparent (clear the canvas)
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Better font styling
      context.font = 'bold 20px Arial, sans-serif';
      context.textAlign = 'center';
      
      // Text with glow effect for better visibility
      context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      context.lineWidth = 3;
      context.strokeText(text, canvas.width / 2, canvas.height / 2);
      
      context.fillStyle = '#ffffff';
      context.fillText(text, canvas.width / 2, canvas.height / 2);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    // Set transparent background for the sprite material
    const material = new THREE.SpriteMaterial({ 
      map: texture,
      transparent: true
    });
    
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(1, 0.5, 1);
    
    return sprite;
  }

  private animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private disposeThreeJS() {
    // Clean up Three.js resources
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    // Note: THREE.Scene doesn't have a dispose method
    // We need to manually dispose of geometries, materials, and textures if needed
  }
} 