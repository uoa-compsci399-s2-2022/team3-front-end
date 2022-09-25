<script setup lang="ts">
import { Delete, get, post, put } from '@/utils/request';
import { ElMessage } from 'element-plus';
import { computed, reactive, ref, watch } from 'vue'

const singleTableRef = ref<any>(null)
const loading = ref(true)


type term = {
    termID?: number;
    termName: string;
    startDate: string;
    endDate: string;
}

const terms: term[] = reactive<term[]>([])

const search = ref('')
const filterterms = computed(() =>
    terms.filter(
        (data) =>
            !search.value ||
            data.termName.toLowerCase().includes(search.value.toLowerCase())
    )
)

const termModalOpened = ref(false);
const termEditModalOpened = ref(false);



const handleTermEdit = (index: number, row: term) => {
    termEditModalOpened.value = true
    return function () {
        put(`/api/modifyTerm/${row.termID}`, { data: termDTO })
            .then(
                () => {
                    setTimeout(() => { location.reload() }, 3000);
                    ElMessage({
                        message: `Edited success.\n The page will be refreshed in 3s.`,
                        type: 'success',
                    })
                }
            )
    }
}
// 通过闭包拿到edit方程
let edit = ref<any>(null)


const handleTermDelete = (index: number, row: term) => {
    Delete(`/api/term/${row.termID}`).then(
        () => {
            setTimeout(() => { location.reload() }, 3000);
            ElMessage({
                message: `Deleted success.\n The page will be refreshed in 3s.`,
                type: 'success',
            })
        }
    )
}

const setCurrent = (row?: term) => {
    singleTableRef.value!.setCurrentRow(row)
}

async function getTermList() {
    let termList = await get('api/term');
    (termList as term[]).forEach((term) => terms.push(term));
    loading.value = false;
    terms.sort((a: term, b: term) => {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    }); // sort according its start Date.
}
getTermList()

const dateRange = ref<any>()
const termDTO: term = {
    startDate: "",
    endDate: "",
    termName: "",
}

watch(dateRange, (date) => {
    termDTO.startDate = new Date(date[0]).toISOString().slice(0, 10)
    termDTO.endDate = new Date(date[1]).toISOString().slice(0, 10)
    console.log(termDTO)
})

const handleTermAdd = () => {
    if (termDTO.termName && termDTO.startDate && termDTO.endDate) {
        post('api/term', termDTO)
            .then(() => {

                setTimeout(() => { location.reload() }, 3000);
                ElMessage({
                    message: `Added a new term ${termDTO.termName}.\n The page will be refreshed in 3s.`,
                    type: 'success',
                })
            })
            .catch(() => {
                ElMessage({
                    message: `Failed. Please check your internect connection.`,
                    type: 'error',
                })
            })
    } else {
        ElMessage({
            message: `Please fill out the form.`,
            type: 'error',
        })
    }

}
</script>

<template>
    <div class="manage-course-container">

        <section>
            <div class="manage-course-subtitle">
                <h2>Terms</h2>
                <el-button type="primary" plain @click="() => {termModalOpened = true}">Add Term</el-button>
            </div>
            <article>
                <el-table v-loading="loading" :data="filterterms" ref="singleTableRef" highlight-current-row
                    height="250">
                    <el-table-column label="" width="100px">

                        <template #default="scope">
                            <span @click="setCurrent(terms[scope.$index])" class="term-select">select</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="Term name" prop="termName" />
                    <el-table-column label="Start Date" prop="startDate" />
                    <el-table-column label="End Date" prop="endDate" />
                    <el-table-column align="right">
                        <template #header>
                            <el-input v-model="search" size="small" placeholder="Type to search" />
                        </template>
                        <template #default="scope">
                            <el-button size="small" @click="() => {edit = handleTermEdit(scope.$index, scope.row)}">Edit
                            </el-button>
                            <el-popconfirm title="Are you sure to delete this?" @confirm="handleTermDelete(scope.$index, scope.row)">
                                <template #reference>
                                    <el-button size="small" type="danger">
                                        Delete
                                    </el-button>
                                </template>
                            </el-popconfirm>

                        </template>
                    </el-table-column>
                </el-table>
            </article>
        </section>
        <section>
            <div class="manage-course-subtitle">
                <h2>Courses</h2>
                <el-button type="primary" plain @click="() => {termModalOpened = true}">Add Course</el-button>
            </div>
            <article>
                
            </article>
        </section>
    </div>

    <teleport to="body">
        <div class="add-term-container" v-if="termModalOpened">
            <div class="add-term-modal">
                <div class="add-term-modal-header">
                    <h2>Add a new Term</h2>
                    <button @click="() => {termModalOpened = false}">
                        <el-icon>
                            <Close />
                        </el-icon>
                    </button>
                </div>
                <div class="add-term-modal-content">
                    <input v-model="termDTO.termName" placeholder="Enter term name" clearable />
                    <el-date-picker v-model="dateRange" type="daterange" range-separator="To"
                        start-placeholder="Start date" end-placeholder="End date" />

                </div>
                <div class="add-term-modal-btns">
                    <el-button type="primary" @click="handleTermAdd">Add</el-button>
                </div>
            </div>
        </div>
    </teleport>

    <teleport to="body">
        <div class="add-term-container" v-if="termEditModalOpened">
            <div class="add-term-modal">
                <div class="add-term-modal-header">
                    <h2>Edit Term</h2>
                    <button @click="() => {termEditModalOpened = false}">
                        <el-icon>
                            <Close />
                        </el-icon>
                    </button>
                </div>
                <div class="add-term-modal-content">
                    <input v-model="termDTO.termName" placeholder="Enter term name" clearable />
                    <el-date-picker v-model="dateRange" type="daterange" range-separator="To"
                        start-placeholder="Start date" end-placeholder="End date" />

                </div>
                <div class="add-term-modal-btns">
                    <el-button type="primary" @click="edit">Edit</el-button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<style scoped lang="scss">
.add-term-container {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100vw;
    height: 100vh;
    background-color: rgba(12, 12, 12, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;

    .add-term-modal {
        width: 400px;
        padding: 15px 20px;
        background-color: white;
        border-radius: 3px;
        box-shadow: inset 1px 1px 0 0 hsla(0, 0%, 100%, .5), 0 3px 8px 0 #555a64;

        &-header {
            display: flex;
            align-items: center;
            padding-bottom: 20px;

            h2 {
                margin-right: auto;
            }

            button {
                background-color: transparent;
                border: none;
            }

            button:hover {
                color: #3182bd;
            }
        }

        &-content {
            display: flex;
            flex-direction: column;
            row-gap: 20px;
            margin-bottom: 20px;

            input {
                height: 32px;
                border: 1.5px solid rgb(227, 227, 227);
                width: 97%;
                border-radius: 4px;
                padding-left: 10px;
            }

            input:hover {
                box-shadow: 0 0 0 1px #dcdfe6 inset;
            }
        }

        &-btns {
            display: flex;

            .el-button {
                margin-left: auto;
            }
        }
    }
}

.manage-course-container {
    display: flex;
    flex-direction: column;

    section {
        flex-shrink: 1;
        .manage-course-subtitle {
            display: flex;
            width: 100%;
            h2 {
                font-size: 25px;
            }

            button {
                margin-left: auto;
            }
        }
    }

    >section:first-child {
        display: flex;
        flex-direction: column;

    

        .term-select {
            color: rgb(132, 199, 232);
            cursor: pointer;
        }

        .term-select:hover {
            color: rgb(0, 170, 255);
        }



    }

    .el-table {
        width: calc(100% - 10px);
    }

    >section:last-child {
        
    }


}
</style>