const fetchPromise = fetch(
  "https://dev.onebanc.ai/assignment.asmx/GetTransactionHistory?userId=1&recipientId=2"
);

//fetchpromise function will fetch the information

fetchPromise
  .then((response) => {
    return response.json(); // returning data in json format
  })
  .then((data) => {
    myData(data); //calling myData function and passing the json data
  })
  .catch(function (err) {
    console.log("error: " + err);
  });

function custom_sort(a, b) {
  //this function will sort the json data on behalf of StartDate

  return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
}

function MyDataSort(arr) {
  // basic function created to call the sorting function

  arr.sort(custom_sort);
}

function myData(data) {
  var arr = data.transactions; // creating array of transactions

  MyDataSort(arr); //Calling MyDataSort function to sort the json data by date

  for (let i = 0; i < arr.length; i++) {
    var amount = arr[i].amount;
    var id = arr[i].id;
    var description = arr[i].description;

    var sdate = new Date(arr[i].startDate);
    var year = sdate.getFullYear();
    var d = String(sdate.getDate()).padStart(2, "0");
    var m = String(sdate.getMonth() + 1).padStart(2, "0");
    var date = "";

    date += d + "-" + m + "-" + year; //changing the format of date eg. "25-02-2021"

    var hrs = sdate.getHours();

    var timeFrame = "AM";
    if (hrs === 0) {
      hrs = 12;
    }
    if (hrs > 12) {
      hrs -= 12;
    }
    if (hrs >= 12) {
      timeFrame = "PM";
    }

    var mins = sdate.getMinutes();

    var time = hrs + ":" + mins + " " + timeFrame; //changing the format of time eg. "12:30 PM"

    var inputs = "";

    //this if statement will check the transaction date and seperate them accordingly

    if (
      i == 0 ||
      arr[i].startDate.toString().substring(0, 10) !=
        arr[i - 1].startDate.toString().substring(0, 10)
    ) {
      inputs += '<p class="date">' + "<span>" + date + "</span>" + "</p>";
    }

    if (arr[i].direction === 1) {
      //checking direction 1-sent or 2 - receieved
      if (arr[i].type === 1) {
        inputs += '<div class="left-pane paid" >'; //further checks type 1-pay or 2 - collect
      }
      if (arr[i].type === 2) {
        inputs += '<div class="left-pane requested">';
      }
    }

    if (arr[i].direction === 2) {
      if (arr[i].type === 1) {
        inputs += '<div class="right-pane paid" >';
      }
      if (arr[i].type === 2) {
        inputs += '<div class="right-pane requested received">';
      }
    }

    inputs += '<div class="left-pane-text">';
    inputs +=
      "<span><i class='fas fa-rupee-sign'></i>" +
      amount +
      "</span><p>" +
      description +
      "</p>"; //adding amount to left div text

    //this if statement will check the status as :
    // 1- pending
    // 2- confirmed
    // 3- expired
    // 4- reject
    // 5- cancel

    if (arr[i].status === 1) {
      if (arr[i].direction === 1) {
        inputs += '<button class="btn">Cancel</button> </div >';
      }
      if (arr[i].direction === 2) {
        inputs += '<div class="buttons"><button class="btn-sm" > Pay</button >';
        inputs += '<button class="btn">Decline</button></div ></div >';
      }
    }
    if (arr[i].status === 2) {
      inputs += '<p> Transaction ID:</p><p id="transId">' + id + "</p></div>";
    }

    inputs += '<div class="right-pane-text"><span><i class="fas fa-';

    if (arr[i].status === 1) {
      if (arr[i].direction === 1) {
        inputs += 'link"></i>You requested</span>';
      }
      if (arr[i].direction === 2) {
        inputs += 'link"></i>Request received</span>';
      }
    }
    if (arr[i].status === 2) {
      if (arr[i].direction === 1) {
        inputs += 'check"></i>You paid</span>';
      }
      if (arr[i].direction === 2) {
        inputs += 'check"></i>You recieved</span>';
      }
    }

    inputs += '<i class="fas fa-chevron-right"></i></div></div >';

    if (arr[i].direction === 1) {
      inputs += '<p class="d-left">' + date + " " + time + "</p>";
    }
    if (arr[i].direction === 2) {
      inputs += '<p class="d-right">' + date + " " + time + "</p>";
    }

    var newDiv = document.createElement("div"); //created newDiv

    newDiv.innerHTML = inputs;
    document.getElementById("chat").appendChild(newDiv); //append the added inputs previously to parent "chat"

    //Onclick function will make visible the each transaction detail upon clicking
    //close icon will close the transaction detail pop up

    newDiv.onclick = function (event) {
      var modal = "";

      modal += "<h2 class='en'> Transaction History " + "</h2>";

      modal += "<h5 class='ev'> Transaction ID :" + arr[i].id + " " + "</h5>";
      modal +=
        "<h5 class='ev'> Amount         :" + arr[i].amount + " " + "</h5>";
      modal +=
        "<h5 class='ev'> Customer ID    :" +
        arr[i].customer.vPayId +
        " " +
        "</h5>";
      modal +=
        "<h5 class='ev'> Customer Email :" +
        arr[i].customer.vPay +
        " " +
        "</h5>";
      modal +=
        "<h5 class='ev'> Partner ID     :" +
        arr[i].partner.vPayId +
        " " +
        "</h5>";

      modal +=
        "<h5 class='ev'> Partner Email  :" +
        arr[i].partner.vPay +
        " " +
        "</h5>";

      modal +=
        "<h5 class='ev'> Description    :" + arr[i].description + " " + "</h5>";

      var mod = document.createElement("div");
      mod.innerHTML = modal;
      mod.id = "modal";

      document.getElementById("container").appendChild(mod);

      document.getElementById("cross").onclick = function (event) {
        event.preventDefault();

        if (document.getElementById("modal").style.display != "none") {
          document.getElementById("modal").remove();
        }
      };
    };
  }
}
