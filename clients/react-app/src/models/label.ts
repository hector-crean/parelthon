type TextLabel = { tag: "text_label"; text: string };

type Label = TextLabel  & { width: number, height: number, top: number, left: number};




export type { Label, TextLabel };

