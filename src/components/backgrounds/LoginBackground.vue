<template>
    <div class="bg-container">

    </div>
    <div class="bg-container-mobile">

    </div>
</template>

<style scoped lang="scss">
.bg-container {
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: -99;
    overflow: hidden;
}

.bg-container::before {
    content: "";
    width: 120vw;
    height: 120vw;
    background-image: url('@/assets/backgrounds/shape1.svg');
    background-repeat: no-repeat;
    position: absolute;
    background-position: right 60vw  top -30vw;
}

.bg-container::after {
    content: "";
    width: 100vw;
    height: 30vw;
    background-image: url('@/assets/backgrounds/shape2.svg');
    background-repeat: no-repeat;
    position: absolute;

    background-position: left 80vw top -8vw;
}

@media only screen and (max-width: 770px) {

    .bg-container::before {
        display: none;
    }

    .bg-container-mobile {
        position: absolute;
        height: 100%;
        width: 100vw;
        z-index: -99;
        overflow: hidden;
    }

    .bg-container-mobile::after {
        content: "";
        width: 100vw;
        height: 100vw;  
        background-image: url('@/assets/backgrounds/shape2.svg');
        background-repeat: no-repeat;
        position: absolute;
        bottom: 00vw;
        transform: rotate(-150deg) translatey(-80px);
        background-position: right -20vw top -20vw;
    }
    .bg-container::after {
        height: 100%;
        background-position: right -50vw top -10vw;
    }
}


</style>