
var priceInp = document.getElementById("price-min")
document.getElementById("value").innerHTML = `${priceInp.value}`


priceInp.addEventListener("change", () => {
    changeTheValue(priceInp.value)
})

function changeTheValue(value) {
    document.getElementById("value").innerHTML = `${value}`
}

// Wait for the DOM to be ready
