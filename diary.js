/* 

getActivities:

res={
    status : 200,
    date   : 20120926,
    list   : [
        [201209260700,'Wake up and kick the dog'],
        [201209260800,'Do some excercises'],
        [201209260900,'Have some cereal for breakfast']
    ]
}


*/

var currentDate  = new Date()
var currentMonth = currentDate.getMonth()
var currentYear  = currentDate.getFullYear()



// API  ---------------------------------------------------

var api = {
    url : '/api/',

    getActivities : function(date){
        // GET url/201209260400
        webapi('GET',api.url+date,null,onGetActivities)
    },

    saveActivity: function(date,text){
        // POST url/201209260400 {text:'text'}
        // trim text to 500 chars
        webapi('POST',api.url+date,'text='+text.substr(0,500),onSaveActivity)
    },

    dropActivity: function(date){
        // DELETE url/201209260400
        webapi('DELETE',api.url+date,null,onDropActivity)
    }
}

function onGetActivities(data){
    clearActivities(data.date)
    showActivities(data.list)
}

function onSaveActivity(data){
    // TODO: do nothing on save
    // alert('Saved: '+data)
}

function onDropActivity(data){
    // TODO: do nothing on delete
    // alert('Deleted: '+data)
}




// View handlers  -----------------------------------------

function clearActivities(date){
    var date = date.substr(0,8)
    var lines = document.getElementsByClassName('edit')
    for(var i=0, n=lines.length; i<n; i++){
        lines[i].innerHTML = ''
        lines[i].id = date+pad(i)+'00'
    }
}

function showActivities(list){
    var id,obj
    for(var i=0, n=list.length; i<n; i++){
        id = list[i][0]
        obj = document.getElementById(id)
        if(obj){
            obj.innerHTML = list[i][1]
            // trick to convert html entities back to chars
            obj.innerHTML = obj.textContent || obj.innerText
        }
    }
}

function setToday(date){
    $('today').innerHTML = getLongDate(date)
}

function setMonth(date){
    $('thismonth').innerHTML = getMonthYear(date)
}

function scrollList(n){
    var top = 0
    var li = document.querySelectorAll('#main li')
    for(var i=0; i<n; i++){
        top += li[i].clientHeight
    }
    $('main').scrollTop = top
}




// User interaction ---------------------------------------

function prevDay(){
    currentDate = new Date(currentDate.getTime()-24*60*60*1000)
    currentMonth = currentDate.getMonth()
    currentYear  = currentDate.getFullYear()
    showDay()
}

function nextDay(){
    currentDate = new Date(currentDate.getTime()+24*60*60*1000)
    currentMonth = currentDate.getMonth()
    currentYear  = currentDate.getFullYear()
    showDay()
}

function thisDay(){
    currentDate  = new Date()
    currentMonth = currentDate.getMonth()
    currentYear  = currentDate.getFullYear()
    showDay()
    showMonth()
}

function clickDay(evt){
    //debugger
    var date = event.target.getAttribute('date')
    var old  = currentMonth
    var yy   = parseInt(date.substr(0,4),10)
    var mm   = parseInt(date.substr(4,2),10)-1
    var dd   = parseInt(date.substr(6,2),10)
    currentDate  = new Date(yy,mm,dd)
    currentMonth = currentDate.getMonth()
    currentYear  = currentDate.getFullYear()
    //if(mm!=old) showMonth()
    showDay()
}

function showDay(){
    setToday(currentDate)
    api.getActivities(getDatetime(currentDate))
}


// Monthly calendar

function prevMonth(){
    currentMonth--
    if(currentMonth<0){ 
        currentMonth=11
        currentYear--
    }
    showMonth()
    return false;
}

function nextMonth(){
    currentMonth++
    if(currentMonth>11){ 
        currentMonth=0
        currentYear++
    }
    showMonth()
    return false;
}

function thisMonth(){
    currentDate  = new Date()
    currentMonth = currentDate.getMonth()
    currentYear  = currentDate.getFullYear()
    showMonth()
    return false;
}

function showMonth(){
    $('thismonth').innerHTML = getMonthName(currentMonth) + ' &bull; ' + currentYear
    // Refresh all days
    var today = new Date()
    var first = new Date(currentYear,currentMonth,1)  // first day of month
    var next  = new Date(first.getTime()-24*60*60*1000*first.getDay())  // go back to sunday
    for(var i=0; i<42; i++){
        day = $('d'+pad(i))
        day.setAttribute('date',getDate(next)) 
        day.innerHTML = next.getDate()
        if(next.getMonth()==currentMonth){ day.className='hi' } else { day.className='lo' }
        if(next.getDay()==0 || next.getDay()==6){ day.className+=' ho' }  // weekend or holiday
        if(getDate(next)==getDate(today)){ day.className+=' to' }  // highlight today
        next = new Date(next.getTime() + 24*60*60*1000) // add one day
    }
}    




// Editing activities -------------------------------------

var oldText = ''
var newText = ''

function cache(obj){
    oldText = obj.innerHTML
}

function save(obj){
    newText = obj.innerHTML
    if(oldText!=newText){
        api.saveActivity(obj.id,newText)
    }
}




// Utils --------------------------------------------------

String.prototype.parse = function(args){
    var str = this.toString();
    for(var i in args){ str=str.replace(new RegExp("{("+i+")}","g"),args[i]); }
    return str;
}

function $(id){
    return document.getElementById(id)
}

function pad(int){
    s=int.toString()
    return s.length>1?s:'0'+s
}

function getDate(date){
    var d = date || new Date()
    var c = d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())
    return c
}

function getDatetime(date){
    var d = date || new Date()
    var t = d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())+pad(d.getHours())+'00'
    return t
}

function getLongDate(date){
    // Wednesday 26th, September 2012
    var nn = date.getDay()
    var dd = date.getDate()
    var mm = date.getMonth()
    var yy = date.getFullYear()
    var cd = getDayName(nn)
    var cm = getMonthName(mm)
    var th = (dd==1?'st':dd==2?'nd':dd==3?'rd':'th')
    return '{0} {1}{2}, {3} {4}'.parse([cd,dd,th,cm,yy])
}

function getDayName(d){
    var days = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' ')
    return days[d]
}

function getMonthName(m){
    var months = 'January February March April May June July August September October November December'.split(' ')
    return months[m]
}

function getMonthYear(date){
    var mm = date.getMonth()
    var yy = date.getFullYear()
    var cc = getMonthName(mm)
    return cc + ' &bull; ' + yy
}

function webapi(method,url,data,callback){
    var http = new XMLHttpRequest()
    http.open(method,url,true)
    if(method=='POST') http.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
    http.onreadystatechange=function(){
        if(http.readyState==4){
            if(callback){
                var obj
                try{
                    obj = JSON.parse(http.responseText) 
                } catch(ex){
                    obj = {status:999,text:'Error accessing database'}
                }
                callback(obj)
            }
        }
    }
    http.send(data)
}




// Main entry point ---------------------------------------

function main(){
    showMonth()
    showDay()
    scrollList(7)
}

main()




/****  END OF DOCUMENT  **********************************/
