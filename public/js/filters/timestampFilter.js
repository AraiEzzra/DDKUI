require('angular');

angular.module('DDKApp').filter('timestampFilter', function () {
    return function (timestamp) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
        ];
        // Epoch time
        var d = new Date(Date.UTC(2016, 0, 1, 17, 0, 0, 0));
        var t = parseInt(d.getTime() / 1000);

        var d = new Date((timestamp + t) * 1000);
       
        var month = monthNames[d.getUTCMonth()];

        var day = d.getUTCDate();

        if (day < 10) {
            day = "0" + day;
        }

        var h = d.getUTCHours();
        var m = d.getUTCMinutes();
        var s = d.getUTCSeconds();
        var ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        h = h ? h : 12; // the hour '0' should be '12'

        if (h < 10) {
            h = "0" + h;
        }

        if (m < 10) {
            m = "0" + m;
        }

        if (s < 10) {
            s = "0" + s;
        }

        return month + "-" + day + "-" + d.getUTCFullYear() + " " + h + ":" + m + ":" + s + " " + ampm + " +UTC";
        //uncomment below code to show local time and comment above return statement
        /* var month = d.getMonth() + 1;

        if (month < 10) {
            month = "0" + month;
        }

        var day = d.getDate();

        if (day < 10) {
            day = "0" + day;
        }

        var h = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();

        if (h < 10) {
            h = "0" + h;
        }

        if (m < 10) {
            m = "0" + m;
        }

        if (s < 10) {
            s = "0" + s;
        }

        return d.getFullYear() + "/" + month + "/" + day + " " + h + ":" + m + ":" + s; */
    }
});
