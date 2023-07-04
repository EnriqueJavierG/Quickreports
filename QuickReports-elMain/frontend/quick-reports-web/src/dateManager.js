
/**
 * This class handles all date operations
 * @author Fabiola Badillo Ramos
 */
class DateManager {
    
    /**
     * 
     * @param {Date()} dateObj 
     * @returns MM DD YY, hr:mm
     */
    static formatDateToDisplay = (dateObj) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let monthName = months[dateObj.getMonth()]
        let year = dateObj.getFullYear();
        let day = dateObj.getDate();
        let hr = dateObj.getHours();
        let min = dateObj.getMinutes();
        if (min < 10){
            min = `0${min}`
        }
        return `${monthName} ${day} ${year}, ${hr}:${min}`
    };

    /**
     * 
     * @param {YYYY-MM-DD} dateString 
     * @returns {Date()}
     */
    static convertDateStringToObj = (dateString) => {
        let splitDate = dateString.split('-');
        let year = parseInt(splitDate[0],10);
        let mon = parseInt(splitDate[1],10)-1;
        let day = parseInt(splitDate[2],10);
        return (new Date(year, mon, day));
    }

    /**
     * 
     * @param {Date()} dateObj 
     * @returns 'YYYY-MM-DD'
     */
    static convertReqDateObjectToDateString = (dateObj) => {
        let year = `${dateObj.getFullYear()}`;
        let mon = dateObj.getMonth()+1;
        if (mon < 10){
            mon=`0${mon}`
        }
        let day = dateObj.getDate();
        if (day < 10){
            day=`0${day}`
        }
        return `${year}-${mon}-${day}`;
    }

    /**
     * 
     * @param {May 10, 2021} strDate 
     * @returns Date()
     */
    static convertReqDateStringToObj = (strDate) => {
        let splitDate = strDate.split(' ');
        let yr = splitDate[2];
        let mon = splitDate[0];
        let day = splitDate[1];
        // console.log(splitDate)
        // find month number
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let i=0; i<months.length; i++){
            if (mon==months[i]){
                mon=i;
            }
        }
        yr = parseInt(yr, 10);
        day = parseInt(day, 10);
        // console.log(new Date(yr, mon, day))
        return new Date(yr, mon, day);
    }

    /**
     * 
     * @param {'May 20 2020, 12:00'} fullDateString 
     * @returns Date()
     */
    static convertFullDateStringToObj = (fullDateString) => {
        let splitDate = fullDateString.split(' ');
        let mon = splitDate[0];
        let day = splitDate[1];
        let yr = splitDate[2];
        let time = splitDate[3];
        let splitTime = time.split(':')
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let i=0; i<months.length; i++){
            if (mon==months[i]){
                mon=i;
            }
        }
        yr = parseInt(yr, 10);
        day = parseInt(day, 10);
        let hrs = parseInt(splitTime[0], 10);
        let mins = parseInt(splitTime[1], 10);
        return (new Date(yr,mon,day,hrs,mins))
    }

    /**
     * 
     * @param {Date} date 
     * @returns yyyy-mm-ddThh:mm
     */
     static convertDateObjectToLocalISOFormat = (date) => {
        let yr = date.getFullYear();
        let mon = date.getMonth();
        let day = date.getDate();
        let hr = date.getHours();
        let mins = date.getMinutes();
        if (mon < 10){
            mon = `0${mon}`
        }
        if (day<10){
            day=`0${day}`
        }
        if (mins < 10){
            mins=`0${mins}`
        }
        if (hr < 10){
            hr=`0${hr}`
        }
        console.log(`${yr}-${mon}-${day}T${hr}:${mins}`)
        return `${yr}-${mon}-${day}T${hr}${mins}`
    }
       
}

module.exports = {DateManager}

