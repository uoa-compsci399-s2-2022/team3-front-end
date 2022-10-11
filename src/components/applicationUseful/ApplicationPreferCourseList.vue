<template>
  <h3>Prefer Courses List</h3>
  <SlickList axis="y" v-model:list="value" class="list-container" @update:list="changePreference" distance="20" :pressDelay="pressDelay" :useWindowAsScrollContainer="true">
    <SlickItem  v-for="(c, i) in value" :key="c.courseID" :index="i" class="list-item">
      <el-icon><DCaret /></el-icon>
      {{ c.courseNum }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Preference: {{ c.preference}}
        <el-button @click="deleteCourse(i)" class="delete-button" type="danger" :icon="Delete" circle/>
      <el-collapse>
        <el-collapse-item title="Fill in the application information for this course" name="1" class="course-collapse">
          <el-form :rules="rules" :model="c" label-width="250px" label-position="top" class="course-form">
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
import {DCaret, Delete} from "@element-plus/icons-vue";
import {FormRules} from "element-plus";
import {isMobile} from "@/utils/isMoblie";

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
const emit = defineEmits(['update:preferCourseList'])
const GRADE = ref(['A+','A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'CPL', 'Pass', 'D+', 'D', 'D-', 'DNC', 'DNS', 'Fail'])

const value = computed({
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
  value.value.splice(index, 1);
  for (let i = 0; i < value.value.length; i++) {
    value.value[i].preference = i + 1;
  }
}


const rules = reactive<FormRules>({
  hasLearned: [
    { required: true, message: 'Please select whether you have done this course', trigger: 'change' }
  ],
  grade: [
    {
      required: true,
      message: 'Please select your grade in this course',
      trigger: 'change',
    },
  ],
  explanation: [
    {
      required: true,
      message: 'Please explain why you think you are eligible to apply',
      trigger: 'change',
    },
  ],
  preExperience: [
    {
      required: true,
      message: 'Please fill in your relevant previous experience',
      trigger: 'change',
    },
  ],
})

const pressDelay = ref(0)

const responsiveLayout = () => {
  if (isMobile()) {
    pressDelay.value = 200
  }else {
    pressDelay.value = 0
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
  background-color: rgba(176, 201, 227, 0.22);
  border: 1px solid rgba(0,0,0,.125);
  border-radius: .25rem;
}

.delete-button{
  position: absolute;
  right: 10px;
}

.course-collapse{
  margin-top: 15px;
  border-radius: 10px;
}


.course-form{
  margin: 5px;
}

</style>