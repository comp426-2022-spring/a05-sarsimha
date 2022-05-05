// Focus div based on nav button click
// Flip one coin and show coin image to match result when button clicked
const coin = document.getElementById("coin")
coin.addEventListener("click", flipCoin)
async function flipCoin() {
    //building endpoint url 
        const endpoint = "app/flip/"
        const url = document.baseURI+endpoint
        await fetch(url)
            .then(function(response) {
             return response.json();
                })
            .then(function(result) {
                console.log(result);
                document.getElementById("result").innerHTML = result.flip;
                document.getElementById("quarter").setAttribute("src", "assets/img/"+result.flip+".png");
                });
      };
// Flip multiple coins and show coin images in table as well as summary results
const coins = document.getElementById("coins")
coins.addEventListener("submit", flipCoins)
async function flipCoins(event) {
    // remove the default browser event
        event.preventDefault();
    // Build endpoint URL
        const endpoint = "app/flip/coins/"
        const url = document.baseURI+endpoint
    //extracts data object from  form so it runs on FormData API
        const formEvent = event.currentTarget
    // Give data to FormData and wait for a response or log an error to console.
        try {
            const formData = new FormData(formEvent);
    // Hand form data off to function interacting with the API.
            const flips = await sendFlips({ url, formData });
    // Process response and manipulate elements
            console.log(flips);
    //summary information.
            document.getElementById("heads").innerHTML = "Heads: "+flips.summary.heads;
            document.getElementById("tails").innerHTML = "Tails: "+flips.summary.tails;
    // See below for coinList() function.
        document.getElementById("coinlist").innerHTML = coinList(flips.raw);
        } catch (error) {
            console.log(error);
        }
    }
// Enter number and press button to activate coin flip series
// Guess a flip by clicking either heads or tails button
const call = document.getElementById("call")
call.addEventListener("submit", flipCall)

async function flipCall(event) {
    // Prevent default reload.
        event.preventDefault();
        const endpoint = "app/flip/call/"
        const url = document.baseURI+endpoint
        const formEvent = event.currentTarget
        try {
            const formData = new FormData(formEvent); 
            const results = await sendFlips({ url, formData });
    // Process  results.
            console.log(results);
    // show text results
            document.getElementById("choice").innerHTML = "Guess: "+results.call;
            document.getElementById("actual").innerHTML = "Actual: "+results.flip;
            document.getElementById("results").innerHTML = "Result: "+results.result;
        }
        catch (error) {
            console.log(error);
        }
        //show console log what's going on 
        console.log(formDataJson);
        //set up fetching request object
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: formDataJson
        };
        // Send req and wait for res
	    const response = await fetch(url, options);
        // Pass res to event handler
        return response.json()

    }

async function sendFlips({ url, formData }) {
    //extract data and turn into json
    const plainFormData = Object.fromEntries(formData.entries());
    const formDataJson = JSON.stringify(plainFormData);
}

//Navigation Buttons
function homeNav() {
    document.getElementById("homenav").className = "active";
    document.getElementById("home").className = "active";
    document.getElementById("singlenav").className = "";
    document.getElementById("single").className = "inactive";
    document.getElementById("multinav").className = "";
    document.getElementById("multi").className = "inactive";
    document.getElementById("guessnav").className = "";
    document.getElementById("guesscoin").className = "inactive";
  }
  function singleNav() {
    document.getElementById("homenav").className = "";
    document.getElementById("home").className = "inactive";
    document.getElementById("singlenav").className = "active";
    document.getElementById("single").className = "active";
    document.getElementById("multinav").className = "";
    document.getElementById("multi").className = "inactive";
    document.getElementById("guessnav").className = "";
    document.getElementById("guesscoin").className = "inactive";
  }
  function multiNav() {
    document.getElementById("homenav").className = "";
    document.getElementById("home").className = "inactive";
    document.getElementById("singlenav").className = "";
    document.getElementById("single").className = "inactive";
    document.getElementById("multinav").className = "active";
    document.getElementById("multi").className = "active";
    document.getElementById("guessnav").className = "";
    document.getElementById("guesscoin").className = "inactive";
  }
  function guessNav() {
    document.getElementById("homenav").className = "";
    document.getElementById("home").className = "inactive";
    document.getElementById("singlenav").className = "";
    document.getElementById("single").className = "inactive";
    document.getElementById("multinav").className = "";
    document.getElementById("multi").className = "inactive";
    document.getElementById("guessnav").className = "active";
    document.getElementById("guesscoin").className = "active";
  } 