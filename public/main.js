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
// Enter number and press button to activate coin flip series

// Guess a flip by clicking either heads or tails button
