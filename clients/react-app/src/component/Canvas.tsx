import { CanvasMode, type CanvasState } from "@/types";
import { useState } from "react";



const Canvas = () => {


    const [canvasState, setState] = useState<CanvasState>({
        mode: CanvasMode.None,
    });


}