import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { DCScene3D } from "./dcscene3d";

export class DcObject3D {

    private stlPath: string = 'https://service.afam.com/webshop/images/sprockets/3d/';
    private texturePath: string = 'https://service.afam.com/webshop/images/sprockets/3d/textures/';
    private objectFilename: string = "";
    private objectColor: string = "";
    private stlFile: string = "";
    private scene: DCScene3D = {} as DCScene3D;
    private mesh: THREE.Mesh;
    private material: THREE.Material;
    private loader: STLLoader;
    private zincTexture: THREE.Texture;
    private steelTexture: THREE.Texture;
    private nextObjects: DcObject3D[] = [];
    private radius: number = 0;

    constructor(parent: DCScene3D, fileName: string, objectColor: string) {
        this.scene = parent;
        this.objectFilename = fileName;
        this.objectColor = objectColor;
        this.loader = new STLLoader();

        if (objectColor === 'zinc') {
            // Texture for galvanized appearance
            this.zincTexture = new THREE.TextureLoader().load(this.texturePath + "zinc.png");
            this.zincTexture.wrapS = THREE.RepeatWrapping;
            this.zincTexture.wrapT = THREE.RepeatWrapping;
            this.zincTexture.repeat.set(0.025, 0.025);
        }
        else if (objectColor === 'steel') {
            // Texture for galvanized appearance
            this.steelTexture = new THREE.TextureLoader().load(this.texturePath + "steel.png");
            this.steelTexture.wrapS = THREE.RepeatWrapping;
            this.steelTexture.wrapT = THREE.RepeatWrapping;
            this.steelTexture.repeat.set(0.1, 0.1);
        }
    }

    get Radius(): number {
        return this.radius;
    }

    public SetStlPath(path: string) {
        this.stlPath = path;
    }

    public SetTexturePath(path: string) {
        this.texturePath = path;
    }

    public Show(objects: DcObject3D[]) {

        this.nextObjects = objects;

        this.scene.ExtraLights(false); 

        if (this.mesh) {
            this.scene.RemoveMesh(this.mesh);
            this.scene.Render();
        }

        if (this.material) {
            this.material.dispose();
        }

        switch (this.objectColor) {
            case 'black':
                this.material = new THREE.MeshStandardMaterial({
                    color: 0x050505,
                    metalness: 0.5,
                    roughness: 0.5,
                    //shading: THREE.SmoothShading
                });
                this.scene.ExtraLights(true); 
                break;
            case 'steel':
                this.material = new THREE.MeshPhysicalMaterial({
                    color: 0x202024,
                    reflectivity: 0.0,
                    metalness: 1.0,
                    roughness: 0.45,
                    clearCoat: 0.1,
                    clearCoatRoughness: 1.0,
                    bumpMap: this.steelTexture,
                    bumpScale: 0.01
                });
                break;
            case 'blue':
                this.material = new THREE.MeshStandardMaterial({
                    color: 0x000235,
                    metalness: 1.0,
                    roughness: 0.175,
                    //shading: THREE.SmoothShading
                });
                this.scene.ExtraLights(true); 
                break;
            case 'orange':
                this.material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color().setHSL(0.05, 1.0, 0.3).getHex(),
                    metalness: 1.0,
                    roughness: 0.175,
                    //shading: THREE.SmoothShading
                });
                this.scene.ExtraLights(true); 
                break;
            case 'yellow':
                this.material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color().setHSL(0.14, 1.0, 0.2).getHex(),
                    metalness: 1.0,
                    roughness: 0.175,
                    //shading: THREE.SmoothShading
                });
                this.scene.ExtraLights(true); 
                break;
            case 'red':
                this.material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color().setHSL(1.0, 0.9, 0.3).getHex(),
                    metalness: 1.0,
                    roughness: 0.175,
                    //shading: THREE.SmoothShading
                });
                this.scene.ExtraLights(true); 
                break;
            case 'zinc':
                this.material = new THREE.MeshPhongMaterial({
                    color: 0x040404,
                    specular: 0x777777,
                    shininess: 40,
                    bumpMap: this.zincTexture,
                    bumpScale: 0.1
                });
                break;
            case 'silver':
                this.material = new THREE.MeshPhongMaterial({
                    color: 0x040404,
                    specular: 0x777777,
                    shininess: 40
                });
                break;
            case 'grey':
                this.material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color().setHSL(0.5, 0.0, 0.15).getHex(),
                    metalness: 1.0,
                    roughness: 0.5,
                    //shading: THREE.SmoothShading
                });
                break;
            case 'gunmetal':
                this.material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color().setHSL(0.08, 0.2, 0.1).getHex(),
                    metalness: 1.0,
                    roughness: 0.5,
                    //shading: THREE.SmoothShading
                });
                break;
            case 'rubber':
                this.material = new THREE.MeshPhongMaterial({
                    color: 0x020202,
                    specular: 0x010101,
                    shininess: 50
                });
                break;
            default:
                this.material = new THREE.MeshPhongMaterial({ color: 0x010101, specular: 0x111111, shininess: 100 });
        }

        this.scene.ShowProgressBar();
        this.stlFile = this.stlPath + this.objectFilename + '.stl';         
        this.loader.load(this.stlFile, this.Load, this.scene.onProgress);
    }

    private Load = (geometry: THREE.BufferGeometry) => {
        if (this.objectColor == 'zinc' || this.objectColor == 'steel') {
            var geometry2 = new THREE.Geometry().fromBufferGeometry(geometry);
            this.assignUVs(geometry2);
            this.mesh = new THREE.Mesh(geometry2, this.material);
        }
        else {
            this.mesh = new THREE.Mesh(geometry, this.material);
        }

        this.mesh.name = "sprocketMesh";
        this.mesh.position.set(0, 0, 0);
        this.mesh.rotation.set(0, 0, 0);
        this.mesh.scale.set(1, 1, 1);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.scene.AddMesh(this.mesh);

        this.mesh.geometry.computeBoundingSphere();
        this.radius = this.mesh.geometry.boundingSphere.radius;

        this.scene.HideProgressBar();
        this.scene.Render();

        if (this.nextObjects[0]) {
            this.nextObjects[0].Show(this.nextObjects.slice(1));
        }
        else {
            this.scene.FitCamera();
            this.scene.Render();
            if (this.scene.ShouldSave())
                this.scene.SaveCallback(this.scene);
        }
    }

    public Unload() {
        if (this.mesh) {
            this.mesh.geometry.dispose();
            this.scene.RemoveMesh(this.mesh);
            this.mesh = {} as THREE.Mesh;
        }

        if (this.material) {
            this.material.dispose();
        }

        if (this.zincTexture) {
            this.zincTexture.dispose();
        }

        if (this.steelTexture) {
            this.steelTexture.dispose();
        }

        this.objectFilename = "";
        this.objectColor = "";
        this.stlFile = "";
        this.scene = {} as DCScene3D;
        this.mesh = {} as THREE.Mesh;
        this.material = {} as THREE.Material;
        this.loader = {} as STLLoader;
        this.zincTexture = {} as THREE.Texture;
        this.steelTexture = {} as THREE.Texture;
        this.nextObjects = [];
        this.radius = 0;
    }

    private assignUVs = function (geometry) {

        geometry.faceVertexUvs[0] = [];

        geometry.faces.forEach(function (face) {

            var components = ['x', 'y', 'z'].sort(function (a, b) {
                return Math.abs(face.normal[a]) - Math.abs(face.normal[b]);
            });

            var v1 = geometry.vertices[face.a];
            var v2 = geometry.vertices[face.b];
            var v3 = geometry.vertices[face.c];

            geometry.faceVertexUvs[0].push([
                new THREE.Vector2(v1[components[0]], v1[components[1]]),
                new THREE.Vector2(v2[components[0]], v2[components[1]]),
                new THREE.Vector2(v3[components[0]], v3[components[1]])
            ]);

        });

        geometry.uvsNeedUpdate = true;
    }

}