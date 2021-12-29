<template>
    <li v-if="day.isPastDates"></li>
    <li v-else>
    <div
       class="calendar-day"
       :class="{
           'date-pastdate--list': !day.isCurrentMonth,
           'calendar-day--today': isToday,
           'date-blocked--list': isblock,
           'date-unblocked--list': (day.isCurrentMonth && !isblock),
       }">
       <span class="button" v-if="day.isCurrentMonth" @click="dateSelected(day.date)">
           <span>{{ label }}</span>
        </span>
       <span class="button" v-else disabled>
           <span>{{ label }}</span>
       </span>
    </div>
    </li>
</template>

<script>
import dayjs from "dayjs";

export default {
    name: "MonthDayItem",
    data() {
        return {
            datesBlocked: [],
            datesUnblocked: []
        }
    },
    props: {
        isblock: {
            type: Boolean,
            required: false
        },
        currentdaysinamonth: {
            type: Array,
            required: false
        },
        day: {
            type: Object,
            required: true
        },
        isCurrentMonth: {
            type: Boolean,
            required: false
        },
        isToday: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        label () {
            return dayjs(this.day.date).format("D");
        }
    },
    methods: {
        dateSelected(date) {
            if (this.isblock) {
                this.$emit('dateDeselects', date);
            } else {
                this.$emit('dateSelects', date)
            }
        },
        isSelected (date) {
            return this.datesBlocked.includes(date)
        },
        isUnBlocked (date) {
            return this.datesUnblocked.includes(date)
        }
    }
}
</script>
<style scoped>
.calendar-day {
    position: relative;
    font-size: 16px;
    padding: 0px;
    width: 100%;
    height: 45px;
    border:1px solid #eee;
    text-align: center;
}
.calendar-day > .button {
    display: inline-block !important;
    position: relative !important;
    padding: 0px !important;
    border: 0px !important;
    width: 100%;
    height: 45px;
    line-height: 45px;
    background: none !important;
    outline: none !important;
    cursor: pointer;
}
.date-blocked--list .button {
    background: #fff !important;
}

.date-pastdate--list .button span, .date-blocked--list .button {
    text-decoration: line-through;
    color: #000;
    text-decoration-thickness: 2px;
}
.date-blocked--list .button span {
    position: relative;
    z-index: 999;
    color: #000;
}
.calendar-day--not-current .button::after {
    background-color: #fff !important;
    color: var(--grey-300) !important;
    content: "" !important;
    left: 33%;
    width: 33% !important;
    height: 50%;
    margin: 0px;
    top: 25%;
    margin: 0px;
    background: linear-gradient(to bottom right, rgba(0, 0, 0, 0) calc(50% - 1px), #484848, rgba(0, 0, 0, 0) calc(50% + 1px)) !important;
}
.calendar-day--today > span {
    color: #fff;
    border-radius: 9999px;
    background-color: var(--grey-800);
}

.date-unblocked--list .button {
    background: lightgreen;
}
.date-unblocked--list .button::after {
    cursor: pointer !important;
    content: "" !important;
    top: 0px !important;
    left: 0;
    width: 100% !important;
    height: 45px;
    margin: 0px;
    position: absolute !important;  
    z-index: 2;
    /* background: linear-gradient(to bottom right, rgba(0, 0, 0, 0) calc(50% - 1px), #484848, rgba(0, 0, 0, 0) calc(50% + 1px)) !important; */
    background:lightgreen;
    border: 1px solid #eee;
}
.date-unblocked--list .button span {
    position: relative;
    z-index: 999;
    color: #000;
}
</style>
