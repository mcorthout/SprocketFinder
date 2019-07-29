export class WebGLDetect {

    public static isWebGLAvailable = (): boolean => {

		try {
            var canvas = document.createElement('canvas');

            var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

            if (gl && gl instanceof WebGLRenderingContext) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (e) {
			return false;
		}
	}
	
}