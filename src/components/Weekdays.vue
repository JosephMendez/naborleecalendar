<template>
    <ol class="day-of-week">
        <li v-for="(weekday,x) in weekdays" :key="x">{{ weekday }}</li>
    </ol>
</template>

<script>
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default {
    name: "Weekdays",
    props: {
        noofmonths: {
            type: Number,
            required: false,
            default: 1
        },
    },
    computed: {
        weekdays () {
            return WEEKDAYS;
        }
    }
}
</script>
<style scoped>
.day-of-week {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
}
.day-of-week > * {
    text-align: center;
    padding-right: 5px;
    font-size: 13px;
}
</style>