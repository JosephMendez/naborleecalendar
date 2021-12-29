function getdates (year, month) {
    var d = new Date(year, month);
    while(d.getMonth() == month) {
        d = new Date(d.getTime() + (1000 * 60 * 60 * 240));
    }
}