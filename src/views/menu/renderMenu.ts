// @ts-ignore
import template from "./menu.html";

import FilterButtons from "./FilterButtons";
import ContentButtons from "./ContentButtons";
import ToolButtons from "../../enum/TOOL_PRESETS";

import renderButtons from "./renderButtons";
import adjustFontSize from "../../tools/adjustFontSize";
import renderTools from "./renderTools";
import reset from "./reset";
import translateWidget from "./translateWidget";

import { ILanguage, LANGUAGES } from "../../i18n/Languages";

import css from "./menu.css";
import enableContrast from "@/tools/enableContrast";
import { pluginConfig } from "@/globals/pluginConfig";
import { userSettings, saveUserSettings } from "@/globals/userSettings";
import { changeLanguage } from "@/i18n/changeLanguage";
import toggleMenu from "./toggleMenu";
import { $widget } from "../widget/widget";

export default function renderMenu() {
    const $container: HTMLElement = document.createElement("div");
    $container.innerHTML = `<style>${css}</style>` + template;

    const $menu = $container.querySelector(".asw-menu");
    if (pluginConfig?.position?.includes("right")) {
        $menu.style.right = '0px';
        $menu.style.left = 'auto';
    }

    // Rimuovo i vecchi blocchi non più presenti
    // $menu.querySelector(".content").innerHTML = renderButtons(ContentButtons);
    // $menu.querySelector(".tools").innerHTML = renderButtons(ToolButtons, 'asw-tools');
    // $menu.querySelector(".contrast").innerHTML = renderButtons(FilterButtons, 'asw-filter');
    // Se vuoi popolare le nuove card, usa querySelector sulle nuove classi
    // Esempio:
    // $menu.querySelector(".asw-items.tools").innerHTML = renderButtons(ToolButtons, 'asw-tools');
    // $menu.querySelector(".asw-items.contrast").innerHTML = renderButtons(FilterButtons, 'asw-filter');

    // Popolo le nuove card con i bottoni
    $menu.querySelector(".asw-items.tools").innerHTML = renderButtons(ToolButtons, 'asw-tools');
    $menu.querySelector(".asw-items.contrast").innerHTML = renderButtons(FilterButtons, 'asw-filter');

    // Utility per tipizzare HTMLElement
    function getHTMLElement(sel: string): HTMLElement | null {
        return $menu.querySelector(sel) as HTMLElement;
    }

    // *** States UI Rendering ***
    interface MenuStates {
        fontSize?: number;
        zoom?: number;
        contrast?: string | boolean;
        [key: string]: any;
    }
    const states: MenuStates = userSettings?.states ?? {};

    const fontSize = Number(states.fontSize) || 1;
    if (fontSize != 1) {
        ($menu.querySelector(".asw-amount") as HTMLElement).innerHTML = `${fontSize * 100}%`;
    }

    if (states) {
        const buttons = Array.from($menu.querySelectorAll('.asw-btn')) as HTMLElement[];

        Object.entries(states).forEach(([key, value]) => {
            if (value && key !== "fontSize") {
                const selector = key === "contrast" ? states[key] : key;
                const btn = buttons.find(b => b.dataset && b.dataset.key === selector);
                if (btn) btn.classList.add("asw-selected");
            }
        });
    }

    // *** Translations ***
    if (!LANGUAGES.some(lang => lang.code === userSettings.lang)) {
        userSettings.lang = "en";
    }
/*
    const $lang = $menu.querySelector("#asw-language");
    const langOptions = LANGUAGES.map((lang: ILanguage) => `<option value="${lang.code}">${lang.label}</option>`).join('');
    $lang.innerHTML = langOptions;
    $lang.value = userSettings.lang;
    $lang.addEventListener("change", (event) => {
        changeLanguage(event.target.value);
    });*/

    // *** Utils ***
    $container.querySelectorAll('.asw-menu-close, .asw-overlay').forEach((el) =>
        el.addEventListener('click', toggleMenu)
    );

    $container.querySelectorAll('.asw-menu-reset').forEach((el) =>
        el.addEventListener('click', reset)
    );

    // *** Controls ***
    $menu.querySelectorAll(".asw-plus, .asw-minus").forEach((el: HTMLElement) => {
        el.addEventListener("click", () => {
            const difference = 0.1;

            let fontSize = states.fontSize || 1;
            if (el.classList.contains('asw-minus')) {
                fontSize -= difference;
            } else {
                fontSize += difference;
            }

            fontSize = Math.max(fontSize, 0.1);
            fontSize = Math.min(fontSize, 2);
            fontSize = Number(fontSize.toFixed(2));

            (document.querySelector(".asw-amount") as HTMLElement).textContent = `${(fontSize * 100).toFixed(0)}%`;

            adjustFontSize(fontSize);
            states.fontSize = fontSize;

            userSettings.states = states;
            saveUserSettings();
        });
    });

    // Zoom page
    $menu.querySelectorAll('.asw-plus[data-key="zoom"], .asw-minus[data-key="zoom"]').forEach((el: HTMLElement) => {
        el.addEventListener('click', () => {
            const difference = 0.1;
            let zoom = states.zoom || 1;
            if (el.classList.contains('asw-minus')) {
                zoom -= difference;
            } else {
                zoom += difference;
            }
            zoom = Math.max(zoom, 0.1);
            zoom = Math.min(zoom, 2);
            zoom = Number(zoom.toFixed(2));
            const zoomAmountEl = getHTMLElement('.asw-zoom-amount');
            if (zoomAmountEl) zoomAmountEl.textContent = `${(zoom * 100).toFixed(0)}%`;
            document.body.style.zoom = String(zoom);
            states.zoom = zoom;
            userSettings.states = states;
            saveUserSettings();
        });
    });

    $menu.querySelectorAll(".asw-btn").forEach((el: HTMLElement) => {
        el.addEventListener("click", () => {
            const key = el.dataset.key;
            const isSelected = !el.classList.contains("asw-selected");
            // --- Contrast ---
            if (el.classList.contains("asw-filter")) {
                $menu.querySelectorAll(".asw-filter").forEach((el: HTMLElement) =>
                    el.classList.remove("asw-selected")
                );
                if (isSelected) {
                    el.classList.add("asw-selected");
                }
                states.contrast = isSelected ? key : false;
                userSettings.states = states;
                enableContrast(states.contrast);
                saveUserSettings();
                return;
            }
            el.classList.toggle("asw-selected", isSelected);
            states[key] = isSelected;
            userSettings.states = states;
            renderTools();
            saveUserSettings();
        });
    });

    // Gestione visibilità card tramite config
    if (!pluginConfig.features?.fontSize) {
        const fontCard = ($menu.querySelector('.asw-adjust-font')?.closest('.asw-card')) as HTMLElement;
        if (fontCard) fontCard.style.display = 'none';
    }
    if (!pluginConfig.features?.zoom) {
        const zoomCard = ($menu.querySelector('.asw-adjust-zoom')?.closest('.asw-card')) as HTMLElement;
        if (zoomCard) zoomCard.style.display = 'none';
    }
    if (!pluginConfig.features?.contrast) {
        const contrastCard = ($menu.querySelector('.asw-items.contrast')?.closest('.asw-card')) as HTMLElement;
        if (contrastCard) contrastCard.style.display = 'none';
    }
    if (!pluginConfig.features?.tools) {
        const toolsCard = ($menu.querySelector('.asw-items.tools')?.closest('.asw-card')) as HTMLElement;
        if (toolsCard) toolsCard.style.display = 'none';
    }

    $widget.appendChild($container);

    return $container;
}
