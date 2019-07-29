import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DcObject3D } from "./dcobject3d";
import { WebGLDetect } from "./webgldetect";

export class DCScene3D {
    private camera: THREE.PerspectiveCamera;
    private cameraTarget: THREE.Vector3;
    private scene: THREE.Scene;
    public renderer: THREE.WebGLRenderer;
    private cameraControls: OrbitControls;
    private ready: boolean = false;    
    private host: HTMLElement | null = null;
    private warning: HTMLElement | null = null;
    private progressBar: HTMLElement | null = null;
    private progressContainer: HTMLElement | null = null;
    private progressCore: HTMLElement | null = null;
    private instructions: HTMLElement | null = null;
    private frontLight: THREE.Light;
    private rearLight: THREE.Light;
    private objects: DcObject3D[] = [];
    private forSaving: boolean = false;


    constructor(containerId: string, progressContainerId: string, progressBarId: string, progressCoreId: string, warningId: string, instructionsId: string, forSaving: boolean = false) {
      
        // Page elements
        this.host = document.getElementById(containerId);

        if (this.host) {
            this.host.style.display = 'block';
            while (this.host.firstChild) {
                this.host.removeChild(this.host.firstChild);
            }
        }
        else {
            return;
        }

        if (progressBarId) {
            this.progressBar = document.getElementById(progressBarId);
            if (this.progressBar) this.progressBar.style.display = 'none';
        }

        if (progressContainerId) {
            this.progressContainer = document.getElementById(progressContainerId);
            if (this.progressContainer) this.progressContainer.style.display = 'none';
        }

        if (progressCoreId) {
            this.progressCore = document.getElementById(progressCoreId);
            if (this.progressCore) this.progressCore.style.display = 'none';
        }

        if (warningId) {
            this.warning = document.getElementById(warningId);
            if (this.warning) this.warning.style.display = 'none';
        }

        if (instructionsId) {
            this.instructions = document.getElementById(instructionsId);
            if (this.instructions) this.instructions.style.display = 'none';
        }

        // Check WebGL support
        if (!WebGLDetect.isWebGLAvailable()) {
            if (this.warning) this.warning.style.display = 'block';
            if (this.progressBar) this.progressBar.style.display = 'none';
            this.host.style.display = 'none';
            if (this.instructions) this.instructions.style.display = 'none';
            return;
        }

        if (forSaving) {
            this.forSaving = forSaving;
        }
        else {
            this.forSaving = false;
        }

        // Camera        
        this.camera = new THREE.PerspectiveCamera(35, this.host.clientWidth / this.host.clientHeight, 1, 8000);
        this.camera.position.set(300, 0, 300);

        this.cameraTarget = new THREE.Vector3(0, 0, 0);
        this.scene = new THREE.Scene();

        // Lights
        this.scene.add(new THREE.AmbientLight(0x222222));

        for (var x = -1; x <= 1; x += 2) {
            for (var y = -1; y <= 1; y++) {
                for (var z = -1; z <= 1; z += 2) {
                    var light = new THREE.DirectionalLight(0xffffff, 0.45);
                    light.position.set(300 * x, 300 * y, 300 * z).normalize();
                    this.scene.add(light);
                }
            }
        }

        this.frontLight = new THREE.DirectionalLight(0xffffff, 0);
        this.frontLight.position.set(300, 0, 0).normalize();
        this.scene.add(this.frontLight);

        this.rearLight = new THREE.DirectionalLight(0xffffff, 0);
        this.rearLight.position.set(-300, 0, 0).normalize();
        this.scene.add(this.rearLight);       

        // Renderer
        if (!this.forSaving)
            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        else
            this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });
        this.renderer.setClearColor(0xFFFFFF, 0);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.host.clientWidth, this.host.clientHeight);
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        this.host.appendChild(this.renderer.domElement);

        //cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
        this.cameraControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.cameraControls.target.set(0, 0, 0);
        this.cameraControls.addEventListener('change', () => {
            this.ReRender(this);
        });
        
        this.objects = [];

        this.ready = true;
    }
   
    public ShouldSave() {
        return this.forSaving;
    }

    public Unload() {
        for (let obj of this.objects) {
            obj.Unload();
            obj = {} as DcObject3D;
        }

        if (this.renderer) this.renderer.dispose();
        if (this.cameraControls) this.cameraControls.dispose();

        this.camera = {} as THREE.PerspectiveCamera;
        this.cameraTarget = {} as THREE.Vector3;
        this.scene = {} as THREE.Scene;
        this.renderer = {} as THREE.WebGLRenderer;
        this.cameraControls = {} as OrbitControls;
        this.host = null;
        this.warning = null;
        this.progressBar = null;
        this.progressContainer = null;
        this.progressCore = null;
        this.instructions = null;
        this.frontLight = {} as THREE.Light;
        this.rearLight = {} as THREE.Light;
        this.objects = [];
    }

    public addObject(d3_object: DcObject3D) {
        this.objects.push(d3_object);
    }

    public show3D() {
        if (this.objects[0]) {
            this.objects[0].Show(this.objects.slice(1));
        }
    }

    public ExtraLights(on: boolean) {
        if (on) {
            if (this.frontLight) this.frontLight.intensity = 0.75;
            if (this.rearLight) this.rearLight.intensity = 0.75;
        }
        else {
            if (this.frontLight) this.frontLight.intensity = 0;
            if (this.rearLight) this.rearLight.intensity = 0;
        }
    }

    public AddMesh(mesh: THREE.Mesh) {
        this.scene.add(mesh);
    }

    public RemoveMesh(mesh: THREE.Mesh) {
        this.scene.remove(mesh);
    }

    public ShowProgressBar() {
        if (this.progressBar && this.progressContainer && this.progressCore && this.host && this.instructions) {
            this.progressBar.style.display = 'inline-block';
            this.progressContainer.style.display = 'block';
            this.progressCore.style.display = 'block';
            this.host.style.display = 'none';
            this.instructions.style.display = 'none';
        }
    }

    public HideProgressBar() {
        if (this.progressBar && this.progressContainer && this.progressCore && this.host && this.instructions) {
            this.progressBar.style.display = 'none';
            this.progressContainer.style.display = 'none';
            this.progressCore.style.display = 'none';
            this.host.style.display = 'block';
            this.instructions.style.display = 'block';
        }
    }

    public onProgress = (xhr) => {
        if (xhr.lengthComputable) {
            if (this.progressBar && this.progressCore) {
                this.progressCore.style.width = (xhr.loaded / xhr.total * 100) + '%';
            }
        }
    }

    public Render() {
        this.renderer.render(this.scene, this.camera);
    }

    public ReRender(that: DCScene3D) {
        that.renderer.render(that.scene, that.camera);
    }

    public FitCamera() {
        if (this.objects[0]) {
            var ratio = this.objects[0].Radius / 125;
            this.camera.position.set(350 * ratio, 0, 350 * ratio);
        }
    }

    public SaveCallback(that: DCScene3D) {
    }

}