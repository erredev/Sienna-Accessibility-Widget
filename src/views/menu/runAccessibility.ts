import { 
    userSettings
} from '@/globals/userSettings';

import adjustFontSize from "@/tools/adjustFontSize";
import renderTools from "./renderTools";
import enableContrast from '@/tools/enableContrast';

interface MenuStates {
    fontSize?: number;
    zoom?: number;
    contrast?: string | boolean;
    [key: string]: any;
}

export default function runAccessibility() {
    const states: MenuStates = userSettings?.states ?? {};
    adjustFontSize(states.fontSize);
    renderTools();
    enableContrast(states.contrast);
}
