<template>
    <div class="nc-legend">
        <ul class="nc-list">
            <li><span class="color" :style="{ 'backgroundColor': booked }"></span>Booked</li>
            <li><span class="color" :style="{ 'backgroundColor': booking }"></span>Your Request</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "CalendarLegend",
    props: {
        available: {
            type: String,
            required: false,
            default: 'lightgreen'
        },
        booked: {
            type: String,
            required: false,
            default: '#FF0000'
        },
        booking: {
            type: String,
            required: false,
            default: '#a6c6fd'
        },
        partially: {
            type: String,
            required: false,
            default: '#FF0000'
        }
    }
}
</script>
<style scoped>
.nc-legend {
    padding: 10px 0 0 0;
    float:right;
    font-size: 10px;
}
.nc-legend .nc-list, .nc-legend .nc-list li{
    list-style: none;
    display: inline-block;
    margin: 0;
    height: 15px;
    overflow: hidden;
}
.nc-legend span{
    padding: 2px 10px;
    margin-right: 2px;
    margin-left: 7px;
}
.nc-list .partially-booked::after {
    content: "";
    position: absolute;
    background: lightgreen;
    width: 10px;
    height: 15px;
    margin-top: 0px;
}
</style>
