<script setup lang="ts">
import { ref, onMounted } from 'vue'
let speed = ref<number>(1);
let bar = ref<HTMLElement>();
let timer = ref<number>(0)
const startLoading = () => {
    let dom = bar.value!;
    speed.value = 1;
    dom.style.display = "block"
    timer.value = window.requestAnimationFrame(function fn() {
        if (speed.value < 90) {
            speed.value++;
            dom.style.width = speed.value + '%'
            timer.value = window.requestAnimationFrame(fn)
        } else {
            speed.value = 1;
            window.cancelAnimationFrame(timer.value)
        }
    })
}

const endLoading = () => {
    let dom = bar.value!
    setTimeout(() => {
        window.requestAnimationFrame(() => {
            speed.value = 100;
            dom.style.width = speed.value + '%'
        })
    }, 500)
    setTimeout(() => {
        dom.style.display = "none";
    }, 1000)

}


defineExpose({
    startLoading,
    endLoading
})
</script>

<template>
    <div class="wrapper">
        <div class="loading-bar" ref="bar"></div>
    </div>
</template>

<style lang="scss">
.wrapper {
    position: fixed;
    top: 0;
    width: 100%;
    height: 2px;
    .loading-bar {
        height: inherit;
        width: 0;
        background-color: $uoa-primary;
    }
}
</style>