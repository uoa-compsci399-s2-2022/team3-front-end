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
    width: 200%;
    height: 200%;
    background-image: url('@/assets/backgrounds/shape1.svg');
    background-repeat: no-repeat;
    position: absolute;
    background-position: right 2000px top -450px;
}

@media only screen and (max-width: 600px) {
    .bg-container {
        //display: none;
    }

    .bg-container::before {
        display: none;
    }

    .bg-container-mobile {
        position: absolute;
        height: 100%;
        width: 100%;
        z-index: -99;
        overflow: hidden;
    }

    .bg-container-mobile::after {
        content: "";
        width: 100%;
        height: 100%;
        background-image: url('@/assets/backgrounds/shape2.svg');
        background-repeat: no-repeat;
        position: absolute;
        transform: rotate(-160deg) translatey(-80px);
        background-position: right -400px top -20px;
    }
}

.bg-container::after {
    content: "";
    width: 100%;
    height: 50%;
    background-image: url('@/assets/backgrounds/shape2.svg');
    background-repeat: no-repeat;
    position: absolute;

    background-position: left 1160px top -150px;
}
</style>