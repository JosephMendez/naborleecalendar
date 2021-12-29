<template>
  <div id="app">
    <h1>Booking Test</h1>
   <!--<NaborleeCalendar :blockdates="arrayblocked"
                :noofmonths="numberofMonths" purpose="booking"
                :bookeddays="arraybooked"
                :mindays="5"
                @numberofhours="numberofhours"
                @errors="errors"
                @updatedbookingdates="updatedbookingdates"/> -->
  <hr><br><br>
  <NaborleeCalendar v-for="(e, i) in numberofMonths" :key="e"
                    :blockdates="blockDates"
                    :month="incrementMonth(month, year, i)" :year="incrementYear(month, year)"
                    @updateddatesselection="datesSelection(i,...arguments)"
                    @updateddatesdeselection="datesDeSelection(i,...arguments)"
                    />
  </div>
</template>

<script>
import NaborleeCalendar from './components/NaborleeCalendar.vue'
import dayjs from 'dayjs'

export default {
  name: 'App',
  data () {
    return {
      month: Number(dayjs().format("M")),
      year: Number(dayjs().format("YYYY")),
      // number of calendars
      numberofMonths: 2,
      // blocked dates
      allBlockedDates: [],
      blockDates: [],
      allUnBlockedDates: [],
      numberofhours: 3,
      // booked dates sample
      arraybooked: {"2021-12-15":"", "2021-12-16":"","2021-12-17":"","2021-12-18":"12:30", "2021-12-22":""},
      arrayblocked: ["2021-12-26", "2021-12-27", "2021-12-28"]
    }
  },
  components: {
    NaborleeCalendar
  },
  computed: {
    currentMonth () {
      return Number(dayjs().format("M"));
    },
    currentYear () {
      return Number(dayjs().format("YYYY"));
    },
  },
  methods: {
    errors (d) {
      alert(d)
    },
    updatedbookingdates (d) {
      console.log('bookings', d);
    },
    datesSelection(i, d) {
      console.log(d, 'dddd')
    },
    datesDeSelection(i, d) {
      console.log(d, 'dddd')
    },
    incrementMonth(m, y, i) {
      if (m > 12) {
        // this.year =  Number(dayjs().format("YYYY")) + i
      }
      return m + i
    },
    incrementYear(m, y) {
      if (m == 12) {
        // this.year =  Number(dayjs().format("YYYY")) + i
      }
      return y
    },
    addMoreMonths () {
      this.numberofMonths++
    },
    wholeYearMonths () {
      const c = 12 - Number(dayjs().format("M"))
      this.numberofMonths = c + 1
    },
    getBlockDates (i) {
      if (i == 1) {
        return [
          '2021-5-6',
          '2021-5-8',
        ]
      } else {
        return [
          '2021-5-6',
          '2021-5-8',
        ]
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
