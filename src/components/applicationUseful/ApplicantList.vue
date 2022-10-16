<script setup lang="ts">
import { get } from '@/utils/request';
import { ref } from 'vue';
import { ElNotification, ElTable } from 'element-plus'
import { useRoute } from 'vue-router';

const props = defineProps<{
    courseId: string;
}>()

const route = useRoute()

const tableRef = ref<InstanceType<typeof ElTable>>(null)


get(`/api/getApplicationByCourseID/${props.courseId}`).then(
    res => {
        res.forEach(element => {
            tableData.value.push(element)
        });
        return res
    }
).then(res => {
    res.forEach(element => {
        if (((element.PreferCourse as any[]).find(v => v.courseID == route.params.courseId)).courseCoordinatorEndorsed) {
            tableRef.value.toggleRowSelection(element, true)
        }
    })
})

const handleSelect = (selection: any[], row: any) => {
    let isCheck: boolean = false;
    for (let application of selection) {
        if (application.applicationID === row.applicationID) {
            isCheck = true
            break
        }
    }
    console.log(isCheck)
    get(`api/endorsedApplicationByCC/${row.applicationID}/${route.params.courseId}`).then(res => {
        if (isCheck) {
            ElNotification({
                title: 'Success',
                message: `${row.name}'s application for ${row.type} position is starred!`,
                type: 'success',
            })
        } else {
            ElNotification({
                title: 'Success',
                message: `${row.name}'s application for ${row.type} position is removed from starred list!`,
                type: 'success',
            })
        }
    }).catch(err => {
        if (err.response.status === 400) {
            ElNotification({
                title: 'Notice',
                message: err.response.data.message,
                type: 'error',
            })
            tableRef.value.toggleRowSelection(row, false)
        }
    })




}
const tableData = ref<any>([])

const statusMapping = {
    "Pending": "warning",
    "Accepted": "success",
    "Rejected": "danger"
}

const filterType = (value: string, row: any) => {
    return row.type === value
}
</script>

<template>
    <el-table ref="tableRef" :data="tableData" style="width: 100%;" @select="handleSelect" max-height="800">

        <el-table-column type="selection" width="55" />
        <el-table-column type="expand">

            <template #default="props">
                <el-descriptions title="Applicant Information" direction="vertical" :column="4" border>
                    <el-descriptions-item label="Currently Overseas" align="center">
                        {{props.row.currentlyOverseas}}
                    </el-descriptions-item>

                    <el-descriptions-item label="Will come back to NZ" align="center"
                        v-if="props.row.currentlyOverseas">
                        {{props.row.willBackToNZ}}
                    </el-descriptions-item>

                    <el-descriptions-item label="Citizen or Perminent resident" align="center">
                        {{props.row.isCitizenOrPR}}
                    </el-descriptions-item>

                    <el-descriptions-item label="Have work visa" align="center" v-if="!props.row.isCitizenOrPR">
                        {{props.row.haveValidVisa}}
                    </el-descriptions-item>

                    <el-descriptions-item label="Enrolment details" align="center">
                        {{props.row.enrolDetails}}
                    </el-descriptions-item>

                    <el-descriptions-item label="Degree" align="center">
                        {{props.row.studentDegree}}
                    </el-descriptions-item>

                    <el-descriptions-item label="Have Other Contracts" align="center">
                        {{props.row.haveOtherContracts}}
                    </el-descriptions-item>

                    <el-descriptions-item label="Have work visa" align="center" v-if="props.row.haveOtherContracts">
                        {{props.row.otherContracts}}
                    </el-descriptions-item>

                    <el-descriptions-item label="Maximum Working Hours" align="center">
                        {{props.row.maximumWorkingHours}}
                    </el-descriptions-item>

                </el-descriptions>
            </template>
        </el-table-column>

        <el-table-column label="type" width="100" :filters="[
          { text: 'Tutor', value: 'tutor' },
          { text: 'Marker', value: 'marker' },
        ]" :filter-method="filterType" filter-placement="bottom-end">
            <template #default="scope">
                <el-tag :type="scope.row.type === 'tutor' ? '' : 'success'" disable-transitions>
                    {{ scope.row.type }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="Name" min-width="120" />
        <el-table-column prop="upi" label="UPI" min-width="100" />
        <el-table-column prop="auid" label="auid" min-width="120" />
        <el-table-column prop="email" label="Email" min-width="200" />
        <el-table-column label="GPA" sortable prop="gpa" width="100">
            <template #default="scope">
                {{scope.row.gpa.toFixed(1)}}
            </template>
        </el-table-column>
        <el-table-column label="Status" width="100">
            <template #default="scope">
                <el-tag effect="dark" :type="statusMapping[scope.row.status]">
                    {{scope.row.status}}
                </el-tag>
            </template>
        </el-table-column>
    </el-table>
</template>

<style scoped lang="scss">
:deep(.el-checkbox) {
    .el-checkbox__label {
        color: rgb(255, 238, 0);
    }

    .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: rgb(255, 255, 255);
        border-color: rgb(255, 221, 0);
    }

    .el-checkbox__inner::after {
        content: "★";
        color: rgb(255, 221, 0);
        border: none;
        position: absolute;
        top: -6px;
        left: 8px;
    }

    .el-checkbox__input.is-focus .el-checkbox__inner,
    .el-checkbox__inner:hover {
        border-color: rgb(255, 221, 0);
    }
}
</style>