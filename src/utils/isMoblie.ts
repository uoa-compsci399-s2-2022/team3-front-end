export function isMobile() {
    return ('ontouchstart' in document.documentElement) || window.innerWidth <= 540;
}
