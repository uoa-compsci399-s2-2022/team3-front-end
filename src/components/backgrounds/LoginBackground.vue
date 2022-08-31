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
    width: 12rem;
    height: 12rem;
    background-image: url('@/assets/backgrounds/shape1.svg');
    background-repeat: no-repeat;
    position: absolute;
    background-position: right 6rem  top -3rem;
}

.bg-container::after {
    content: "";
    width: 10rem;
    height: 3rem;
    background-image: url('@/assets/backgrounds/shape2.svg');
    background-repeat: no-repeat;
    position: absolute;

    background-position: left 8rem top -0.8rem;
}

@media only screen and (max-width: 770px) {
    .bg-container {
        //display: none;
    }

    .bg-container::before {
        display: none;
    }

    .bg-container-mobile {
        position: absolute;
        height: 100%;
        width: 10rem;
        z-index: -99;
        overflow: hidden;
    }

    .bg-container-mobile::after {
        content: "";
        width: 10rem;
        height: 10rem;  
        background-image: url('@/assets/backgrounds/shape2.svg');
        background-repeat: no-repeat;
        position: absolute;
        bottom: 0rem;
        transform: rotate(-150deg) translatey(-80px);
        background-position: right -2rem top -2rem;
    }
    .bg-container::after {
        height: 100%;
        background-position: right -5rem top -1rem;
    }
}


</style>