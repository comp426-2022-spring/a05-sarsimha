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
    // Because we are using an event, we need to remove the default browser event, which is a reload.
        event.preventDefault();
    // Build up the endpoint URL
        const endpoint = "app/flip/coins/"
        const url = document.baseURI+endpoint
    // This extracts the data object from the form so we can run it through the FormData API
        const formEvent = event.currentTarget
    // Give the data to FormData and wait for a response or log an error to console.
        try {
            const formData = new FormData(formEvent);
    // Hand the form data off to the function that is actually going to interact with the API.
            const flips = await sendFlips({ url, formData });
    // Process the response and manipulate some elements in div#multi.
            console.log(flips);
    // Present the summary information.
            document.getElementById("heads").innerHTML = "Heads: "+flips.summary.heads;
            document.getElementById("tails").innerHTML = "Tails: "+flips.summary.tails;
    // This calls a function what will make a list of coin images based on the array of coin flip results.
    // See below for coinList() function.
        document.getElementById("coinlist").innerHTML = coinList(flips.raw);
        } catch (error) {
            console.log(error);
        }
    }
// Enter number and press button to activate coin flip series

// Guess a flip by clicking either heads or tails button
