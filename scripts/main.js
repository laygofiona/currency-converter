
// Selectors

const amountInput = document.getElementsByTagName("input")[0];
const baseCurrency = document.getElementsByTagName("select")[0];
const targetCurrency = document.getElementsByTagName("select")[1];
const convertBtn = document.getElementsByTagName("button")[0];
const amountOutput = document.getElementsByTagName("p")[0];

let amount;
amountInput.style.boxShadow = "";
amountInput.value = "";
// Set default base currency value
baseCurrency.value = "EUR";
let baseCurrencyVal = "EUR";
// Set default target currency value
targetCurrency.value = "KRW";
let targetCurrencyVal = "KRW";



const checkIfAmountValid = (amount) => {
    // Check if amount is a number
    try 
    {
        // Convert amount to Number first
        amount = Number(amount);
        // If NaN is not returned
        if (amount != 'NaN')
        {
            // If amount is greater than 0
            if (amount > 0)
            {
                return true;
            }
        }

    }
    catch (e)
    {
        // Catch any syntax errors
        console.log(e.message);
    }
    
    // Otherwise return false
    return false;
}

const displayConversion = (data) => {
    amountOutput.innerHTML = `= ${targetCurrencyVal} ${data}`;
}

amountInput.addEventListener("input", (e) => {
    amount = e.target.value;
})

// Listen for when an option is selected
baseCurrency.addEventListener("input", (e) => {
    // Set baseCurrencyVal to selected option
    baseCurrencyVal = `${e.target.value}`;
})

// Listen for when an option is selected
targetCurrency.addEventListener("input", (e) => {
    // Set targetCurrencyVal to selected option
    targetCurrencyVal = `${e.target.value}`;
})

// Listen for when the convert button is clicked
convertBtn.addEventListener("click", (e) => {
    // If button is clicked and the input amount is valid (is a number and greater than 0)
    if(checkIfAmountValid(amount))
    {
        // If amount is numeric or valid convert amount to Number
        amount = Number(amount);
        amountInput.style.boxShadow = "";
        // Then convert currency, otherwise print error message
        convertCurrency(baseCurrencyVal, targetCurrencyVal, amount)
            .then(displayConversion)
            .catch((err) => console.log(err.message));
    }
    else
    {
         // Else set amount to null
         amount = null;
         // Display error box shadow
         amountInput.style.boxShadow = "0 0 .5em .1em #C91D2B";
    }
})

// Helper function for convertCurrency
function handleErrors(response) {
    // If response status code is not successful (200)
    if (!response.ok) {
        // Throw error
      throw Error(response.statusText);
    }

    // Otherwise return data as JSON
    return response.json();
  }

  // Async function to extract data from foreign currency API
const convertCurrency = async (from, to, amount) => {
    
    const API_key = "fca_live_84UPAWT4d1UO562qzLbI3NLmuflxfqtPEGIuwPc7";
    const url = `https://api.freecurrencyapi.com/v1/latest?apikey=${API_key}&currencies=${to}&base_currency=${from}`;
    // Send request using Fetch API
    const response = await fetch(url);
    // Receive data and check for errors
    const data = await handleErrors(response);
    // Get conversion rate and multiply it by specified amount
    const conversion = data.data[to] * amount;
    // Return rounded conversion (2 decimal places)
    return Math.round(conversion * 100) / 100;
}