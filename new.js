const BASE_URL ="https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

let dropdowns = document.querySelectorAll(".dropdown select");
let buttons = document.querySelector("button");
let fromcurr = document.querySelector(".from select");
let tocurr = document.querySelector(".to select");
let msg = document.querySelector(".msg");

window.addEventListener("load", () => {
    updateExchangeRate();

})

for(let select of dropdowns){
    for(currcode in countryList){
        let newoption = document.createElement("option");
        newoption.innerText = currcode;
        newoption.value = currcode;

        if(select.name === "from" && currcode === "USD" ){
            newoption.selected = "selected";
        } else if(select.name === "to" && currcode === "INR" ){
            newoption.selected = "selected";
        }
        select.append(newoption);
    }
    select.addEventListener("change",(evt)=>{
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    let currcode = element.value;
    let countryCode = countryList[currcode];
    let newsrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newsrc;
}

buttons.addEventListener("click",(evt) => {
    evt.preventDefault();
    updateExchangeRate();
    
});

const updateExchangeRate = async () => {
    let amountVal = document.querySelector("input").value;
    if (amountVal === "" || amountVal < 1) {
        amountVal = 1;
    }

    let from = fromcurr.value.toLowerCase();
    let to = tocurr.value.toLowerCase();

    const URL = `${BASE_URL}/${from}/${to}.json`;

    try {
        let response = await fetch(URL);

        if (!response.ok) {
            throw new Error(`Currency pair not supported: ${from.toUpperCase()} → ${to.toUpperCase()}`);
        }

        let data = await response.json();
        let rate = data[from][to];
        let finalAmt = amountVal * rate;

        msg.innerText = `${amountVal} ${fromcurr.value} = ${finalAmt.toFixed(2)} ${tocurr.value}`;
    } catch (error) {
        console.error(error);
        msg.innerText = "⚠️ Conversion not available for this pair!";
    }
};
