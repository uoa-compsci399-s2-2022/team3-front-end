import { computed } from 'vue';
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePermissionStore = defineStore('permission', () => {
    const keys = sessionStorage.getItem('mtms_keys');
    const key = ref(keys ? new Set<string>(JSON.parse(keys)) : new Set<string>([]));

    type identityGroups = 'student' | 'courseCoordinator' |  'tutorCoordinator' | 'markerCoodinator' | 'admin'

    const defaultList = ref<{[K in identityGroups] : Set<string>}>({
        student: new Set(['1', '2', '3']),
        courseCoordinator: new Set(['1', '2', '3', '6']),
        tutorCoordinator: new Set(['1', '2', '3']),
        markerCoodinator: new Set(['1', '2', '3']),
        admin: new Set(['1', '2', '3', '4', '5', '6'])
    })

    const getKey = computed(() => { return Array.from(key.value).sort()})

    const setKey = (newKey: string[] | Set<string>) => {
        key.value = new Set(newKey)
    }

    const setKeyFromGroups = (groupArr: string[]) => {
        key.value.clear();
        groupArr.forEach( (group) => {
            defaultList.value[(group as identityGroups)].forEach(item => { key.value.add(item) })
        })
    }
    return {
        // state
        key,
        defaultList,
        // getters
        getKey,
        // actions
        setKey,
        setKeyFromGroups,
    }
})