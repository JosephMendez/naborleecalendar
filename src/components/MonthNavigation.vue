<template>
    <div class="calendar-month-navi">
        <span @click="selectNext" v-if="next"> NEXT <img src="../assets/arrow-right.png" alt="arrow right"> </span>
        <span @click="selectPrevious" v-if="prev"> PREV <img src="../assets/arrow-left.png" alt="arrow left"> </span>
    </div>
</template>

<script>
import dayjs from 'dayjs';

export default {
    name: "MonthNavigation",
    data() {
        return {
            nextclick: false
        }
    },
    props:{
        prev: {
            type: Boolean,
            required: false
        },
        next: {
            type: Boolean,
            required: false
        },
        currentDate: {
            type: String,
            required: true
        },
        selectedDate: {
            type: Object,
            required: true
        },
        noofmonths: {
            type: Number,
            require: true
        }
    },
    created () {
        if (this.noofmonths > 1) {
            // 
        }
    },
    methods: {
        selectPrevious () {
            let nsd = dayjs(this.selectedDate).subtract(1, "month");
            this.$emit("dateSelectedNavi", nsd)
        },
        selectCurrent () {
            let nsd = dayjs(this.currentDate);
            this.$emit("dateSelectedNavi", nsd)
        },
        selectNext () {
            let nsd = dayjs(this.selectedDate).add(1, "month");
            this.$emit("dateSelectedNavi", nsd)
            this.nextclick = true
        }
    }
}
</script>

<style scoped> 

.calendar-month-navi {
    display: inline;
    margin-top: 10px;
    justify-content: space-between;
    width: 80px;
    color: var(--grey-800);
    font-size: 11px;
}

.calendar-month-navi > *{
    cursor:pointer;
    user-select: none;
}
.calendar-month-navi span {
    margin-top: 10px;
    float: right;
    margin: 10px;
}

</style>
