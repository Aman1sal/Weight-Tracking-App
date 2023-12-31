let lineChart;
let weights;

const blocker = document.querySelector("#blocker");
const modal = document.querySelector("#modal");

window.addEventListener("load", () => {
    manageLocalStorage();
    updateLatestWeightIn();

    const ctx = document.querySelector("#chart");

    lineChart = new Chart(ctx, {
        type: "line",
        data: {
            datasets: [{
                data: weights.weights,
                borderWidth: 2,
                borderColor: "#D49D37",
                pointStyle: false,
                cubicInterpolationMode: "monotone"
            }]
        },
        options: {
            parsing: {
                xAxisKey: "day",
                yAxisKey: "weight"
            },
            scales: {
                y: {
                    border: {
                        display: false
                    }
                },
                x: {
                    display: false
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    label: "Weight",
                    callbacks: {
                        label: function (context) {
                            let label;

                            if (context.parsed.y) {
                                label = context.parsed.y + "lbs";
                            }

                            return label;
                        }
                    }
                }
            }
        }
    });
});

const manageLocalStorage = () =>{
    weights = JSON.parse(localStorage.getItem("weights"));

    if(!weights){
        localStorage.setItem("weights", JSON.stringify({ weights: []}));
        weights = {weights: []}
    }
}

const openModal = (e) =>{
    blocker.style.display = "block";
    modal.style.display = "flex";

    AnimationEffect({
        targets: modal,
        duration: 500,
        translateY: [50, 0],
        opacity: [0,1],
        easing: "easeOutElastic(2, 0.6)"
    })
}

const closeModal = (e) =>{
    blocker.style.display = "none";
    modal.style.display = "none";
}

const sendWeight = () => {
    let weight = parseInt(
        document.querySelector("#weight").value
    )
    let day = document.querySelector("#day").value;

    weights.weights.push({
        day: new Date(day).toISOString().split("T")[0],
        weight: weight
    });

    // If user inputs past dates
    weights.weights.sort(function(a, b){
        return new Date(a.day) - new Date(b.day);
    });

    if(weight){
        localStorage.setItem("weights", JSON.stringify(weights));
        closeModal();
        // for new data chart should be reloaded
        lineChart.update("reset");
        lineChart.update("show");
        updateLatestWeightIn();
    }
}

const updateLatestWeightIn = () =>{
    const latestDay = document.querySelector("#latest-day");
    const latestWeight = document.querySelector("#latest-weight");
    const latestWeightIn = weights.weights[weights.weights.length - 1];

    latestDay.innerHTML = latestWeightIn ? latestWeightIn.day : "-";
    latestWeight.innerText = latestWeightIn ? latestWeightIn.weight + "kgs": "-";
}

document.querySelector("#btn").addEventListener(
    "click",
    openModal
);
blocker.addEventListener(
    "click",
    closeModal
);

document.querySelector("#confirm").addEventListener(
    "click",
    sendWeight
);