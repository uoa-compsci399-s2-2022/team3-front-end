<template>
  <h3 style="margin-bottom: 8px">Prefer Courses List</h3>
  <SlickList axis="y" v-model:list="prefercourselist" class="list-container" @update:list="changePreference" :distance="distance" :pressDelay="pressDelay" :useWindowAsScrollContainer="true">
    <SlickItem v-for="(c, i) in prefercourselist" :key="c.courseID" :index="i" class="list-item">
      <el-icon><DCaret /></el-icon>
      {{ c.courseNum }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Preference: {{ c.preference}}
        <el-button @click="deleteCourse(i)" class="delete-button" type="danger" :icon="Delete" circle/>
      <el-collapse>
        <el-collapse-item name="1" class="course-collapse">
          <template #title>
            <div class="collapse-title">
            <el-icon style="margin-left: 10px; margin-right: 10px" color="red"><EditPen /></el-icon> Click to fill in the application information for this course
            </div>
          </template>
          <el-form ref="preferCourseRef" :rules="rules" :model="c" label-width="250px" label-position="top" class="course-form">
            <el-form-item label="Have you completed this course?" prop="hasLearned">
              <el-switch v-model="c.hasLearned" />
            </el-form-item>
            <el-form-item label="Grade" v-show="c.hasLearned" prop="grade">
              <el-select v-model="c.grade" clearable placeholder="Select">
                <el-option
                    v-for="g in GRADE"
                    :key="g"
                    :label="g"
                    :value="g"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="If you have not taken this course, please explain why you think you are eligible to apply" v-show="c.hasLearned===false" prop="explanation">
              <el-input v-model="c.explanation" type="textarea" />
            </el-form-item>
            <el-form-item label="Relevant previous experience" prop="preExperience">
              <el-input v-model="c.preExperience" type="textarea" />
            </el-form-item>

          </el-form>
        </el-collapse-item>
      </el-collapse>
    </SlickItem>
  </SlickList>
</template>

<script setup lang="ts">
import { SlickList, SlickItem } from 'vue-slicksort';
import {computed, ref, toRef, watch, reactive, onBeforeMount} from "vue";
import {DCaret, Delete, EditPen} from "@element-plus/icons-vue";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import {isMobile} from "@/utils/isMoblie";


const preferCourseRef = ref<FormInstance[]>();


type preferCourse = {
  courseID: number;
  courseNum: string;
  courseName: string;
  hasLearned: boolean;
  grade: string;
  explanation: string;
  preExperience: string;
  preference: number;
}


const props = defineProps(['preferCourseList'])
const emit = defineEmits(['update:preferCourseList','isvaild'])
const GRADE = ref(['A+','A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'CPL', 'Pass', 'D+', 'D', 'D-', 'DNC', 'DNS', 'Fail'])

const prefercourselist = computed({
  get() {
    return props.preferCourseList as preferCourse[]
  },
  set(value) {
    emit('update:preferCourseList', value)
  }
})


const changePreference = (array: preferCourse[]) => {
  for (let i = 0; i < array.length; i++) {
    array[i].preference = i + 1;
  }
}

const deleteCourse = (index: number) => {
  prefercourselist.value.splice(index, 1);
  for (let i = 0; i < prefercourselist.value.length; i++) {
    prefercourselist.value[i].preference = i + 1;
  }
}
const validateStep =  async () => {

  let flag = true;
  for (let i = 0; i < preferCourseRef.value!.length; i++) {
    switchstate.value = prefercourselist.value[i].hasLearned
    await preferCourseRef.value![i].validateField(
        ['hasLearned','grade','explanation','preExperience'],
        (valid)=>{
          flag = flag && valid

        }
    )

  }

  return (flag)

}
defineExpose({validateStep})
const switchstate = ref()

const validatehasLearnedgrade = (rule: any, value: any, callback: any) => {
  console.log(value)
  if ( switchstate.value === false) {
    console.log(1)
    callback();
  } else if ( value == "") {
    console.log(2)
    callback(new Error('Please select your grade in this course'));
  } else {
    console.log(3)
    callback();
  }
}
const validatehasLearnedexplanation = (rule: any, value: any, callback: any) => {
  if ( switchstate.value === true) {
    callback();
  } else if (value == "") {
    callback(new Error('Please explain why you think you are eligible to apply'));
  } else {
    callback();
  }
}
const rules = reactive<FormRules>({
  hasLearned: [
    {
      required: true,
      message: 'Please select whether you have done this course',
      trigger: 'change'}
  ],
  grade: [
    {
      // required: true,
      // message: 'Please select your grade in this course',
      validator: validatehasLearnedgrade,
      trigger: ['change','blur'],
    },
  ],
  explanation: [
    {
      // required: true,
      // message: 'Please explain why you think you are eligible to apply',
      validator: validatehasLearnedexplanation,
      trigger: ['change','blur'],
    },
  ],
  preExperience: [
    {
      required: true,
      message: 'Please fill in your relevant previous experience',
      trigger: ['change','blur'],
    },
  ],
})


const pressDelay = ref(0)
const distance = ref(0)


const responsiveLayout = () => {
  if (isMobile()) {
    pressDelay.value = 200
    distance.value = 0
  }else {
    pressDelay.value = 0
    distance.value = 20
  }
}

onBeforeMount(() => {
  responsiveLayout()
})


</script>

<style scoped>

h3{
  margin: 0;
  padding: 0;
  font-size: large;
  font-weight: bold;
}

.list-container{
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  overflow: auto;
}
.list-item{
  position: relative;
  display: block;
  padding: 0.75rem 1.25rem;
  margin-bottom: 4px;
  background-color: #f1f1f1;
  border: 1px solid rgba(0,0,0,.125);
  border-radius: 10px;
}

.delete-button{
  position: absolute;
  right: 10px;
}

.course-collapse{
  margin-top: 15px;
  border-radius: 10px;
  background: #0b416d;
}



.course-form{
  margin: 5px;
}

*{
  -webkit-touch-callout:none;  /*系统默认菜单被禁用*/
  -webkit-user-select:none; /*webkit浏览器*/
  -khtml-user-select:none; /*早期浏览器*/
  -moz-user-select:none;/*火狐*/
  -ms-user-select:none; /*IE10*/
  user-select:none;
}
input{
  -webkit-user-select:auto; /*webkit浏览器*/
}
textarea{
  -webkit-user-select:auto; /*webkit浏览器*/
}
</style>