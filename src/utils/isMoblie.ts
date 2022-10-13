export function isMobile() {
    return ('ontouchstart' in document.documentElement) || window.innerWidth <= 540;
}


export function isMobile768() {
    return ('ontouchstart' in document.documentElement) || window.innerWidth <= 768;
}
