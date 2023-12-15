
import type { RichText } from "./rich-text"

type Block = { type: 'paragraph', text: RichText } | { type: 'header-1', text: RichText } | { type: 'img', url: 'string' }


export type { Block }
