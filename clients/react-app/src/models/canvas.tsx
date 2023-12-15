

import { Feature, Geometry, Point } from 'geojson';









enum Z {
    Zero = 0, // 00000000
    One = 1 << 0, // 00000001
    Two = 1 << 1, // 00000010
    Three = 1 << 2, // 00000100
    Four = 1 << 3, // 00001000
    Five = 1 << 4, // 00010000
    Six = 1 << 5, // 00100000
    Seven = 1 << 6, // 01000000
    Eight = 1 << 7, // 10000000
}



type Style = {
    fill: Color,
    stroke: Color,
}


type FeatureMetadata = {
    style: Style,
    zIndex: Z
    //this is useful for determing where a label should point to when are feature geo
    //is a polyline etc.
    centre: Point
}

type FeatureType<T extends Feature<Geometry, FeatureMetadata>['geometry']['type']> = T




const render = (feature: Feature<Geometry, FeatureMetadata>) => {
    switch (feature.geometry.type) {
        case 'LineString':
        case 'Point':
    }
}



type XYWH = {
    x: number;
    y: number;
    width: number;
    height: number;
};



enum Side {
    Top = 1,
    Bottom = 2,
    Left = 4,
    Right = 8,
}


enum EditMode {
    /**
     * Default canvas mode. Nothing is happening.
     */
    None = 'None',
    /**
     * When the user's pointer is pressed
     */
    Pressing = 'Pressing',
    /**
     * When the user is selecting multiple layers at once
     */
    SelectionNet = 'SelectionNet',
    /**
     * When the user is moving layers
     */
    Translating = 'Translating',
    /**
     * When the user is going to insert a Rectangle or an Ellipse
     */
    Inserting = 'Inserting',
    /**
     * When the user is resizing a layer
     */
    Resizing = 'Resizing',
    /**
     * When the pencil is activated
     */
    Pencil = 'Pencil',
}





type EditState =
    | {
        kind: 'edit',
        mode: EditMode.None;
    }
    | {
        kind: 'edit',
        mode: EditMode.SelectionNet;
        origin: Point;
        current?: Point;
    }
    | {
        kind: 'edit',
        mode: EditMode.Translating;
        current: Point;
    }
    | {
        kind: 'edit',
        mode: EditMode.Inserting;
        layerType: FeatureType<'Polygon'> | FeatureType<'Point'>
    }
    | {
        kind: 'edit',
        mode: EditMode.Pencil;
    }
    | {
        kind: 'edit',
        mode: EditMode.Pressing;
        origin: Point;
    }
    | {
        kind: 'edit',
        mode: EditMode.Resizing;
        initialBounds: XYWH;
        corner: Side;
    };


enum ViewMode {
    None
}

type ViewState = {
    kind: 'view',
    mode: ViewMode.None
}

type AppState = EditState | ViewState;

type Color = {
    r: number;
    g: number;
    b: number;
};



export { EditMode, Side, ViewMode };
export type { AppState, EditState, FeatureType, Style, ViewState, XYWH };

