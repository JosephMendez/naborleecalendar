<template>
    <li v-if="day.isPastDates"></li>
    <li v-else :class="{
           'you-booked-list-parent': (youBooked && !youBookedFD && !youBookedLD),
           'first-date-to-book-parent': (youBooked && youBookedFD && endDate!=''),
           'last-date-to-book-parent': (youBooked && youBookedLD),
           'ishovered': ishovered
           }">
    <div v-if="wasBooked" class="booking-type calendar-day"
          :class="{
           'calendar-day--today': isToday,
           'wasbooked': wasBooked,
           'first-date-to-book': youBookedFD,
           'last-date-to-book': youBookedLD,
           'is-blocked--list': isblock
           }">
        <span v-if="partiallyBooked(bookedTime)" 
            @click="dateSelected(day.date)"
            @mouseenter="dateMouseenter(day.date)"
            @mouseleave="dateMouseleave(day.date)"
            @mouseover="dateMousehover(day.date)"
            class="button" :class="convertTimetoClass(bookedTime)" disabled>
            <span class="nc-label">{{ label }}</span>
        </span>
         <span v-else @click="dateSelected(day.date)" class="button is-booked" :class="convertTimetoClass(bookedTime)" disabled>
            <span class="nc-label">{{ label }}</span>
        </span>
    </div>
    <div v-else class="booking-type calendar-day"
       :class="{
           'calendar-day--today': isToday,
           'available': (!wasBooked && !isblock),
           'first-date-to-book': youBookedFD,
           'last-date-to-book': youBookedLD,
           'not-available': !day.isCurrentMonth,
           'is-blocked--list': isblock
           }">
   
            <span class="button" 
            v-if="day.isCurrentMonth && !isblock" 
            @click="dateSelected(day.date)"
            @mouseenter="dateMouseenter(day.date)"
            @mouseleave="dateMouseleave(day.date)"
            @mouseover="dateMousehover(day.date)"
            >
                <span class="nc-label">{{ label }}</span>
                </span>
            <span class="button" @click="dateSelected(day.date)" v-else disabled>
                <span class="nc-label">{{ label }}</span>
            </span>
    </div>
    </li>
</template>

<script>
import dayjs from "dayjs";

export default {
    name: "MonthDayItemBooking",
    data() {
        return {
            datesBlocked: [],
            datesUnblocked: [],
            dateBookedTime: ''
        }
    },
    props: {
        isblock: {
            type: Boolean,
            required: false
        },
        ishovered: {
            type: Boolean,
            required: false
        },
        currentdaysinamonth: {
            type: Array,
            required: false
        },
        youBooked: {
            type: Boolean,
            required: false
        },
        youBookedFD: {
            type: Boolean,
            required: false
        },
        youBookedLD: {
            type: Boolean,
            required: false
        },
        startDate: {
            type: String,
            required: false
        },
        endDate: {
            type: String,
            required: false
        },
        wasBooked: {
            type: Boolean,
            required: false
        },
        bookedTime: {
            type: String,
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
        dateSelected (date) {
            this.$emit('dateMouseclick', this.wasBooked, date, this.dateBookedTime);
        },
        dateMouseenter (date) {
            this.$emit('dateMouseenter', date);
        },
        dateMouseleave (date) {
            this.$emit('dateMouseleave', date);
        },
        dateMousehover (date) {
            this.$emit('dateMousehover', date)
        },
        isSelected (date) {
            return this.datesBlocked.includes(date)
        },
        isUnBlocked (date) {
            return this.datesUnblocked.includes(date)
        },
        convertTimetoClass (time) {
            if(time == '') {
                return 'ntlabel nt-full'
            } else {
                this.dateBookedTime = time;
                return 'ntlabel nt-' + time.replace(":", "")
            }
        },
        partiallyBooked (time) {
            if (time=='') {
                return false
            }else {
                return true
            }
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
    outline: none !important;
    cursor: pointer;
}
.date-blocked--list .button {
    background: #dfe9f9 !important;
}
.date-blocked--list:hover .button::after {
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
    border: 1px solid #eee;
}
.date-blocked--list .button span {
    position: relative;
    z-index: 999;
    color: #000;
}
.calendar-day--not-current .button{
    background-color: #ddd;
}
.calendar-day--not-current .button::after {
    background-color: var(--grey-100) !important;
    color: var(--grey-300) !important;
}
.calendar-day--today > span {
    border-radius: 9999px;
    background-color: var(--grey-800);
}
.days-grid li.you-booked-list-parent {
    background: #e6effe;
}
.first-date-to-book-parent-no-last {
    background: #fff;
}
.first-date-to-book-parent.last-date-to-book-parent {
    background: #ffffff !important;
}
.first-date-to-book-parent {
    background: linear-gradient(90deg, #ffffff 50%,#e6effe 50%) !important;
}
.last-date-to-book-parent {
    background: linear-gradient(90deg, #e6effe 50%,#ffffff 50%) !important;
}
.days-grid li .calendar-day.you-booked--list, .ishovered {
    background: #e6effe !important;
}
.days-grid li .calendar-day.first-date-to-book,
.days-grid li .calendar-day.last-date-to-book
{
     background:#a6c6fd !important;
     border-radius: 100%;
     color: #fff;
     border: 1px solid #aaa;
}
.date-unblocked--list .button {
    background:lightgreen;
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
    background: #009900;
    border: 1px solid #eee;
}
.booking-type.calendar-day.is-blocked--list {
    background: #fff !important;
}
.booking-type.calendar-day.is-blocked--list span.button,
.booking-type.not-available span.button {
    background:#fff;
    color: #aaa;
    text-shadow: 0 0 0 rgb(172, 169, 169) !important;
}
.booking-type.calendar-day.is-blocked--list span.button::after,
.booking-type.not-available span.button::after {
    content: '';
    border-bottom: 2px solid #aaa;
    position: absolute;
    left: 40%;
    top: 50%;
    width: 20%;
}
.wasbooked span .nc-label {
  /* color: #fff !important; */
}
.date-unblocked--list .button span {
    position: relative;
    z-index: 999;
    color: #000;
}
.ntlabel::after {
    content: "";
    left: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    font-size: 8px;
    line-height: 15px;
    align-content: center;
    align-items: flex-end;
}
.calendar-day:hover span[class*="nt-"] {
    background:  rgb(255, 0, 0) !important;
}
.calendar-day span[class*="nt-"]::after{
    content: '';
    border-bottom: 2px solid #aaa;
    position: absolute;
    left: 40%;
    top: 50%;
    width: 20%;
}
.nt-0000::after {
    width:5%;
}
.nt-0030::after {
    width:10%;
}
.nt-0100::after {
    width:10%;
}
.nt-0130::after {
    width:10%;
}
.nt-0200::after {
    width:10%;
}
.nt-0230::after {
    width:10%;
}
.nt-0300::after {
    width:10%;
}
.nt-0330::after {
    width:10%;
}
.nt-0400::after {
    width:10%;
}
.nt-0430::after {
    width:10%;
}
.nt-0500::after {
    width:10%;
}
.nt-0530::after {
    width:15%;
}
.nt-0600::after {
    width:15%;
}
.nt-0630::after {
    width:15%;
}
.nt-0700::after {
    width:15%;
}
.nt-0730::after {
    width:15%;
}
.nt-0800::after {
    width:15%;
}
.nt-0830::after {
    width:20%;
}
.nt-0900::after {
    width:20%;
}
.nt-0930::after {
    width:25%;
}
.nt-1000::after {
    width:30%;
}
.nt-1030::after {
    width:35%;
}
.nt-1100::after {
    width:40%;
}
.nt-1130::after {
    width:45%;
}
.nt-1200::after {
    width:50%;
}
.nt-1200::after {
    width:50%;
}
.nt-1230::after {
    width:55%;
}
.nt-1300::after {
    width:60%;
}
.nt-1330::after {
    width:65%;
}
.nt-1400::after {
    width:70%;
}
.nt-1430::after {
    width:75%;
}
.nt-1500::after {
    width:80%;
}
.nt-1530::after {
    width:85%;
}
.nt-1600::after {
    width:90%;
}
.nt-1630::after {
    width:95%;
}
.nt-1700::after {
    width:100%;
}
.nt-1730::after {
    width:100%;
}
.nt-1800::after {
    width:100%;
}
.nt-1830::after {
    width:100%;
}
.nt-1900::after {
    width:100%;
}
.nt-1930::after {
    width:100%;
}
.nt-2000::after {
    width:100%;
}
.nt-2030::after {
    width:100%;
}
.nt-2100::after {
    width:100%;
}
.nt-2130::after {
    width:100%;
}
.nt-2200::after {
    width:100%;
}
.nt-2230::after {
    width:100%;
}
.nt-2300::after {
    width:100%;
}
.nt-2330::after {
    width:100%;
}
.nt-2400::after {
    width:100%;
}
.nt-full::after {
    width:100%;
    content: "";
}
.isbooked span {
    z-index: 999;
}
.is-booked-calendar-day {
    background:lightgreen;
}
.calendar-day .nc-label {
    position: relative;
    z-index: 999;
    font-size: 13px;
    text-shadow: 0 1px 0 rgb(172, 169, 169);
    font-weight: bold;
}
.not-available {
    background: #fff !important;
}
.days-grid-2-month li {
    background: #fff;
}
</style>
