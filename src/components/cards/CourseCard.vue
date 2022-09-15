<script setup lang="ts">
    
</script>

<template>
<div class="card-container">
    <div class="card-cover">
        <div class="card-edit">
            <el-icon><MoreFilled /></el-icon>
        </div>
    </div>
    <div class="card-info">
        COMPSCI 399: Capstone computer science
    </div>
</div>
</template>

<style scoped lang="scss">
.card-container {
    border-radius: 5px;
    background-color: rgb(11, 65, 109);
    box-shadow: 0 2px 5px rgb(0 0 0 / 30%);
    position: relative;
    .card-cover {
        height: 60%;
        .card-edit {
            color:white;
            font-size: 20px;
            position: absolute;
            top: 10px;
            right: 10px;
            .el-icon {
                transform: rotate(90deg);
            }
        }
    }

    .card-info {
        height: 40%;
        padding: 5px 10px;
        background-color: white;
    }
}
</style>