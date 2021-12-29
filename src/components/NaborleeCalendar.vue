<template>
  <div class="naborleecalendar-container">
    <div class="naborleecalendar-top-toolbar" v-if="purpose == 'listing'">
      <div class="naborlee-month-diplay"><span>{{themonth}}</span></div>
      <div class="naborlee-month-options">
          <span class="block-button" @click="blockThisMonth()">{{blockthismonthText}}</span>
      </div>
    </div>
    <div v-if="purpose == 'listing'">
    <Weekdays :noofmonths="noofmonths"/>
    <ol class="days-grid">
      <MonthDayItem
        :isblock="isBlocked(day.date)"
        :currentdaysinamonth="currentMonthDays"
        @dateSelects="dateEmitSelection"
        @dateDeselects="dateEmitdeSelection"
        v-for="(day,x) in days"
        :key="x"
        :day="day"
        :is-today="day.date === today"
      />
    </ol>
    </div>
    <div class="nc-multiple-cal-container" v-else>
    <div class="nc-cal-left left nc-multiple-cal-col-2">
    <div class="nc-toolbar-control">
       <div><MonthNavigation :selectedDate="selectedDate" :currentDate="today" :prev="true" @dateSelectedNavi="selectDate"/></div>
       <div class="month-label">{{themonth}}</div>
    </div>
    <Weekdays :noofmonths="noofmonths"/>
    <ol class="days-grid" :class="{ 'days-grid-2-month': noofmonths == 2}">
      <MonthDayItemBooking 
        @dateMouseclick="mouseClick"
        @dateMousehover="mouseHover"
        :ishovered="isHovered(day.date)"
        :isblock="isBlocked(day.date)"
        :youBooked="isBlockedBooking(day.date)"
        :youBookedFD="isFD(day.date)"
        :youBookedLD="isLD(day.date)"
        :startDate="startDate"
        :endDate="endDate"
        :wasBooked="isBooked(day.date)"
        :bookedTime="bookedTime(day.date)"
        @dateSelects="dateEmitSelectionBooking"
        v-for="(day,i) in daysForTwoMonthsLeft"
        :key="i"
        :day="day"
        :is-today="day.date === today"/>
    </ol>
    </div>
    <div class="nc-cal-right right nc-multiple-cal-col-2">
    <div class="nc-toolbar-control">
      <div class="month-label">{{themonthRight}}</div>
      <div><MonthNavigation :selectedDate="selectedDate" :currentDate="today" :next="true" @dateSelectedNavi="selectDate"/></div>
    </div>
    <Weekdays :noofmonths="noofmonths"/>
    <ol class="days-grid" :class="{ 'days-grid-2-month': noofmonths == 2}">
      <MonthDayItemBooking 
        @dateMouseclick="mouseClick"
        @dateMousehover="mouseHover"
        :isblock="isBlocked(day.date)"
        :ishovered="isHovered(day.date)"
        :youBooked="isBlockedBooking(day.date)"
        :youBookedFD="isFD(day.date)"
        :youBookedLD="isLD(day.date)"
        :startDate="startDate"
        :endDate="endDate"
        :wasBooked="isBooked(day.date)"
        :bookedTime="bookedTime(day.date)"
        @dateSelects="dateEmitSelectionBooking"
        v-for="(day,i) in daysForTwoMonthsRight"
        :key="i"
        :day="day"
        :is-today="day.date === today"/>
    </ol>
    </div>
    <NcModal
      v-show="isModalVisible"
      @ncClose="closeModal"
      @ncClose2="closeModalReset"
      :end-date="endDate"
      :start-date="startDate"
    />
    </div>
    <!-- <CalendarLegend v-if="purpose == 'booking'"/> -->
  </div>
</template>

<script>

import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import weekdayOfyear from "dayjs/plugin/weekOfYear";
import Weekdays from "./Weekdays";
import MonthDayItem from "./MonthDayItem";
import MonthDayItemBooking from "./MonthDayItemBooking";
import MonthNavigation from "./MonthNavigation";
import NcModal from './NcModal';
// import CalendarLegend from './CalendarLegend';
dayjs.extend(weekday);
dayjs.extend(weekdayOfyear);

export default {
  name: 'NaborleeCalendar',
  components: {
    Weekdays,
    MonthDayItem,
    MonthDayItemBooking,
    MonthNavigation,
    NcModal,
    // CalendarLegend
  },
  data () {
    return {
      listofBlocked: [],
      listofUnBlocked: [],
      blockthismonthText: 'Block this month',
      isblockThisMonth: false,
      nextmonthText: 'Next',
      selectedDate: dayjs(`${this.year}-${this.month}-01`),
      selectedDateRight:  dayjs(`${this.year}-${this.month}-01`).add(1, "month"),
      rangeClick: 0,
      startDate: '',
      endDate: '',
      isModalVisible: false,
      bookingdates: [],
      unbookingdates: [],
      hoverdates: [],
      dfd: '',
      dld: ''
    }
  },
  props: {
    mindays: {
      type: Number,
      required: false
    },
    month: {
      type: Number,
      required: false,
      default: Number(dayjs().format("MM"))
    },
    year: {
      type: Number,
      required: false,
      default: Number(dayjs().format("YYYY"))
    },
    purpose: {
      type: String,
      default: 'listing' 
      // for listing or renting - availability
    },
    blockdates: {
      type: Array,
      required: false
    },
    noofmonths: {
      type: Number,
      required: false
    },
    bookeddays: {
      type: Object,
      required: false
    }
  },
  watch: {
    blockdates() {
      if(this.blockdates.length > 0) {
        this.blockdates.forEach((e) => {
          this.listofBlocked.push(e)
        });
      }
    },
    year() {
      this.setyear = this.year
    },
    month() {
      this.setmonth = this.month
    }
  },
  created () {
    if(this.blockdates.length > 0) {
      this.isblockThisMonth = true
      this.blockthismonthText = 'Unblock this month'
      this.blockdates.forEach((e) => {
        this.listofBlocked.push(e)
      });
    }
  },
  computed: {
    days () {
      return [
        ...this.previousMonthDays,
        ...this.currentMonthDays
      ]
    },
    daysForTwoMonthsLeft () {
      const firstDayOfTheMonthWeekday = this.getWeekday(this.currentMonthDaysLeft[0].date);
      const previousMonth = dayjs(`${this.setyear}-${this.setmonth}-01`).subtract(1, "month");
      const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday ? firstDayOfTheMonthWeekday - 1 : 6;
      const previousMonthLastMondayDayOfMonth = dayjs(this.currentMonthDays[0].date).subtract(visibleNumberOfDaysFromPreviousMonth, "day").date();
      const d = [...Array(visibleNumberOfDaysFromPreviousMonth)].map(
        (day, index) => {
          return {
            date: dayjs(`${previousMonth.year()}-${previousMonth.month() + 1}-${previousMonthLastMondayDayOfMonth + index}`).format("YYYY-MM-DD"),
            isCurrentMonth: false,
            isPastDates: (index < 7 ? true: false),
            xday: day,
            month: previousMonth.month(),
            year: previousMonth.year(),
          }
        }
      )
      return [
        ...d,
        ...this.currentMonthDaysLeft,
      ]
    },
    daysForTwoMonthsRight () {
      const firstDayOfTheMonthWeekday = this.getWeekday(this.currentMonthDaysRight[0].date);
      const previousMonth = dayjs(`${this.setyearRight}-${this.setmonthRight}-01`).subtract(1, "month");
      const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday ? firstDayOfTheMonthWeekday - 1 : 6;
      const previousMonthLastMondayDayOfMonth = dayjs(this.currentMonthDaysRight[0].date).subtract(visibleNumberOfDaysFromPreviousMonth, "day").date();
      const d = [...Array(visibleNumberOfDaysFromPreviousMonth)].map(
        (day, index) => {
          return {
            date: dayjs(`${previousMonth.year()}-${previousMonth.month() + 1}-${previousMonthLastMondayDayOfMonth + index}`).format("YYYY-MM-DD"),
            isCurrentMonth: false,
            isPastDates: (index < 7 ? true: false),
            xday: day,
            month: previousMonth.month(),
            year: previousMonth.year(),
          }
        }
      )
      return [
        ...d,
        ...this.currentMonthDaysRight,
      ]
    },
    numberOfDayInMonth () {
      return dayjs(this.selectedDate).daysInMonth();
    },
    numberOfDayInMonthLeft () {
      return dayjs(this.selectedDate).daysInMonth();
    },
    numberOfDayInMonthRight () {
      return dayjs(this.selectedDateRight).daysInMonth();
    },
    previousMonthDays () {
      const firstDayOfTheMonthWeekday = this.getWeekday(this.currentMonthDays[0].date);
      const previousMonth = dayjs(`${this.setyear}-${this.setmonth}-01`).subtract(1, "month");
      const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday ? firstDayOfTheMonthWeekday - 1 : 6;
      const previousMonthLastMondayDayOfMonth = dayjs(this.currentMonthDays[0].date).subtract(visibleNumberOfDaysFromPreviousMonth, "day").date();
      return [...Array(visibleNumberOfDaysFromPreviousMonth)].map(
        (day, index) => {
          return {
            date: dayjs(`${previousMonth.year()}-${previousMonth.month() + 1}-${previousMonthLastMondayDayOfMonth + index}`).format("YYYY-MM-DD"),
            isCurrentMonth: false,
            isPastDates: (index < 7 ? true: false),
            xday: day,
            month: previousMonth.month(),
            year: previousMonth.year(),
          }
        }
      )
    },
    nextMonthDays () {
      const lastDayOfTheMonthWeekday = this.getWeekday(`${this.setyear}-${this.setmonth}-${this.currentMonthDays.length}`);
      const nextMonth = dayjs(`${this.setyear}-${this.setmonth}-01`).add(1, "month");
      const visibleNumberOfDaysFromNextMonth = 7 - lastDayOfTheMonthWeekday;
      console.log(visibleNumberOfDaysFromNextMonth, 'visibleNumberOfDaysFromNextMonth');
      return [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => {
        return {
          date: dayjs(`${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`).format("YYYY-MM-DD"),
          isCurrentMonth: false,
          xday: day,
          month: nextMonth.month(),
          year: nextMonth.year(),
          isPastDates: false
        }
      })
    },
    currentMonthDays () {
      return [...Array(this.numberOfDayInMonth)].map((day, index) => {
        let disablePastDates
        if ( dayjs().format("M") == this.setmonth 
        && dayjs().format("D") > (index + 1)
        && this.setyear == dayjs().format("YYYY")
        ) {
          disablePastDates = false
        } else if ( 
          dayjs().format("M") > this.setmonth 
          && dayjs().format("YYYY") == this.setyear
          && this.setyear == dayjs().format("YYYY")
          ) {
          disablePastDates = false
        } else if (dayjs().format("YYYY") > this.setyear) {
          disablePastDates = false
        } else {
          disablePastDates = true
        }
        return {
          date: dayjs(`${this.setyear}-${this.setmonth}-${index + 1}`).format("YYYY-MM-DD"),
          isCurrentMonth: disablePastDates,
          isPastDates: false,
          month: this.setmonth,
          year: this.setyear,
          xday: day
        }
      })
    },
    currentMonthDaysLeft () {
      return [...Array(this.numberOfDayInMonthLeft)].map((day, index) => {
        let disablePastDates
        if ( dayjs().format("M") == this.setmonth && dayjs().format("D") > (index + 1)) {
          disablePastDates = false
        } else if ( dayjs().format("M") > this.setmonth && dayjs().format("YYYY") == this.setyear) {
          disablePastDates = false
        } else if (dayjs().format("YYYY") > this.setyear) {
          disablePastDates = false
        } else {
          disablePastDates = true
        }
        return {
          date: dayjs(`${this.setyear}-${this.setmonth}-${index + 1}`).format("YYYY-MM-DD"),
          isCurrentMonth: disablePastDates,
          isPastDates: false,
          month: this.setmonth,
          year: this.setyear,
          xday: day
        }
      })
    },
    currentMonthDaysRight () {
      return [...Array(this.numberOfDayInMonthRight)].map((day, index) => {
        let disablePastDates
        if ( dayjs().format("M") == this.setmonthRight && dayjs().format("D") > (index + 1)) {
          disablePastDates = false
        } else if ( dayjs().format("M") > this.setmonthRight && dayjs().format("YYYY") == this.setyearRight) {
          disablePastDates = false
        } else if (dayjs().format("YYYY") > this.setyearRight) {
          disablePastDates = false
        } else {
          disablePastDates = true
        }
        return {
          date: dayjs(`${this.setyearRight}-${this.setmonthRight}-${index + 1}`).format("YYYY-MM-DD"),
          isCurrentMonth: disablePastDates,
          isPastDates: false,
          month: this.setmonthRight,
          year: this.setyearRight,
          xday: day
        }
      })
    },
    setmonthRight () {
      return Number(this.selectedDateRight.format("M"));
    },
    setyearRight () {
      return Number(this.selectedDateRight.format("YYYY"));
    },
    setmonth () {
      return Number(this.selectedDate.format("M"));
    },
    setyear () {
      return Number(this.selectedDate.format("YYYY"));
    },
    today () {
      return dayjs().format("YYYY-M-D");
    },
    todayDate () {
      return dayjs().format("D");
    },
    themonth () {
      return dayjs(this.selectedDate).format("MMMM YYYY")
    },
    themonthRight () {
      return dayjs(this.selectedDateRight).format("MMMM YYYY")
    }
  },
  methods: {
    isFD(d) {
      if (d == this.dfd) {
        return true
      } else {
        return false
      }
    },
    isLD(d) {
      if (d == this.dld) {
        return true
      } else {
        return false
      }
    },
    mouseClick (d, x, time) {
      if (d == true) {
        this.$emit('errors', 'Not available');
        return false
      }
      if (this.rangeClick == 0) {
        this.clickReset()
      }
      this.rangeClick = this.rangeClick + 1
      if (this.rangeClick == 1) {
        this.dfd = x
        this.bookingdates.push(x)
        this.startDate = (time == '' ? x : x +' '+ time)
      }
      if (this.rangeClick == 2) {
        this.dld = x
        this.endDate = (time == '' ? x : x +' '+ time)
        const diffdate = dayjs(this.endDate).diff(dayjs(this.startDate));
        if (diffdate < 0) {
          const sd = this.endDate
          const se = this.startDate
          this.startDate = sd
          this.dfd = sd
          this.dld = se
          this.endDate = se
        }
        let countConflict = 0
        let listConflicts = []
        const dr = this.getDateRanged(new Date(this.startDate), new Date(this.endDate));
        dr.forEach((day) => {
          this.bookingdates.push(day)
          if(this.bookingConflicts(day)) {
            listConflicts.push(day)
            countConflict++
          }
        })
        if(countConflict >0) {
          this.rangeClick = 0
          this.$emit('errors', 'Some selected dates not available.');
          this.clickReset()
        } else {
          if(d) {
            this.bookingdates.splice(this.bookingdates.indexOf(x), 1);
          } else {
            this.bookingdates.push(x)
          }
          this.rangeClick = 0
          this.showModal()
        }
      }
      this.bookingdates = [...new Set(this.bookingdates)];
      this.$emit('updatedbookingdates', {
        'bookings': [...new Set(this.bookingdates)]
      });
    },
    clickReset () {
        this.dfd = ''
        this.dld = ''
        this.startDate = ''
        this.endDate = ''
        this.bookingdates = []
    },
    getDateRanged (start, end) {
      for(var arr=[], dt=new Date(start); dt <=end; dt.setDate(dt.getDate()+1)) {
        arr.push(dayjs(dt).format("YYYY-MM-DD"));
      }
      return arr;
    },
    mouseEnter (d) {
      console.log(d, 'start drag')
    },
    mouseLeave (d) {
      console.log(d, 'end drag')
    },
    getDatesBetween(a,z) {
      const dates = []
      let currentdate = a
      const addDays = function(days){
        const date = new Date(this.valueOf())
        date.setDate(date.getDate() + days)
        return date
      }
      while (currentdate <= z) {
        dates.push(currentdate)
        currentdate = addDays.call(currentdate, 1)
      }
      return dates
    },
    mouseHover (date) {
      this.hoverdates.push(date)
      const end = this.hoverdates.at(-1)
      var arr = []
      if (this.startDate && end > this.startDate) {
        const dr = this.getDateRanged(new Date(this.startDate), new Date(end));
        dr.forEach((day) => {
          arr.push(day)
        })
        this.hoverdates = arr
      }
    },
    getWeekday (date) {
      return dayjs(date).weekday();
    },
    selectDate (newSelectedDate) {
      this.selectedDate = newSelectedDate
      this.selectedDateRight = dayjs(this.selectedDate).add(1, "month");
    },
    dateEmitSelection (d) {
      this.listofBlocked.push(d)
      this.listofBlocked = [...new Set(this.listofBlocked)];
      this.listofUnBlocked.splice(this.listofUnBlocked.indexOf(d), 1);
      this.$emit('updateddatesselection', this.listofBlocked);
    },
    dateEmitdeSelection (d) {
      this.listofBlocked.splice(this.listofBlocked.indexOf(d), 1)
      this.listofBlocked = [...new Set(this.listofBlocked)];
      this.listofUnBlocked.push(d);
      this.$emit('updateddatesdeselection', this.listofUnBlocked);
    },
    dateEmitSelectionBooking (d) {
      this.bookingdates.push(d)
      this.bookingdates = [...new Set(this.bookingdates)];
    },
    blockThisMonth () {
      this.isblockThisMonth = !this.isblockThisMonth
      this.blockthismonthText = !this.isblockThisMonth ? 'Block this month' : 'Unblock this month'
      let blocks = []
      let unblocks = []
      if (this.isblockThisMonth == true) {
        this.currentMonthDays.map((day) => {
          blocks.push(day.date)
        })
        this.listofBlocked = blocks
        this.listofUnBlocked = unblocks
      } else {
        this.currentMonthDays.map((day) => {
          unblocks.push(day.date)
        })
        this.listofBlocked = blocks
        this.listofUnBlocked = unblocks
      }
      /* this.$emit('updateddatesselection', {
        index: `${this.year}${this.month}`,
        month: this.month,
        year: this.year,
        blocked: [...new Set(this.listofBlocked)],
        unblocked: [...new Set(this.listofUnBlocked)]
      }); */
      this.$emit('updateddatesselection',this.listofBlocked)
      this.$emit('updateddatesdeselection',this.listofUnBlocked)
    },
    isBlocked (date) {
      const d = dayjs(new Date(date)).format('YYYY-MM-DD');
      return this.listofBlocked.includes(d)
    },
    isBlockedBooking (date) {
      let yourRequests = []
      this.bookingdates.map((e) => {
        const esplt = e.split(" ");
        yourRequests.push(esplt[0]);
      })
      return yourRequests.includes(date)
    },
    showModal() {
      this.isModalVisible = true;
    },
    closeModalReset () {
      this.clickReset()
      this.isModalVisible = false;
    },
    diffHours(d, d2) {
      var diff = (d.getTime() - d2.getTime()) / 1000
      diff /= (60*60);
      return Math.abs(Math.round(diff))
    },
    closeModal(d) {
      this.bookingdates.map((e, i) => {
        if (i ==  0) { this.bookingdates[i] = e +' '+ d.pickUp; } else { return e }
      })
      this.bookingdates.pop()
      const endD = dayjs(this.endDate +' '+ d.return).format('YYYY-MM-DD HH:mm');
      this.bookingdates.push(endD)
      this.$emit('updatedbookingdates', {
        'bookings': [...new Set(this.bookingdates)]
      });
      this.isModalVisible = false
      const dStartDiff = this.diffHours(new Date(this.startDate), new Date(endD))
      const dToDays = dStartDiff/24
      if(this.mindays > dToDays) {
        // alert("Minimum days is " + this.mindays)
        this.$emit('errors', 'Minimum days is ' + this.mindays);
        this.clickReset()
      }
      this.$emit('numberofhours', dToDays);
    },
    isHovered (date) {
      if (this.endDate !== '') {
        return false
      }
      if (this.startDate && this.hoverdates !== null ) {
        const hoverItems = this.hoverdates
        return hoverItems.includes(date)
      }
      return false
    },
    isBooked (date) {
      if (typeof this.bookeddays === 'object' && this.bookeddays  !== null ) {
        const bookedItems = Object.keys(this.bookeddays)
        return bookedItems.includes(date)
      }
      return false
    },
    bookingConflicts (date) {
      if (typeof this.blockdates !== 'undefined' && this.blockdates.includes(date)) {
        return true
      }
      if (typeof this.bookeddays[date] !== 'undefined') {
        var checkTimeIn = this.bookeddays[date]
        if (checkTimeIn == '') {
          return true
        }
      }
      return false
    },
    bookedTime (date) {
      if (typeof this.bookeddays === 'object' && this.bookeddays  !== null ) {
       return this.bookeddays[date]
      }
    }
  }
}
</script>

<style scoped>

.naborleecalendar-container {
  position: relative;
  background-color: var(--grey-200);
  border: solid 1px #ddd;
  margin: 0px;
  background: #fff;
}

.naborleecalendar-top-toolbar {
  display: flex;
  flex-flow: row wrap;
}

.naborleecalendar-top-toolbar div
{
  flex: 50%;
}

.naborleecalendar-top-toolbar div span{
  padding: 4px 10px;
  display: block;
}

.naborlee-month-diplay {
  text-align: left;
  font-weight: bold;
}

.naborlee-month-options {
  text-align: right;
}

.day-of-week {
  color: var(--grey-800);
  padding-bottom: 5px;
  padding-top: 10px;
  background-color: #ffffff;
  font-size: 18px;
}

.day-of-week-2-month {
  grid-template-columns: repeat(14, 1fr) !important;
}

.day-of-week,
.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.day-of-week > * {
  text-align: center;
  padding-right: 5px;
}

.days-grid {
  height: 100%;
  position: relative;
  grid-column-gap: var(--grid-gap);
  grid-row-gap: var(--grid-gap);
  border-top: solid 1px var(--grey-200);
}
ol, li {
  padding: 0;
  margin: 0;
  list-style: none;
}
.block-button {
  cursor: pointer;
  text-decoration: underline;
  font-size:11px;
}
.navi-month-right {
  float:left;
  text-align: left;
  font-weight: bold;
}

@media screen and (min-width: 400px) {
   .nc-cal-left.left, .nc-cal-right {
    width: 100%;
  }
}

@media screen and (min-width: 768px) {
  .nc-cal-left.left {
    float: left;
    width: 49%;
    border-right: 1% solid #000;
  }
  .nc-cal-right.right {
    float: right;
    width: 50%;
  }
}
.nc-multiple-cal-container {
  background: #fff;
  box-shadow: 1px 1px 3px #ddd;
}
.nc-multiple-cal-container::after {
  content: "";
  clear: both;
  display: table;
}
.nc-toolbar-control {
  display: flex;
}
.nc-toolbar-control .month-label {
  display: inline;
  width: 96%;
  padding: 10px;
  font-weight: bold;
}
</style>
