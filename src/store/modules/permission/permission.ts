import { computed } from 'vue';
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePermissionStore = defineStore('permission', () => {
    const keys = sessionStorage.getItem('mtms_keys');
    const key = ref(keys ? new Set<string>(JSON.parse(keys)) : new Set<string>([]));

    type identityGroups = 'student' | 'courseCoordinator' |  'tutorCoordinator' | 'markerCoordinator' | 'admin'

    const defaultList = ref<{[K in identityGroups] : Set<string>}>({
        student: new Set(['1', '2']),
        courseCoordinator: new Set(['1', '3', '4']),
        tutorCoordinator: new Set(['1', '3', '5', '6']),
        markerCoordinator: new Set(['1', '3', '5', '7']),
        admin: new Set(['1', '2', '3', '4', '5', '6', '7', '8'])
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