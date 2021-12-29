<template>
  <div class="nc-modal-backdrop">
    <div class="nc-modal">
      <header class="nc-modal-header">
        <slot name="header">
            <button @click="closeHead">X</button>
        </slot>
      </header>
      <section class="nc-modal-body">
        <slot name="body">
            <p><strong>Specify pickup time.</strong></p>
            <ul class="nc-specific-r-time">
                <li>
                    <select class="nc-time-specify" v-model="selectedPickup">
                       <option v-for="(h,i) in twentyfourHoursStart" :key="i" :value="h.h">{{thestartdate}} {{h.v}}</option>
                    </select>
                </li>
            </ul>
            <p><strong>Specify return time.</strong></p>
            <ul class="nc-specific-r-time">
                <li>
                    <select class="nc-time-specify" v-model="selectedReturnTime">
                        <option v-for="(h,i) in twentyfourHoursEnd" :key="i" :value="h.h">{{theenddate}} {{h.v}}</option>
                    </select>
                </li>
            </ul>
        </slot>
       </section>
      <footer class="nc-modal-footer">
        <slot name="footer">
            <button class="nc-cancel-button" :class="{ 'nc-disabled': selectedReturnTime == '00:00'}" @click="close" :disabled="selectedReturnTime === '00:00' || selectedPickup === '00:00'">OK</button>
        </slot>
      </footer>
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs';
export default {
    name: 'NcModal',
    props: [
        'title',
        'bodymessage',
        'footersg',
        'month',
        'end-date',
        'start-date'
    ],
    data() {
        return {
            selectedPickup: '00:00',
            selectedReturnTime: '00:00',
            quarterHours: ["00", "30"],
            quarterHoursNumber: [0, 30],
            timeReadable: {
                0: 12, 1: '01', 2: '02', 3: '03', 4: '04', 5: '05', 6: '06', 7: '07', 8: '08', 9: '09', 10: 10, 11: 11, 12: 12,
                13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18, 19: 19, 20: 20, 21: 21, 22: 22, 23: 23, 24: 24},
            timeReadable24: {
                0: 24, 1: '01', 2: '02', 3: '03', 4: '04', 5: '05', 6: '06', 7: '07', 8: '08', 9: '09', 10: 10, 11: 11, 12: 12,
                13: 1, 14: 2, 15: 3, 16: 4, 17: 5, 18: 6, 19: 7, 20: 8, 21: 9, 22: 10, 23: 11, 24: 12},
            xtime: [],
            ztime: []
        }
    },
    methods: {
      close() {
        this.$emit('ncClose', {
            pickUp: this.selectedPickup,
            return: this.selectedReturnTime
        });
      },
      closeHead() {
        this.$emit('ncClose2');
      },
    },
    computed: { 
        thestartdate () {
            return dayjs(this.startDate).format("MMM DD, YYYY");
        },
        theenddate () {
            return dayjs(this.endDate).format("MMM DD, YYYY");
        },
        twentyfourHoursStart () {
            const times = [];
            if (this.thestartdate != '') {
                let setHours = [];
                let sh = Number(dayjs(this.startDate).format("H")) == 0 ? 5: Number(dayjs(this.startDate).add(1, 'h').format("H"));
                for (let x = sh; x < 24; x++) {
                    setHours.push(x);
                }
                setHours.map((d) => {
                    let dx = d
                    this.quarterHours.forEach(e => {
                        times.push({
                            h: this.timeReadable[dx] + ':' + e,
                            v: this.timeReadable24[dx] + ':' + e + (dx > 11 ? ' PM' : ' AM')
                        });
                    })
                })
            }
            return times;
        },
        twentyfourHoursEnd() {
            const times = [];
            if (this.theenddate != '') {
                let setHours = [];
                let dHours = [];
                let sh = Number(dayjs(this.endDate).format("H")) == 0 ? 24: Number(dayjs(this.endDate).add(1, 'h').format("H"));
                for ( let i =0 ; i < 24; i++) {
                    dHours.push(i)
                }
                setHours = dHours.slice(5, sh);
                setHours.map((d) => {
                    let dx =(d > 12 ? this.timeReadable[d] : d)
                    this.quarterHours.forEach(e => {
                        times.push({
                            h: this.timeReadable[dx] + ':' + e,
                            v: this.timeReadable24[dx] + ':' + e + (dx > 11 ? ' PM' : ' AM')
                        });
                    })
                })
            }
            return times;
        }
    }
  };
</script>
<style scoped>
.nc-header {
    font-size: 12px;
}
.nc-modal-backdrop {
    position: fixed;
    z-index: 999;
    top: 0;
    min-width: 300px;
    min-height: 400px;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
}

.nc-modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    min-width: 280px;
    flex-direction: column;
}
.nc-modal-footer {
    padding: 20px;
    display: flex;
}
.nc-modal-header button{
    border: 0;
    font-weight: bold;
}
.nc-modal-header {
    position: relative;
    text-align: right;
    color: #000;
    justify-content: space-between;
  }

.nc-modal-footer {
    border-top: 1px solid #eeeeee;
    flex-direction: column;
    justify-content: flex-end;
    background: #eee;
}

.nc-modal-body p {
    margin-bottom: 10px;
}

.nc-modal-body {
    position: relative;
    padding: 20px;
    text-align: left;
}

.nc-btn-close {
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    font-size: 20px;
    padding: 10px;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
}

.nc-btn-green {
    color: white;
    background: #4AAE9B;
    border: 1px solid #4AAE9B;
    border-radius: 2px;
}
.nc-specific-r-time {
    list-style:none;
    margin:0;
    width: 100%;
    padding:0;
}
.nc-specific-r-time li {
    display: block;
}
.nc-specific-r-time li button{
    width: 100%;
    border: 0;
    margin-bottom: 5px;
    padding: 10px;
    cursor: pointer;
}
.nc-cancel-button {
    border: none;
    cursor: pointer;
    color: #fff !important;
    background: #4eab3c;
    border-color: #4eab3c;
    font-size: 1.09rem;
    min-width: 2.75rem;
    padding: 0.5rem 1rem;
    font-size: 1.125rem;
    line-height: 1.625;
    border-radius: 3px;
    font-weight: 400;
}
.nc-time-specify {
    padding: 4px;
    width: 100%;
}
.nc-disabled {
    background: #ddd;
}
</style>