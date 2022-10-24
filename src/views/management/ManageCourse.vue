<script setup lang="tsx">
import {Delete, get, post, put} from '@/utils/request';
import {ElButton, ElMessage, ElPopconfirm, FormInstance, FormRules, TableV2FixedDir} from 'element-plus';
import {computed, reactive, Ref, ref, watch} from 'vue'
import type {Column} from 'element-plus'
import {watchDebounced} from '@vueuse/core';
import ImportCourseTemplate from "@/components/ImportCourseTemplate.vue";
import FullScreenManageCourse from "@/components/FullScreenManageCourse.vue";
import {FullScreen} from '@element-plus/icons-vue'
import {dateFormat, datetimeFormat} from "@/utils/datetimeFormat";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc)
dayjs.extend(timezone)

const fullScreenCourseVisible = ref(false);
const importVisible = ref(false);

const importShowEvent = () => {
  if (onSelect.value) {
    importVisible.value = true;
  } else {
    ElMessage({
      message: 'Please select a term first.',
      type: 'warning',
    })
  }
}

const fullScreenCourseShowEvent = () => {
  if (onSelect.value) {
    fullScreenCourseVisible.value = true;
  } else {
    ElMessage({
      message: 'Please select a term first.',
      type: 'warning',
    })
  }
}


//-----------------------------Term start----------------------------------

// dom element of add term table
const singleTableRef = ref<any>(null)
const loading = ref(true)

// term type
type term = {
  termID?: number;
  termName: string;
  startDate: string;
  endDate: string;
  isAvailable: boolean;
  defaultMarkerDeadLine: string;
  defaultTutorDeadLine: string;
  payday: Array<any>;
}

/**
 * @description a list of term
 */
const terms: term[] = reactive<term[]>([])

/**
 * @description variable which binded with add course search
 */
const searchTerm = ref('')

/**
 * @description filtered terms based on the search result(searchTerm)
 */
const filterterms = computed(() =>
    terms.filter(
        (data) =>
            !searchTerm.value ||
            data.termName.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
)

/**
 * @description a boolean variable which records whether the 'Add term modal' is opened
 */
const termModalOpened = ref(false);

/**
 * @description a boolean variable which records whether the 'edit term modal' is opened
 */
const termEditModalOpened = ref(false);

// 通过闭包拿到edit方程
/**
 * @description a function, which initially was null,
 * once the user select a term. It will become a function
 * that can edit the selected term.
 */
let editTerm = ref<any>(null)
/**
 * @description closure function, once the user click on 'edit'
 * this function will return a function sepecificlly for that term
 * 通过闭包限制“row”的作用域，防止数据污染
 */
const handleTermEdit = (index: number, row: term) => {
  termEditModalOpened.value = true
  termDTO.termName = row.termName;
  dateRange.value = [new Date(row.startDate) , new Date(row.endDate)];
  termDTO.isAvailable = row.isAvailable;
  defaultMarkerDeadLine.value = dayjs(row.defaultMarkerDeadLine).toISOString();
  // dateRange.value = [new Date(row.startDate), new Date(row.endDate)];
  // // if two deadline exists
  // if (row.defaultMarkerDeadLine && row.defaultTutorDeadLine) {
  //   termDTO.defaultMarkerDeadLine = row.defaultMarkerDeadLine;
  //   termDTO.defaultTutorDeadLine = row.defaultTutorDeadLine;
  //   defaultMarkerDeadLine.value = new Date(row.defaultMarkerDeadLine);
  //   defaultTutorDeadLine.value = new Date(row.defaultTutorDeadLine);
  // } else { // if two deadline doesn't exist, then set the current Time as deadline
  //   termDTO.defaultMarkerDeadLine = new Date().toISOString();
  //   termDTO.defaultTutorDeadLine = new Date().toISOString();
  //   defaultMarkerDeadLine.value = new Date();
  //   defaultTutorDeadLine.value = new Date();
  // }
  return function () {
    put(`/api/modifyTerm/${row.termID}`, {data: termDTO})
        .then(
            () => {
              // setTimeout(() => { location.reload() }, 3000);
              let id = terms[index].termID
              terms[index] = termDTO;
              terms[index].termID = id;
              termEditModalOpened.value = false;
              ElMessage({
                message: `Edited success.`,
                type: 'success',
              })
            }
        )
  }
}

const clearTermForm = () => {
  termDTO.termName = '';
  termDTO.startDate = '';
  termDTO.endDate = '';
  termDTO.isAvailable = false;
  termDTO.defaultMarkerDeadLine = '';
  termDTO.defaultTutorDeadLine = '';
  // reset dates
  dateRange.value = undefined;
  defaultMarkerDeadLine.value = undefined;
  defaultTutorDeadLine.value = undefined;
}

const closeEditTerm = () => {
  clearTermForm();
  termEditModalOpened.value = false;
}

/**
 * @description function for deleting terms.
 */
const handleTermDelete = (index: number, row: term) => {
  Delete(`/api/term/${row.termID}`).then(
      () => {
        terms.splice(index, 1);
        // setTimeout(() => { location.reload() }, 3000);
        ElMessage({
          message: `Deleted success.`,
          type: 'success',
        })
      }
  ).catch(
      (err) => {
        ElMessage({
          message: `${err}`,
          type: 'error',
        })
      }
  )
}
/**
 * @description variable records which term is selected
 */
const setOnSelect = (termID: number, termName: string) => {
  onSelect.value = termID
  onSelectName.value = termName
}

/**
 * @description fcuntion to focus the row selected term.
 * triggers when user click 'select' on a term.
 */
const setCurrent = (row?: term) => {
  setOnSelect(row!.termID!, row!.termName!); // set the selected term
  singleTableRef.value!.setCurrentRow(row); // focus the row of selected term.
}

/**
 * @description request the term list.
 * the term list will be sorted by the startDate.
 * The latest term will be at top
 */
async function getTermList() {
  let termList = await get('api/term');

  terms.length = 0;
  (termList as term[]).forEach((term) => {
    terms.push(term)
  });
  loading.value = false;
  terms.sort((a: term, b: term) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  }); // sort according its start Date.
}

getTermList() // get term list
/**
 * @description a varable which records the date range (Term start date and Term end date).
 */
const dateRange = ref<[Date, Date]>();
const defaultMarkerDeadLine = ref<Date>();
const defaultTutorDeadLine = ref<Date>();
// 监听dateRange，当用户选择日期后，自动转换为yyyy-mm-dd格式 
watch(dateRange, (date) => {
  if (date) {
    termDTO.startDate = date[0].toISOString();
    termDTO.endDate = date[1].toISOString();
  }
})
// defaultMarkerDeadLine改变时自动转换日期为正确的ISO格式
watchDebounced(defaultMarkerDeadLine, (date) => {
  if (date) {
    termDTO.defaultMarkerDeadLine = defaultMarkerDeadLine.value.toISOString()
  }
}, {debounce: 300, maxWait: 1000})

// defaultMarkerDeadLine改变时自动转换日期为正确的ISO格式
watchDebounced(defaultTutorDeadLine, (date) => {
  if (date) {
    termDTO.defaultTutorDeadLine = defaultMarkerDeadLine.value.toISOString()
  }
}, {debounce: 300, maxWait: 1000})

/**
 * @description term data transfer object
 */
const termDTO = reactive<term>({
  startDate: "",
  endDate: "",
  termName: "",
  isAvailable: false,
  defaultMarkerDeadLine: "",
  defaultTutorDeadLine: "",
  payday: [],
})


/**
 * @description function handles adding term
 */
const handleTermAdd = () => {
  if (termDTO.termName && termDTO.startDate &&
      termDTO.endDate && termDTO.defaultMarkerDeadLine &&
      termDTO.defaultTutorDeadLine) {
    post('api/term', termDTO)
        .then(() => {
          getTermList();
          ElMessage({
            message: `Added a new term ${termDTO.termName}.`,
            type: 'success',
          })
          termModalOpened.value = false;
          termDTO.startDate = ""
          termDTO.endDate = ""
          termDTO.termName = ""
          termDTO.isAvailable = false
          termDTO.defaultMarkerDeadLine = ""
          termDTO.defaultTutorDeadLine = ""
          termDTO.payday = []
          dateRange.value = null
          defaultMarkerDeadLine.value = null
          defaultTutorDeadLine.value = null
        })
        .catch((err) => {
          ElMessage({
            message: err.response.data.message,
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
//-----------------------------Term end----------------------------------

//---------------------------Course start----------------------------------
/**
 * @description varable records the whether the course modal is opened or not
 */
const courseModalOpened = ref(false);

/**
 * @description course data transfer object
 */
type courseDTO = {
  courseID: number;
  canPreAssign: boolean;
  courseName: string;
  courseNum: string;
  currentlyNumOfStudents: number;
  markerDeadLine: string;
  tutorDeadLine: string;
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

/**
 * @description course type
 */
type course = {
  courseID: number;
  courseName: string;
  courseNumber: string;
  'pre-assignable': boolean;
  numberOfStudents: number;
  estimatedNumberOfStudent: number;
  markerDeadLine: string;
  tutorDeadLine: string;
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

/**
 * @description course table titles
 */
let titles = [
  'Course Name',
  'Course number',
  'Pre-assignable',
  'Number of students',
  'Estimated number of student',
  'Marker DeadLine',
  'Tutor DeadLine',
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

/**
 * @description convert courseDTO to course
 */
const toDomainModel = (dto: courseDTO): course => {
  return {
    courseID: dto.courseID,
    courseName: dto.courseName,
    courseNumber: dto.courseNum,
    'pre-assignable': dto.canPreAssign,
    numberOfStudents: dto.currentlyNumOfStudents,
    estimatedNumberOfStudent: dto.estimatedNumOfStudents,
    markerDeadLine: dto.markerDeadLine,
    tutorDeadLine: dto.tutorDeadLine,
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

/**
 * @description change the input string to camel case
 * @return {string} camel case version of input string
 */
const toCamel = (str: string): string => {
  return str.split(' ').map(
      (word, index) => index == 0 ?
          word[0].toLowerCase() + word.slice(1) :
          word[0].toUpperCase() + word.slice(1)
  ).join('')
}

/**
 * @description columns of the table
 */
let columns: Column<any>[] = Array.from(titles, (v, i) => {
  let camelCaseV = toCamel(v);
  let result: any = {
    key: camelCaseV,
    dataKey: camelCaseV,
    title: v,
    width: 150,
  }
  if (camelCaseV === 'markerDeadLine' || camelCaseV === 'tutorDeadLine') {
    result.cellRenderer = ({cellData: dateTime}) => (
        <span>{datetimeFormat(dateTime)}</span>
    )
  }
  return result
})

/**
 * @description Operation column
 */
let col: Column<any> = {
  key: 'operations',
  title: 'Operations',
  cellRenderer: ({rowIndex, rowData}) => (
      <>
        <ElButton size="small" onClick={() => {
          editCourse.value = handleCourseEdit(rowIndex)
        }}> Edit </ElButton>
        <ElPopconfirm title="Are you sure to delete this?"
                      onConfirm={() => handleCourseDelete((rowData as course).courseID)} v-slots={{
          reference: () => <el-button size="small" type="danger">Delete</el-button>
        }}/>
      </>
  ),
  width: 150,
  align: 'center',
  fixed: TableV2FixedDir.RIGHT,
}
columns.push(col) // add the last column

/**
 * @description term that is currently being selected
 */
const onSelect = ref<number>(NaN);
const onSelectName = ref<string>("");

/**
 * @description course list, each course will be presented as rows of the table
 */
let courses: Ref<course[]> = ref([])

/**
 * @description send the request to get the cooresponding course list of selected term.
 */
const getCourseList = async () => {
  let res = await get(`api/getCourseByTerm/${onSelect.value}`)
  courses.value.length = 0 // clear the array
  console.log(res)
  res.forEach((row: courseDTO) => courses.value.push(toDomainModel(row)))
}

/**
 * @description once the onSelect has been changed, the course list will be obtained.
 */
watch(onSelect, (v) => {
  if (Number.isNaN(v)) {
    return
  } else {
    getCourseList()
  }
})

/**
 * @description variable bind the value of serach course area
 */
const searchCourse = ref('')

/**
 * @description computed property, which show courses that match the search result.
 */
const filterCourses = computed(() =>
    courses.value.filter(
        (data) =>
            !searchCourse.value ||
            data.courseNumber.toLowerCase().includes(searchCourse.value.toLowerCase())
    )
)

/**
 * @description function used to open the Add course modal
 */
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

/**
 * @description course form type (Add/Edit)
 */


/**
 * @description deaLine is a intermediate variable used to get the correct date form.
 */
const markerDeadLine = ref<Date>();
const tutorDeadLine = ref<Date>();
/**
 * @description gennerate correct Date form once the markerDeadLine has been changed
 */
watchDebounced(markerDeadLine, (date) => {
  if (date) {
    courseForm.markerDeadLine = date.toISOString()
  }
}, {debounce: 300, maxWait: 1000})

watchDebounced(tutorDeadLine, (date) => {
  if (date) {
    courseForm.tutorDeadLine = date.toISOString()
  }
}, {debounce: 300, maxWait: 1000})
/**
 * @description courseForm instance
 */
const courseForm = reactive<courseFormType>({
  needTutors: false,
  estimatedNumOfStudents: null,
  numOfTutorialsPerWeek: null,
  canPreAssign: false,
  termID: NaN,
  numOfAssignments: null,
  courseNum: '',
  markerResponsibility: null,
  courseName: '',
  tutorResponsibility: '',
  numOfLabsPerWeek: null,
  totalAvailableHours: null,
  needMarkers: false,
  currentlyNumOfStudents: null,
  markerDeadLine: '',
  tutorDeadLine: '',
})

/**
 * @description rules used for course form validation.
 */
const rules = reactive<FormRules>({
  courseNum: [{required: true, message: 'Please input course number', trigger: 'blur'},],
  courseName: [
    {required: true, message: 'Please input course name', trigger: 'blur'},
  ],
  // estimatedNumOfStudents: [
  //     { required: true, message: 'Field can\'t be empty', trigger: 'blur' },
  //     { type: 'number', message: 'Must be a number' },
  // ],
  // currentlyNumOfStudents: [
  //     { required: true, message: 'Field can\'t be empty', trigger: 'blur' },
  //     { type: 'number', message: 'Must be a number' },
  // ],
  // numOfTutorialsPerWeek: [
  //     { required: true, message: 'Field can\'t be empty', trigger: 'blur' },
  //     { type: 'number', message: 'Must be a number' },
  // ],
  // numOfLabsPerWeek: [
  //     { required: true, message: 'Field can\'t be empty', trigger: 'blur' },
  //     { type: 'number', message: 'Must be a number' },
  // ],
  // numOfAssignments: [
  //     { required: true, message: 'Field can\'t be empty', trigger: 'blur' },
  //     { type: 'number', message: 'Must be a number' },
  // ],
  // totalAvailableHours: [
  //     { required: true, message: 'Field can\'t be empty', trigger: 'blur' },
  //     { type: 'number', message: 'Must be a number' },
  // ]
})
const defaultRemovedCourseForm = (courseForm: courseFormType) => {
  let output = {
    courseName: courseForm.courseName,
    courseNum: courseForm.courseNum,
    termID: courseForm.termID,
    needTutors: courseForm.needTutors,
    needMarkers: courseForm.needMarkers,
    canPreAssign: courseForm.canPreAssign,
  } as courseFormType
  Object.keys(courseForm).forEach((key) => {
    if (!(courseForm[key as keyof courseFormType] === '')) {
      (output[key as keyof courseFormType] as any) = courseForm[key as keyof courseFormType]
    }
  })
  return output

}
/**
 * @description function for adding new course
 */
const addCourse = async () => {
  try {
    await post('api/courseManagement', defaultRemovedCourseForm(courseForm));
    await getCourseList();
    courseModalOpened.value = false;
    ElMessage({
      message: 'Successfully added a new course.',
      type: 'success',
    })
  } catch (err) {
    if (err.response.data.message) {
      ElMessage({
        message: err.response.data.message,
        type: 'error',
      })
    } else {
      ElMessage({
        message: 'Failed to add a new course.',
        type: 'error',
      })
    }
    console.error(err)
  }
}

/**
 * @description function for deleting exsit course
 */
const handleCourseDelete = (courseID: number) => {
  Delete(`api/deleteCourse/${courseID}`).then(() => {
    getCourseList();
  }).then(() => {
    ElMessage({
      message: `Delete success.`,
      type: 'success',
    })
  }).catch((err) => {
    if (err.response.data.message) {
      ElMessage({
        message: err.response.data.message,
        type: 'error',
      })
    } else {
      ElMessage({
        message: 'Failed to delete a new course.',
        type: 'error',
      })
    }
  })
}

/**
 * @description clear the course form instance
 */
const clearCourseForm = () => {
  courseForm.needTutors = false;
  courseForm.estimatedNumOfStudents = null;
  courseForm.numOfTutorialsPerWeek = null;
  courseForm.canPreAssign = false;
  courseForm.termID = NaN;
  courseForm.numOfAssignments = null;
  courseForm.courseNum = '';
  courseForm.markerResponsibility = '';
  courseForm.courseName = '';
  courseForm.tutorResponsibility = '';
  courseForm.numOfLabsPerWeek = null;
  courseForm.totalAvailableHours = null;
  courseForm.needMarkers = false;
  courseForm.currentlyNumOfStudents = null;
  courseForm.markerDeadLine = '';
  courseForm.tutorDeadLine = '';
}

/**
 * @description whether the couse Edit Modal is Opened
 */
const courseEditModalOpened = ref(false);

/**
 * @description Edit Course form DOM instance. Used for restting the fields and validation
 */
const courseEditRef = ref<FormInstance>();

/**
 * @description once the Edit Course modal is closed, clear the data, and reset the validation.
 */
const closeEditCourse = () => {
  courseEditRef.value!.resetFields();
  clearCourseForm();
  markerDeadLine.value = undefined;
  tutorDeadLine.value = undefined;
  courseEditModalOpened.value = false;
}

/**
 * @description display old course value for user the edit.
 */
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

/**
 * @description function used to edit exsiting courses.
 * 1. open the edit modal
 * 2. get old data, and display them.
 * 3. return the closure function for that course.
 *
 */
const handleCourseEdit = (row: number) => {
  courseEditModalOpened.value = true;
  setCourseForm(row);
  markerDeadLine.value = new Date(courses.value[row].markerDeadLine);
  tutorDeadLine.value = new Date(courses.value[row].tutorDeadLine);
  const courseID = courses.value[row].courseID;
  return function () {
    put(`/api/courseManagement/${courseID}`, {data: courseForm}).then(() => {
      getCourseList();
    }).then(() => {
      closeEditCourse();
      ElMessage({
        message: `Edit success.`,
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


const dateFormatter = (row: any, column: any, cellValue: any) => {
  return dateFormat(cellValue);
}
const dateTimeFormatter = (row: any, column: any, cellValue: any) => {
  return datetimeFormat(cellValue);
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
                  height="230">
          <el-table-column label="" width="100px">

            <template #default="scope">
              <span @click="setCurrent(terms[scope.$index])" class="term-select">select</span>
            </template>
          </el-table-column>

          <el-table-column label="Term name" prop="termName"/>
          <el-table-column label="Start Date" prop="startDate" :formatter="dateFormatter"/>
          <el-table-column label="End Date" prop="endDate" :formatter="dateFormatter"/>
          <el-table-column label="Is available" prop="isAvailable"/>
          <el-table-column label="Marker DeadLine" prop="defaultMarkerDeadLine" :formatter="dateTimeFormatter"/>
          <el-table-column label="Tutor deadline" prop="defaultTutorDeadLine" :formatter="dateTimeFormatter"/>
          <el-table-column align="right">
            <template #header>
              <el-input v-model="searchTerm" size="small" placeholder="Type to search"/>
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
        <el-alert v-if="onSelectName" :title="onSelectName" :center="true" type="warning" effect="dark"
                  :closable="false"
                  class="currentTermAlert"/>
        <el-input v-model="searchCourse" placeholder="Search by course number. e.g. COMPSCI235" size="small"
                  clearable/>
        <el-button type="info" @click="fullScreenCourseShowEvent" plain>
          <el-icon>
            <FullScreen/>
          </el-icon>
        </el-button>
        <el-button type="info" plain @click="importShowEvent">Import</el-button>
        <el-button type="primary" plain @click="handleCourseAdd">Add Course</el-button>
      </div>
      <article>
        <div style="height: calc(100vh - 485px)">
          <el-auto-resizer>
            <template #default="{ height, width }">
              <el-table-v2 :columns="columns" :data="filterCourses" :width="width" :height="height" fixed>
                <template #empty>
                  <div class="flex items-center justify-center h-100%">
                    <el-empty description="Please select term from above" :image-size="120"/>
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
              <Close/>
            </el-icon>
          </button>
        </div>
        <div class="modal-content">
          <el-input v-model.trim="termDTO.termName" placeholder="Enter term name" clearable/>
          <el-date-picker v-model="dateRange" type="datetimerange" range-separator="To"
                          start-placeholder="Start date" end-placeholder="End date"/>
          <div class="modal-content-switch">
            <span>Is available to apply</span>
            <el-switch v-model="termDTO.isAvailable" inline-prompt
                       style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="Y"
                       inactive-text="N"/>
          </div>
          <el-date-picker v-model="defaultMarkerDeadLine" type="datetime"
                          placeholder="Pick a Date for Marker deadline" style="width:100%;"/>
          <el-date-picker v-model="defaultTutorDeadLine" type="datetime"
                          placeholder="Pick a Date for Tutor deadline" style="width:100%;" format="DD-MM-YYYY HH:mm:ss"
                          value-format="YYYY-MM-DDTHH:mm:ss"/>
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
          <button @click="closeEditTerm">
            <el-icon>
              <Close/>
            </el-icon>
          </button>
        </div>
        <div class="modal-content">
          <el-input v-model.trim="termDTO.termName" placeholder="Enter term name" clearable/>
          <el-date-picker v-model="dateRange" type="datetimerange" range-separator="To"
                          start-placeholder="Start date" end-placeholder="End date" />
          <div class="modal-content-switch">
            <span>Is available to apply</span>
            <el-switch v-model="termDTO.isAvailable" inline-prompt
                       style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="Y"
                       inactive-text="N"/>
          </div>
          <el-date-picker v-model="defaultMarkerDeadLine" type="datetime"
                          placeholder="Pick a Date for Marker deadline" style="width:100%;" format="DD-MM-YYYY HH:mm:ss"
                          value-format="YYYY-MM-DDTHH:mm:ssZ"/>
          <el-date-picker v-model="defaultMarkerDeadLine" type="datetime"
                          placeholder="Pick a Date for Tutor deadline" style="width:100%;" format="DD-MM-YYYY HH:mm:ss"
                          value-format="YYYY-MM-DDTHH:mm:ssZ"/>
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
              <Close/>
            </el-icon>
          </button>
        </div>
        <el-form ref="courseAddRef" :model="courseForm" label-width="220px" :rules="rules">
          <div class="modal-content">
            <el-form-item label="Course Number" prop="courseNum">
              <el-input v-model.trim="courseForm.courseNum" placeholder="e.g. COMPSCI399"/>
            </el-form-item>
            <el-form-item label="Course Name" prop="courseName">
              <el-input v-model.trim="courseForm.courseName" placeholder=""/>
            </el-form-item>
            <div style="display: flex">
              <el-form-item label="Can be preassigned" prop="canPreAssign" label-width="220px">
                <el-switch v-model="courseForm.canPreAssign" class="ml-2" inline-prompt
                           style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                           active-text="Y" inactive-text="N"/>
              </el-form-item>
              <el-form-item label="Need markers" prop="needMarkers" label-width="150px">
                <el-switch v-model="courseForm.needMarkers" class="ml-2" inline-prompt
                           style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                           active-text="Y" inactive-text="N"/>
              </el-form-item>
              <el-form-item label="Need tutors" prop="needTutors" label-width="150px">
                <el-switch v-model="courseForm.needTutors" class="ml-2" inline-prompt
                           style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                           active-text="Y" inactive-text="N"/>
              </el-form-item>
            </div>
            <el-form-item label="Estimated number of students" prop="estimatedNumOfStudents">
              <el-input-number v-model.number="courseForm.estimatedNumOfStudents" placeholder=""/>
            </el-form-item>

            <el-form-item label="Current number of students" prop="currentlyNumOfStudents">
              <el-input-number v-model.number="courseForm.currentlyNumOfStudents" placeholder=""/>
            </el-form-item>

            <el-form-item label="Number of Tutorials per week" prop="numOfTutorialsPerWeek">
              <el-input-number v-model.number="courseForm.numOfTutorialsPerWeek" placeholder=""/>
            </el-form-item>

            <el-form-item label="Number of Labs per week" prop="numOfLabsPerWeek">
              <el-input-number v-model.number="courseForm.numOfLabsPerWeek" placeholder=""/>
            </el-form-item>

            <el-form-item label="Number of assignments" prop="numOfAssignments">
              <el-input-number v-model.number="courseForm.numOfAssignments" placeholder=""/>
            </el-form-item>

            <el-form-item label="Total available hours" prop="totalAvailableHours">
              <el-input-number v-model.number="courseForm.totalAvailableHours" placeholder="">
                <template #append>hours</template>
              </el-input-number>
            </el-form-item>

            <el-form-item label="Marker responsibility" prop="markerResponsibility">
              <el-input v-model="courseForm.markerResponsibility" autosize type="textarea"
                        placeholder="Please input"/>
            </el-form-item>
            <el-form-item label="Tutor responsibility" prop="tutorResponsibility">
              <el-input v-model="courseForm.tutorResponsibility" autosize type="textarea"
                        placeholder="Please input"/>
            </el-form-item>

            <el-form-item label="Marker Deadline" prop="deadLine">
              <el-date-picker v-model="markerDeadLine" type="datetime" placeholder="Pick a Date"/>
            </el-form-item>
            <el-form-item label="Tutor Deadline" prop="deadLine">
              <el-date-picker v-model="tutorDeadLine" type="datetime" placeholder="Pick a Date"/>
            </el-form-item>
          </div>
          <div class="modal-btns">
            <el-form-item>
              <el-button type="primary" @click="addCourse">Add course</el-button>
            </el-form-item>
          </div>
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
              <Close/>
            </el-icon>
          </button>
        </div>
        <el-form ref="courseEditRef" :model="courseForm" label-width="220px" :rules="rules">
          <div class="modal-content">
            <el-form-item label="Course Number" prop="courseNum">
              <el-input v-model="courseForm.courseNum" placeholder="e.g. COMPSCI399"/>
            </el-form-item>
            <el-form-item label="Course Name" prop="courseName">
              <el-input v-model="courseForm.courseName" placeholder=""/>
            </el-form-item>
            <div style="display: flex">
              <el-form-item label="Can be preassigned" prop="canPreAssign" label-width="220px">
                <el-switch v-model="courseForm.canPreAssign" class="ml-2" inline-prompt
                           style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                           active-text="Y" inactive-text="N"/>
              </el-form-item>
              <el-form-item label="Need markers" prop="needMarkers" label-width="150px">
                <el-switch v-model="courseForm.needMarkers" class="ml-2" inline-prompt
                           style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                           active-text="Y" inactive-text="N"/>
              </el-form-item>
              <el-form-item label="Need tutors" prop="needTutors" label-width="150px">
                <el-switch v-model="courseForm.needTutors" class="ml-2" inline-prompt
                           style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                           active-text="Y" inactive-text="N"/>
              </el-form-item>
            </div>
            <el-form-item label="Estimated number of students" prop="estimatedNumOfStudents">
              <el-input-number v-model.number="courseForm.estimatedNumOfStudents" placeholder=""/>
            </el-form-item>

            <el-form-item label="Current number of students" prop="currentlyNumOfStudents">
              <el-input-number v-model.number="courseForm.currentlyNumOfStudents" placeholder=""/>
            </el-form-item>

            <el-form-item label="Number of Tutorials per week" prop="numOfTutorialsPerWeek">
              <el-input-number v-model.number="courseForm.numOfTutorialsPerWeek" placeholder=""/>
            </el-form-item>

            <el-form-item label="Number of Labs per week" prop="numOfLabsPerWeek">
              <el-input-number v-model.number="courseForm.numOfLabsPerWeek" placeholder=""/>
            </el-form-item>

            <el-form-item label="Number of assignments" prop="numOfAssignments">
              <el-input-number v-model.number="courseForm.numOfAssignments" placeholder=""/>
            </el-form-item>

            <el-form-item label="Total available hours" prop="totalAvailableHours">
              <el-input-number v-model.number="courseForm.totalAvailableHours" placeholder="">
                <template #append>hours</template>
              </el-input-number>
            </el-form-item>
            <el-form-item label="Marker responsibility" prop="markerResponsibility">
              <el-input v-model="courseForm.markerResponsibility" autosize type="textarea"
                        placeholder="Please input"/>
            </el-form-item>
            <el-form-item label="Tutor responsibility" prop="tutorResponsibility">
              <el-input v-model="courseForm.tutorResponsibility" autosize type="textarea"
                        placeholder="Please input"/>
            </el-form-item>

            <el-form-item label="Marker Deadline" prop="deadLine">
              <el-date-picker v-model="courseForm.markerDeadLine" type="datetime"
                              placeholder="Pick a Date"/>
            </el-form-item>

            <el-form-item label="Tutor Deadline" prop="deadLine">
              <el-date-picker v-model="courseForm.tutorDeadLine" type="datetime"
                              placeholder="Pick a Date"/>
            </el-form-item>
          </div>
          <div class="modal-btns">
            <el-form-item>
              <el-button type="primary" @click="editCourse">Edit course</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </teleport>

  <ImportCourseTemplate v-model:importVisible="importVisible" v-model:term="onSelect" v-model:termName="onSelectName" @getCourseList="getCourseList"/>
  <FullScreenManageCourse v-model:fullScreenCourseVisible="fullScreenCourseVisible" v-model:onSelectName="onSelectName"
                          v-model:searchCourse="searchCourse" v-model:importShowEvent="importShowEvent"
                          @handleCourseAdd="handleCourseAdd" v-model:filter-courses="filterCourses"
                          v-model:columns="columns"/>
</template>

<style scoped lang="scss">
.modal-content-switch {
  display: flex;
  align-items: center;

  span {
    font-size: 15px;
    color: rgb(86, 86, 86);
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
    width: 450px;
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
  margin: 0 34px;

  section {
    flex-shrink: 1;
    margin-top: 15px;

    .manage-course-subtitle {
      display: flex;
      width: 100%;

      .currentTermAlert {
        margin-left: 5px;
        padding: 0;
        width: auto;
        font-weight: bold;
        height: 22px;
      }

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

    @media (max-width: 540px) {
      .manage-course-subtitle {
        flex-direction: column;
        row-gap: 10px;

        .el-input {
          width: 100%;
        }

        button {
          margin-left: 0;
        }
      }
    }
  }

  > section:first-child {
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


  > section:last-child {
    display: flex;
    flex-direction: column;
  }


}
</style>