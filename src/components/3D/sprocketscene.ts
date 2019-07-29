import { DCScene3D } from "./dcscene3d";
import { DcObject3D } from "./dcobject3d";

export class SprocketScene {
    private scene: DCScene3D;
    private sprocket: DcObject3D;
    private gummi: DcObject3D;

    constructor(container: string, progressContainer: string, progressBar: string, progressCore: string, webglWarning: string, s3dInstructions: string) {
        this.scene = new DCScene3D(container, progressContainer, progressBar, progressCore, webglWarning, s3dInstructions);
    }

    public Show(file: string, color: string, rubber: string)
    {            
        this.sprocket = new DcObject3D(this.scene, file, color);
        this.scene.addObject(this.sprocket);

        if (rubber) {
            this.gummi = new DcObject3D(this.scene, rubber, 'rubber');
            this.scene.addObject(this.gummi);
        }

        this.scene.show3D();    
    } 

    public Unload() {
        this.scene.Unload();
        this.scene = {} as DCScene3D;
    }
}