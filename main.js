const MDCTextField = mdc.textField.MDCTextField;
const MDCSelect = mdc.select.MDCSelect;
const MDCRipple = mdc.ripple.MDCRipple;

var timezone = 'UTC';
var time = '1200';

window.onload = function () {
  let params = new URLSearchParams(window.location.search);
  timezone = params.has('zone') ? params.get('zone') : timezone;
  time = params.has('time') ? params.get('time') : time;

  $('#time-input').val(time.slice(0,2) + ':' + time.slice(2));
  $('#timezone-input').val(timezone)

  updateTime();

  const select = new MDCSelect(document.querySelector('.mdc-select'));
  const textField = new MDCTextField(document.querySelector('.mdc-text-field'));

  var timezones = moment.tz.names();

  autocomplete(document.getElementById("timezone-input"), timezones);

  const buttonRipple = new MDCRipple(document.querySelector('.mdc-button'));
  $('#changeButton button').on('click', function() {
    $('#show-form').show();
    $('#changeButton').hide();
  });

  $('#shareButton button').on('click', function() {
    navigator.clipboard.writeText(location.protocol + '//' + location.host + location.pathname + "?zone=" + timezone + "&time=" + time);
    $('#shareButton button .mdc-button__label').html('The link has been copied to your clipboard!');
    setTimeout(
      function() {
        $('#shareButton button .mdc-button__label').html('Copy link');
      }, 3000);
  });

  $('#time-input').on('input', function() {
    var match = $(this).val().match(/(\d\d):(\d\d)/);
    if (match != null) {
      time = match[1] + match[2];
      updateTime();
    }
  })

  $('#timezone-input').on('change', function() {
    if(moment.tz.zone($(this).val()) != null) {
      timezone = $(this).val();
      updateTime();
    } else {
      $('#errorMsg').html('The provided timezone is invalid');
      $('#errorMsg').show();
    }
  })

  if (!params.has('zone') || !params.has('time')) {
    $('#show-form').show();
    $('#changeButton').hide();
  }
}

function updateTime() {
  var datetime = moment.tz(time, "hhmm", timezone).locale(window.navigator.userLanguage || window.navigator.language)

  var sourceTime = document.getElementById("src-time");
  sourceTime.textContent = datetime.format("LT");

  var sourceTimezone = document.getElementById("src-timezone");
  sourceTimezone.textContent = timezone;

  var localTime = document.getElementById("local-time");
  localTime.textContent = datetime.local().format("LT");
  $('#errorMsg').hide();
}

function makeActive(element) {
  document.getElementById("timezone-input").focus();
  element.classList.add("mdc-select--focused");
  element.classList.add("mdc-select--activated")
}

function autocomplete(inp, arr) {
  var currentFocus;

 inp.addEventListener("input", autocomp);
 inp.addEventListener("click", autocomp);

 inp.addEventListener("focus", autocomp);

 function autocomp(e) {
   var a, b, i, val = this.value;
   closeAllLists();
   currentFocus = -1;

   a = document.createElement("ul");
   a.setAttribute("id", this.id + "autocomplete-list");
   a.setAttribute("class", "autocomplete-items mdc-list");

   document.getElementById("autocomp").appendChild(a);

   for (i = 0; i < arr.length; i++) {
     if (arr[i].toUpperCase().includes(val.toUpperCase()) || (val.trim()).length == 0) {
       b = document.createElement("li");
       b.setAttribute("class", "mdc-list-item")
       b.innerHTML = "<span class='mdc-list-item__text'>" + arr[i] + "</span>";
       b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";

       b.addEventListener("click", function(e) {
         inp.value = this.getElementsByTagName("input")[0].value;
         timezone = inp.value;
         updateTime();
         closeAllLists();
       });
       a.appendChild(b);
     }
   }
 }
 inp.addEventListener("keydown", function(e) {
   var x = document.getElementById(this.id + "autocomplete-list");
   if (x) x = x.getElementsByTagName("li");
   if (e.keyCode == 40) {
     currentFocus++;
     addActive(x);
   } else if (e.keyCode == 38) { //up
     currentFocus--;
     addActive(x);
   } else if (e.keyCode == 13) {
     e.preventDefault();
     if (currentFocus > -1) {
       if (x) x[currentFocus].click();
     }
   }
 });

 function addActive(x) {
   if (!x) return false;
   removeActive(x);
   if (currentFocus >= x.length) currentFocus = 0;
   if (currentFocus < 0) currentFocus = (x.length - 1);
   x[currentFocus].classList.add("autocomplete-active");
   x[currentFocus].classList.add("mdc-list-item--selected");
 }

 function removeActive(x) {
   for (var i = 0; i < x.length; i++) {
     x[i].classList.remove("autocomplete-active");
     x[i].classList.remove("mdc-list-item--selected");
   }
 }

 function closeAllLists(elmnt) {
   var x = document.getElementsByClassName("autocomplete-items");
   for (var i = 0; i < x.length; i++) {
     if (elmnt != x[i] && elmnt != inp) {
       x[i].parentNode.removeChild(x[i]);
     }
   }
 }

}