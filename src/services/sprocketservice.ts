import axios from "axios";
import { ISprocket, IRearSprocketInfo, IFrontSprocketInfo, ISprocketBike } from "../models";

export class SprocketService {

    public static GetRearPitches(done: (pitches: number[]) => void): void {
        SprocketService.Get<number[]>(`${SprocketService.baseUrl}/rear`, done, []);
    }

    public static GetRearDiameters(pitch: number, done: (diameters: number[]) => void): void {
        SprocketService.Get<number[]>(`${SprocketService.baseUrl}/rear/${pitch}`, done, []);
    }

    public static GetRearBoltPitchDiameters(pitch: number, id: number, done: (diameters: number[]) => void): void {
        SprocketService.Get<number[]>(`${SprocketService.baseUrl}/rear/${pitch}/${id}/`, done, []);
    }

    public static GetRearBoltQuantities(pitch: number, id: number, pcd: number, done: (quantities: number[]) => void): void {
        SprocketService.Get<number[]>(`${SprocketService.baseUrl}/rear/${pitch}/${id}/${pcd}/`, done, []);
    }

    public static GetRearDrawings(pitch: number, id: number, pcd: number, fhn: number, done: (drawings: string[]) => void): void {
        SprocketService.Get<string[]>(`${SprocketService.baseUrl}/rear/${pitch}/${id}/${pcd}/${fhn}/`, done, []);
    }

    public static GetParts(drawing: string, language: string, done: (parts: ISprocket[]) => void): void {
        const d = encodeURIComponent(drawing);
        SprocketService.Get<ISprocket[]>(`${SprocketService.baseUrl}/parts?drawing=${d}&language=${language}/`, done, []);
    }

    public static GetRearInfo(item: string, language: string, done: (infos: IRearSprocketInfo[]) => void): void {
        const p = encodeURIComponent(item);
        SprocketService.Get<IRearSprocketInfo[]>(`${SprocketService.baseUrl}/rear/info?part=${p}&language=${language}/`, done, []);
    }

    public static GetReverse(item: string, done: (bikes: ISprocketBike[]) => void): void {
        const p = encodeURIComponent(item);
        SprocketService.Get<ISprocketBike[]>(`${SprocketService.baseUrl}/reverse?part=${p}`, done, []);
    }

    public static GetFrontShapes(pitch: number, done: (shapes: number[]) => void): void {
        SprocketService.Get<number[]>(`${SprocketService.baseUrl}/front/${pitch}`, done, []);
    }

    public static GetFrontTotalThicknesses(pitch: number, shape: number, done: (thicknesses: number[]) => void): void {
        SprocketService.Get<number[]>(`${SprocketService.baseUrl}/front/${pitch}/${shape}`, done, []);
    }

    public static GetFrontGrooves(pitch: number, shape: number, thickness: number, done: (grooves: number[]) => void): void {
        SprocketService.Get<number[]>(`${SprocketService.baseUrl}/front/${pitch}/${shape}/${thickness}/`, done, []);
    }

    public static GetFrontDrawings(pitch: number, shape: number, thickness: number, grooves: number, done: (drawings: string[]) => void): void {
        SprocketService.Get<string[]>(`${SprocketService.baseUrl}/front/${pitch}/${shape}/${thickness}/${grooves}/`, done, []);
    }

    public static GetFrontInfo(item: string, language: string, done: (infos: IFrontSprocketInfo[]) => void): void {
        const p = encodeURIComponent(item);
        SprocketService.Get<IRearSprocketInfo[]>(`${SprocketService.baseUrl}/front/info?part=${p}&language=${language}/`, done, []);
    }

    private static baseUrl: string = "https://service.afam.com/api/sprockets";

    private static Get<T>(URL: string, done: (values: T) => void, errorValue: T): void {
        axios
            .get(URL)
            .then((response) => {
                done(response.data);
            })
            .catch((error) => done(errorValue));
    }

}
