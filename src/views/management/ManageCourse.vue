<script setup lang="tsx">
import { Delete, get, post, put } from '@/utils/request';
import { ElButton, ElMessage, ElPopconfirm, FormInstance, FormRules, TableV2FixedDir } from 'element-plus';
import { computed, reactive, Ref, ref, watch } from 'vue'
import { useSidebarStore } from '@/store/index'
import type { Column } from 'element-plus'



const singleTableRef = ref<any>(null)
const loading = ref(true)


type term = {
    termID?: number;
    termName: string;
    startDate: string;
    endDate: string;
    isAvailable: boolean;
    defaultDeadLine: string;
}

const terms: term[] = reactive<term[]>([])

const searchTerm = ref('')
const filterterms = computed(() =>
    terms.filter(
        (data) =>
            !searchTerm.value ||
            data.termName.toLowerCase().includes(searchTerm.value.toLowerCase())
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
let editTerm = ref<any>(null)


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

const setOnSelect = (termID: number) => {
    onSelect.value = termID
}

const setCurrent = (row?: term) => {
    setOnSelect(row!.termID!);
    singleTableRef.value!.setCurrentRow(row);
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
const termDTO: term = reactive({
    startDate: "",
    endDate: "",
    termName: "",
    isAvailable: false,
    defaultDeadLine: "",
})

watch(dateRange, (date) => {
    termDTO.startDate = new Date(date[0]).toISOString().slice(0, 10)
    termDTO.endDate = new Date(date[1]).toISOString().slice(0, 10)
})

const handleTermAdd = () => {
    if (termDTO.termName && termDTO.startDate && termDTO.endDate && termDTO.defaultDeadLine) {
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
//--------course------------
const courseModalOpened = ref(false);
// course DTO type
type courseDTO = {
    courseID: number;
    canPreAssign: boolean;
    courseName: string;
    courseNum: string;
    currentlyNumOfStudents: number;
    deadLine: string;
    estimatedNumOfStudents: number;
    markerResponsibility: string;
    needMarkers: boolean;
    needTutors: boolean;
    numOfAssignments: number;
    numOfLabsPerWeek: number;
    numOfTutorialsPerWeek: number;
    termID: number;
    totalAvailableHours: number;
    tutorResponsibility: string;
}
// course type
type course = {
    courseID: number;
    courseName: string;
    courseNumber: string;
    'pre-assignable': boolean;
    numberOfStudents: number;
    estimatedNumberOfStudent: number;
    deadLine: string;
    numberOfAssignments: number;
    numberOfLabsPerWeek: number;
    markerResponsibility: string;
    tutorResponsibility: string;
    numberOfTutorialsPerWeek: number;
    needMarkers: boolean;
    needTutors: boolean;
    termID: number;
    totalAvailableHours: number;
}

let titles = [
    'Course Name',
    'Course number',
    'Pre-assignable',
    'Number of students',
    'Estimated number of student',
    'DeadLine',
    'Number of Assignments',
    'Number of Labs per week',
    'Marker Responsibility',
    'Tutor Responsibility',
    'Number of tutorials per week',
    'Need markers',
    'Need tutors',
    'TermID',
    'Total available hours'
]

const toDomainModel = (dto: courseDTO): course => {
    return {
        courseID: dto.courseID,
        courseName: dto.courseName,
        courseNumber: dto.courseNum,
        'pre-assignable': dto.canPreAssign,
        numberOfStudents: dto.currentlyNumOfStudents,
        estimatedNumberOfStudent: dto.estimatedNumOfStudents,
        deadLine: dto.deadLine,
        numberOfAssignments: dto.numOfAssignments,
        numberOfLabsPerWeek: dto.numOfLabsPerWeek,
        markerResponsibility: dto.markerResponsibility,
        tutorResponsibility: dto.tutorResponsibility,
        numberOfTutorialsPerWeek: dto.numOfTutorialsPerWeek,
        needMarkers: dto.needMarkers,
        needTutors: dto.needTutors,
        termID: dto.termID,
        totalAvailableHours: dto.totalAvailableHours,
    }
}


const toCamel = (str: string) => {
    return str.split(' ').map(
        (word, index) => index == 0 ?
            word[0].toLowerCase() + word.slice(1) :
            word[0].toUpperCase() + word.slice(1)
    ).join('')
}


let columns: Column<any>[] = Array.from(titles, (v, i) => {
    let camelCaseV = toCamel(v);
    console.log(camelCaseV)
    return {
        key: camelCaseV,
        dataKey: camelCaseV,
        title: v,
        width: 150,
    }
})


let col: Column<any> = {
    key: 'operations',
    title: 'Operations',
    cellRenderer: ({ rowIndex, rowData }) => (
        <>
            <ElButton size="small" onClick={() => { editCourse.value = handleCourseEdit(rowIndex) }}> Edit </ElButton>
            <ElPopconfirm title="Are you sure to delete this?" onConfirm={() => handleCourseDelete((rowData as course).courseID)} v-slots={{
                reference: () => <el-button size="small" type="danger">Delete</el-button>
            }} />
        </>
    ),
    width: 150,
    align: 'center',
    fixed: TableV2FixedDir.RIGHT,
}
columns.push(col) // add the last column

const onSelect = ref<number>(NaN);
let courses: Ref<course[]> = ref([])
watch(onSelect, async (v) => {
    if (Number.isNaN(onSelect)) {
        return
    } else {
        let res = await get(`api/getCourseByTerm/${onSelect.value}`)
        courses.value.length = 0 // clear the array
        res.forEach((row: courseDTO) => courses.value.push(toDomainModel(row)))
    }
})

const searchCourse = ref('')
const filterCourses = computed(() =>
    courses.value.filter(
        (data) =>
            !searchCourse.value ||
            data.courseNumber.toLowerCase().includes(searchCourse.value.toLowerCase())
    )
)

const handleCourseAdd = () => {
    if (onSelect.value) {
        courseModalOpened.value = true;
        courseForm.termID = onSelect.value;
    } else {
        ElMessage({
            message: 'Please select a term before adding courses.',
            type: 'warning',
        })
    }
}

type courseFormType = {

    needTutors: boolean;
    estimatedNumOfStudents: string | number;
    numOfTutorialsPerWeek: string | number;
    canPreAssign: boolean;
    termID: number;
    numOfAssignments: string | number;
    courseNum: string;
    markerResponsibility: string;
    courseName: string;
    tutorResponsibility: string;
    numOfLabsPerWeek: string | number;
    totalAvailableHours: string | number;
    needMarkers: boolean;
    currentlyNumOfStudents: string | number;
    deadLine: string
}
const courseForm = reactive<courseFormType>({
    needTutors: false,
    estimatedNumOfStudents: '',
    numOfTutorialsPerWeek: '',
    canPreAssign: false,
    termID: NaN,
    numOfAssignments: '',
    courseNum: '',
    markerResponsibility: '',
    courseName: '',
    tutorResponsibility: '',
    numOfLabsPerWeek: '',
    totalAvailableHours: '',
    needMarkers: false,
    currentlyNumOfStudents: '',
    deadLine: ''
})


const rules = reactive<FormRules>({
    courseNum: [{ required: true, message: 'Please input course number', trigger: 'blur' },],
    courseName: [
        { required: true, message: 'Please input course name', trigger: 'blur' },
    ],
    estimatedNumOfStudents: [
        { required: true, message: 'Field can\'t be empty', trigger: 'blur' },
        { type: 'number', message: 'Must be a number' },
    ],
    currentlyNumOfStudents: [
        { required: true, message: 'Field can\'t be empty', trigger: 'blur' },
        { type: 'number', message: 'Must be a number' },
    ],
    numOfTutorialsPerWeek: [
        { required: true, message: 'Field can\'t be empty', trigger: 'blur' },
        { type: 'number', message: 'Must be a number' },
    ],
    numOfLabsPerWeek: [
        { required: true, message: 'Field can\'t be empty', trigger: 'blur' },
        { type: 'number', message: 'Must be a number' },
    ],
    numOfAssignments: [
        { required: true, message: 'Field can\'t be empty', trigger: 'blur' },
        { type: 'number', message: 'Must be a number' },
    ],
    totalAvailableHours: [
        { required: true, message: 'Field can\'t be empty', trigger: 'blur' },
        { type: 'number', message: 'Must be a number' },
    ]
})

const addCourse = async () => {
    try {
        let res = await post('api/courseManagement', courseForm);
        setTimeout(() => { location.reload() }, 3000);
        ElMessage({
            message: 'Success, you will page will be refreshed in 3s.',
            type: 'success',
        })
    } catch (err) {
        ElMessage({
            message: 'Oops. You seems offline.',
            type: 'error',
        })
        console.error(err)
    }
}


const handleCourseDelete = (courseID: number) => {
    Delete(`api/deleteCourse/${courseID}`).then(
        () => {
            setTimeout(() => { location.reload() }, 3000);
            ElMessage({
                message: `Deleted success.\n The page will be refreshed in 3s.`,
                type: 'success',
            })
        }
    ).catch((err) => {
        ElMessage({
            message: 'Oops. You seems offline.',
            type: 'error',
        })
    })
}


const clearCourseForm = () => {
    courseForm.needTutors = false;
    courseForm.estimatedNumOfStudents = '';
    courseForm.numOfTutorialsPerWeek = '';
    courseForm.canPreAssign = false;
    courseForm.termID = NaN;
    courseForm.numOfAssignments = '';
    courseForm.courseNum = '';
    courseForm.markerResponsibility = '';
    courseForm.courseName = '';
    courseForm.tutorResponsibility = '';
    courseForm.numOfLabsPerWeek = '';
    courseForm.totalAvailableHours = '';
    courseForm.needMarkers = false;
    courseForm.currentlyNumOfStudents = '';
    courseForm.deadLine = ''
}
const courseEditModalOpened = ref(false);
const courseEditRef = ref<FormInstance>();
const closeEditCourse = () => {
    courseEditRef.value!.resetFields();
    clearCourseForm();
    courseEditModalOpened.value = false;
}

const setCourseForm = (row: number) => {
    const courseToEdit = courses.value[row];
    courseForm.courseName = courseToEdit.courseName;
    courseForm.courseNum = courseToEdit.courseNumber;
    courseForm.canPreAssign = courseToEdit['pre-assignable'];
    courseForm.needMarkers = courseToEdit.needMarkers;
    courseForm.needTutors = courseToEdit.needTutors;
    courseForm.currentlyNumOfStudents = courseToEdit.numberOfStudents;
    courseForm.estimatedNumOfStudents = courseToEdit.estimatedNumberOfStudent;
    courseForm.numOfTutorialsPerWeek = courseToEdit.numberOfTutorialsPerWeek;
    courseForm.numOfLabsPerWeek = courseToEdit.numberOfLabsPerWeek;
    courseForm.numOfAssignments = courseToEdit.numberOfAssignments;
    courseForm.totalAvailableHours = courseToEdit.totalAvailableHours;
    courseForm.tutorResponsibility = courseToEdit.tutorResponsibility;
    courseForm.markerResponsibility = courseToEdit.markerResponsibility;
}


// 通过闭包拿到edit方程
let editCourse = ref<any>(null);

const handleCourseEdit = (row: number) => {
    courseEditModalOpened.value = true;
    setCourseForm(row);
    const courseID = courses.value[row].courseID;
    return function () {
        put(`/api/courseManagement/${courseID}`, { data: courseForm }).then(() => {
            setTimeout(() => { location.reload() }, 3000);
            ElMessage({
                message: `Edit success.\n The page will be refreshed in 3s.`,
                type: 'success',
            })
        }).catch(err => {
            ElMessage({
                message: 'Oops. You seems offline.',
                type: 'error',
            })
            console.error(err)
        })
    }
}



</script>

<template>
    <div class="manage-course-container">
        <section>
            <div class="manage-course-subtitle">
                <h2>Terms</h2>
                <el-button type="primary" plain @click="() => {termModalOpened = true}" class="add-term">Add Term
                </el-button>
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
                    <el-table-column label="Is available" prop="isAvailable" />
                    <el-table-column label="deadLine" prop="defaultDeadLine" />
                    <el-table-column align="right">
                        <template #header>
                            <el-input v-model="searchTerm" size="small" placeholder="Type to search" />
                        </template>
                        <template #default="scope">
                            <el-button size="small" @click="() => {editTerm = handleTermEdit(scope.$index, scope.row)}">
                                Edit
                            </el-button>
                            <el-popconfirm title="Are you sure to delete this?"
                                @confirm="handleTermDelete(scope.$index, scope.row)">
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
                <el-input v-model="searchCourse" placeholder="Search by course number. e.g. COMPSCI235" size="small"
                    clearable />
                <el-button type="primary" plain @click="handleCourseAdd">Add Course</el-button>
            </div>
            <article>
                <div style="height: 400px">
                    <el-auto-resizer>
                        <template #default="{ height, width }">
                            <el-table-v2 :columns="columns" :data="filterCourses" :width="width" :height="height" fixed>
                                <template #empty>
                                    <div class="flex items-center justify-center h-100%">
                                        <el-empty description="Please select term from above" :image-size="120" />
                                    </div>
                                </template>
                            </el-table-v2>

                        </template>
                    </el-auto-resizer>
                </div>

            </article>
        </section>
    </div>







    <teleport to="body">
        <div class="modal-container" v-if="termModalOpened">
            <div class="modal">
                <div class="modal-header">
                    <h2>Add a new Term</h2>
                    <button @click="() => {termModalOpened = false}">
                        <el-icon>
                            <Close />
                        </el-icon>
                    </button>
                </div>
                <div class="modal-content">
                    <el-input v-model="termDTO.termName" placeholder="Enter term name" clearable />
                    <el-date-picker v-model="dateRange" type="daterange" range-separator="To"
                        start-placeholder="Start date" end-placeholder="End date" />
                    <div class="modal-content-switch">
                        <span>Is available to apply</span>
                        <el-switch v-model="termDTO.isAvailable" inline-prompt
                        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="Y"
                        inactive-text="N" />
                    </div>
                    <el-date-picker v-model="termDTO.defaultDeadLine" type="datetime" placeholder="Pick a Date for deadline" style="width:100%;"
                        format="YYYY/MM/DD hh:mm:ss" value-format="YYYY-MM-DDThh:mm:ssZ"/>
                </div> 
                <div class="modal-btns">
                    <el-button type="primary" @click="handleTermAdd">Add</el-button>
                </div>
            </div>
        </div>
    </teleport>


    <teleport to="body">
        <div class="modal-container" v-if="termEditModalOpened">
            <div class="modal">
                <div class="modal-header">
                    <h2>Edit Term</h2>
                    <button @click="() => {termEditModalOpened = false}">
                        <el-icon>
                            <Close />
                        </el-icon>
                    </button>
                </div>
                <div class="modal-content">
                    <el-input v-model="termDTO.termName" placeholder="Enter term name" clearable />
                    <el-date-picker v-model="dateRange" type="daterange" range-separator="To"
                        start-placeholder="Start date" end-placeholder="End date" />
                    <div class="modal-content-switch">
                        <span>Is available to apply</span>
                        <el-switch v-model="termDTO.isAvailable" inline-prompt
                        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="Y"
                        inactive-text="N" />
                    </div>
                    <el-date-picker v-model="termDTO.defaultDeadLine" type="datetime" placeholder="Pick a Date for deadline" style="width:100%;"
                        format="YYYY/MM/DD hh:mm:ss" value-format="YYYY-MM-DDThh:mm:ssZ"/>
                </div> 
                <div class="modal-btns">
                    <el-button type="primary" @click="editTerm">Edit</el-button>
                </div>
            </div>
        </div>
    </teleport>




    <teleport to="body">
        <div class="modal-container" v-if="courseModalOpened">
            <div class="course-modal">
                <div class="modal-header">
                    <h2>Add Course</h2>
                    <button @click="() => {courseModalOpened = false}">
                        <el-icon>
                            <Close />
                        </el-icon>
                    </button>
                </div>
                <el-form ref="courseAddRef" :model="courseForm" label-width="220px" :rules="rules">
                    <div class="modal-content">
                        <el-form-item label="Course Number" prop="courseNum">
                            <el-input v-model="courseForm.courseNum" placeholder="e.g. COMPSCI399" />
                        </el-form-item>
                        <el-form-item label="Course Name" prop="courseName">
                            <el-input v-model="courseForm.courseName" placeholder="" />
                        </el-form-item>
                        <div style="display: flex">
                            <el-form-item label="Can be preassigned" prop="canPreAssign" label-width="220px">
                                <el-switch v-model="courseForm.canPreAssign" class="ml-2" inline-prompt
                                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                                    active-text="Y" inactive-text="N" />
                            </el-form-item>
                            <el-form-item label="Need markers" prop="needMarkers" label-width="150px">
                                <el-switch v-model="courseForm.needMarkers" class="ml-2" inline-prompt
                                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                                    active-text="Y" inactive-text="N" />
                            </el-form-item>
                            <el-form-item label="Need tutors" prop="needTutors" label-width="150px">
                                <el-switch v-model="courseForm.needTutors" class="ml-2" inline-prompt
                                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                                    active-text="Y" inactive-text="N" />
                            </el-form-item>
                        </div>
                        <el-form-item label="Estimated number of students" prop="estimatedNumOfStudents">
                            <el-input v-model.number="courseForm.estimatedNumOfStudents" placeholder="" />
                        </el-form-item>

                        <el-form-item label="Current number of students" prop="currentlyNumOfStudents">
                            <el-input v-model.number="courseForm.currentlyNumOfStudents" placeholder="" />
                        </el-form-item>

                        <el-form-item label="Number of Tutorials per week" prop="numOfTutorialsPerWeek">
                            <el-input v-model.number="courseForm.numOfTutorialsPerWeek" placeholder="" />
                        </el-form-item>

                        <el-form-item label="Number of Labs per week" prop="numOfLabsPerWeek">
                            <el-input v-model.number="courseForm.numOfLabsPerWeek" placeholder="" />
                        </el-form-item>

                        <el-form-item label="Number of assignments" prop="numOfAssignments">
                            <el-input v-model.number="courseForm.numOfAssignments" placeholder="" />
                        </el-form-item>

                        <el-form-item label="Total available hours" prop="totalAvailableHours">
                            <el-input v-model.number="courseForm.totalAvailableHours" placeholder="">
                                <template #append>hours</template>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="Marker responsibility" prop="markerResponsibility">
                            <el-input v-model="courseForm.markerResponsibility" autosize type="textarea"
                                placeholder="Please input" />
                        </el-form-item>
                        <el-form-item label="Tutor responsibility" prop="tutorResponsibility">
                            <el-input v-model="courseForm.tutorResponsibility" autosize type="textarea"
                                placeholder="Please input" />
                        </el-form-item>

                        <el-form-item label="Deadline" prop="deadLine">
                            <el-date-picker v-model="courseForm.deadLine" type="datetime" placeholder="Pick a Date"
                                format="YYYY/MM/DD hh:mm:ss" value-format="YYYY-MM-DDThh:mm:ssZ" />
                        </el-form-item>

                    </div>
                    <div class="modal-btns">
                        <el-form-item>
                            <el-button type="primary" @click="addCourse">Add course</el-button>
                        </el-form-item>
                    </div>
                    {{courseForm}}
                </el-form>
            </div>
        </div>
    </teleport>


    <teleport to="body">
        <div class="modal-container" v-if="courseEditModalOpened">
            <div class="course-modal">
                <div class="modal-header">
                    <h2>Edit Course</h2>
                    <button @click="closeEditCourse">
                        <el-icon>
                            <Close />
                        </el-icon>
                    </button>
                </div>
                <el-form ref="courseEditRef" :model="courseForm" label-width="220px" :rules="rules">
                    <div class="modal-content">
                        <el-form-item label="Course Number" prop="courseNum">
                            <el-input v-model="courseForm.courseNum" placeholder="e.g. COMPSCI399" />
                        </el-form-item>
                        <el-form-item label="Course Name" prop="courseName">
                            <el-input v-model="courseForm.courseName" placeholder="" />
                        </el-form-item>
                        <div style="display: flex">
                            <el-form-item label="Can be preassigned" prop="canPreAssign" label-width="220px">
                                <el-switch v-model="courseForm.canPreAssign" class="ml-2" inline-prompt
                                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                                    active-text="Y" inactive-text="N" />
                            </el-form-item>
                            <el-form-item label="Need markers" prop="needMarkers" label-width="150px">
                                <el-switch v-model="courseForm.needMarkers" class="ml-2" inline-prompt
                                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                                    active-text="Y" inactive-text="N" />
                            </el-form-item>
                            <el-form-item label="Need tutors" prop="needTutors" label-width="150px">
                                <el-switch v-model="courseForm.needTutors" class="ml-2" inline-prompt
                                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                                    active-text="Y" inactive-text="N" />
                            </el-form-item>
                        </div>
                        <el-form-item label="Estimated number of students" prop="estimatedNumOfStudents">
                            <el-input v-model.number="courseForm.estimatedNumOfStudents" placeholder="" />
                        </el-form-item>

                        <el-form-item label="Current number of students" prop="currentlyNumOfStudents">
                            <el-input v-model.number="courseForm.currentlyNumOfStudents" placeholder="" />
                        </el-form-item>

                        <el-form-item label="Number of Tutorials per week" prop="numOfTutorialsPerWeek">
                            <el-input v-model.number="courseForm.numOfTutorialsPerWeek" placeholder="" />
                        </el-form-item>

                        <el-form-item label="Number of Labs per week" prop="numOfLabsPerWeek">
                            <el-input v-model.number="courseForm.numOfLabsPerWeek" placeholder="" />
                        </el-form-item>

                        <el-form-item label="Number of assignments" prop="numOfAssignments">
                            <el-input v-model.number="courseForm.numOfAssignments" placeholder="" />
                        </el-form-item>

                        <el-form-item label="Total available hours" prop="totalAvailableHours">
                            <el-input v-model.number="courseForm.totalAvailableHours" placeholder="">
                                <template #append>hours</template>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="Marker responsibility" prop="markerResponsibility">
                            <el-input v-model="courseForm.markerResponsibility" autosize type="textarea"
                                placeholder="Please input" />
                        </el-form-item>
                        <el-form-item label="Tutor responsibility" prop="tutorResponsibility">
                            <el-input v-model="courseForm.tutorResponsibility" autosize type="textarea"
                                placeholder="Please input" />
                        </el-form-item>

                        <el-form-item label="Deadline" prop="deadLine">
                            <el-date-picker v-model="courseForm.deadLine" type="datetime" placeholder="Pick a Date"
                                format="YYYY/MM/DD hh:mm:ss" value-format="YYYY-MM-DDThh:mm:ssZ" />
                        </el-form-item>

                    </div>
                    <div class="modal-btns">
                        <el-form-item>
                            <el-button type="primary" @click="editCourse">Edit course</el-button>
                        </el-form-item>
                    </div>
                    {{courseForm}}
                </el-form>
            </div>
        </div>
    </teleport>
</template>

<style scoped lang="scss">
.modal-content-switch {
    display: flex;
    align-items: center;
    span {
        font-size:15px;
        color:rgb(86, 86, 86);
        margin-right: 30px;
    }
}

.modal-container {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100vw;
    height: 100vh;
    background-color: rgba(12, 12, 12, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;

    .modal {
        width: 400px;
        padding: 15px 20px;
        padding-top: 0;
        background-color: white;
        border-radius: 3px;
        box-shadow: inset 1px 1px 0 0 hsla(0, 0%, 100%, .5), 0 3px 8px 0 #555a64;
        position: relative;

        &-header {
            position: sticky;
            top: 0;
            z-index: 10;
            background-color: #fff;
            display: flex;
            align-items: center;
            padding-top: 15px;
            padding-bottom: 20px;
            opacity: 0.9;

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
        }

        &-btns {
            display: flex;

            .el-button {
                margin-left: auto;
            }
        }
    }



    .course-modal {
        width: 800px;
        height: 80%;
        overflow-y: scroll;
        padding: 0 20px;
        padding-bottom: 15px;
        background-color: white;

        border-radius: 3px;
        box-shadow: inset 1px 1px 0 0 hsla(0, 0%, 100%, .5), 0 3px 8px 0 #555a64;
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

            .add-term {
                margin-left: auto;
            }

            .el-input {
                margin-left: auto;
                width: 30%;
                height: 30px;
                margin-top: 2px;
            }

            button {
                margin-left: 20px;
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


    >section:last-child {
        display: flex;
        flex-direction: column;
    }


}
</style>