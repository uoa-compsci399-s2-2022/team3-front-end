<script lang="ts" setup>

import { ref, watch } from 'vue'
const props = defineProps<{
    data: string;
}>()
watch(() => props.data,
    (v, _) => {
        data.value = v;
    }
)
const data = ref("")
</script>
<template>
    <iframe :src="data" frameborder="0" class="pdf"></iframe>
</template>


<style scoped lang="scss">
.pdf {
    width: 40vw;
    height: 60vh
}

@media only screen and (max-width: 1360px) {
    .pdf {
        width: 80vw;
        height: 60vw
    }
}
</style>
