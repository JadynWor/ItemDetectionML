const URL = "https://teachablemachine.withgoogle.com/models/x6SdF62T4/";


let model, webcam, labelContainer, maxPredictions;

async function init() {
    // ... (your existing init function) ...
}

function startFileInput() {
    document.getElementById("fileInput").click();
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    const img = new Image();
    const reader = new FileReader();

    reader.onload = function (e) {
        img.src = e.target.result;
        img.onload = function () {
            displayImage(img);
            predictImage(img);
        };
    };

    reader.readAsDataURL(file);
}

function displayImage(img) {
    const imageContainer = document.getElementById("image-container");
    imageContainer.innerHTML = ''; // Clear previous images

    const newImg = document.createElement("img");
    newImg.src = img.src;
    newImg.style.width = "500px"; // Set width for display
    newImg.style.length = "auto"; // maintain aspect ratio
    imageContainer.appendChild(newImg);
}

async function predictImage(img) {
// Load the model if not loaded yet
if (!model) {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}

// Run prediction
const prediction = await model.predict(img);

// Display predictions with progress bars
const progressBarsContainer = document.getElementById("progress-bars");
progressBarsContainer.innerHTML = '';

for (let i = 0; i < maxPredictions; i++) {
    console.log(prediction[i].className); // Log the class names

    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";
    progressBar.innerHTML = `
        <div class="progress">
            <div class="progress-bar ${prediction[i].className === 'Unsafe' ? 'bg-danger' : 'bg-primary'}" 
                role="progressbar" style="width: ${prediction[i].probability * 100}%" 
                aria-valuenow="${prediction[i].probability * 100}" 
                aria-valuemin="0" aria-valuemax="100">
                ${prediction[i].className}: ${(prediction[i].probability * 100).toFixed(2)}%
            </div>
        </div>`;
    progressBarsContainer.appendChild(progressBar);
}
}