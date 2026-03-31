import { TEXT_SELECTORS } from "./Selectors";
import IToolConfig from "../types/IToolConfig";

export interface IFilters {
    [key: string]: IToolConfig
}

export const FILTERS: IFilters = {
    'dark-contrast': {
        styles: {
            'color': '#FFF',
            'fill': '#FFF',
            'background-color': '#000'
        },
        childrenSelector: TEXT_SELECTORS,
        css: [
            'html.aws-filter svg[fill="none"] { fill: none !important; }',
            'html.aws-filter svg [fill]:not([fill="none"]):not([fill=""]) { fill: #FFF !important; }',
            'html.aws-filter svg[stroke]:not([stroke="none"]):not([stroke=""]) { stroke: #FFF !important; }',
            'html.aws-filter svg [stroke]:not([stroke="none"]):not([stroke=""]) { stroke: #FFF !important; }',
        ].join(' ')
    },
    'light-contrast': {
        styles: {
            'color': '#000',
            'fill': '#000',
            'background-color': '#FFF'
        },
        childrenSelector: TEXT_SELECTORS,
        css: [
            'html.aws-filter svg[fill="none"] { fill: none !important; }',
            'html.aws-filter svg [fill]:not([fill="none"]):not([fill=""]) { fill: #000 !important; }',
            'html.aws-filter svg[stroke]:not([stroke="none"]):not([stroke=""]) { stroke: #000 !important; }',
            'html.aws-filter svg [stroke]:not([stroke="none"]):not([stroke=""]) { stroke: #000 !important; }',
        ].join(' ')
    },
    'high-contrast': {
        styles: {
            'filter': 'contrast(125%)'
        }
    },
    'high-saturation': {
        styles: {
            'filter': 'saturate(200%)'
        }
    },
    'low-saturation': {
        styles: {
            'filter': 'saturate(50%)'
        }
    },
    'monochrome': {
        styles: {
            'filter': 'grayscale(100%)'
        }
    }
}

export default FILTERS