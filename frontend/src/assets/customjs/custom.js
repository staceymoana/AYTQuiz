function myFun() {

    var checkBox = document.getElementById("qtype");
    var text = document.getElementById("Single");
    var Multiple = document.getElementById("Multiple");

    var Likert = document.getElementById("Likert");
    var ele = document.getElementById('qtype');
    var radios = document.getElementsByName('qtype');


    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            // do whatever you want with the checked radio

            if (radios[i].value == 'Single') {
                text.style.display = "block";
                Multiple.style.display = "none";
                Likert.style.display = "none";
            } else if (radios[i].value == 'Multiple') {
                Multiple.style.display = "block";
                Likert.style.display = "none";
                text.style.display = "none";
            } else {
                Likert.style.display = "block";
                text.style.display = "none";
                Multiple.style.display = "none";
            }
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }

    /*
    if (checkBox.checked == true) {
        text.style.display = "block";
        var vs = checkBox.value;


        
        window.alert("asdddddddddddddd" + vs);
    } else {
        text.style.display = "none";
        window.alert("sssssssssss");
    }*/
}

function addquection() {

    var qinfo = document.getElementById("qinfo");
    var quection1 = document.getElementById("quection1");


    quection1.style.display = "block";
    qinfo.style.display = "none";
}

function q1plus() {
    quection2.style.display = "block";
    quection1.style.display = "none";
}