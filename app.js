
const imgUpload = document.querySelector("#imgUpload");

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start)

async function start() {
    const container = document.createElement('div');
    container.style.position = 'relative' ;
    document.body.append(container);
    const LabeledFaceDescriptors = await loadLabeledImages();
    const faceMatcher = new faceapi.FaceMatcher(LabeledFaceDescriptors,0.6);
    console.log(container);
    console.log(imgUpload);

    imgUpload.addEventListener('change',async () => {

        const image = await faceapi.bufferToImage(imgUpload.files[0]);
        container.append(image);
        const canvas = faceapi.createCanvasFromMedia(image);
        container.append(canvas);
        const viewSize = { width:image.width,height:image.height };
        faceapi.matchDimensions(canvas,viewSize);

        const detections = await faceapi.detectAllFaces(image)
        .withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections,viewSize);

        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
        results.forEach( (result,i) => {
            const box = resizedDetections[i].detection.box
            const drawBox = new faceapi.draw.DrawBox (box, {label:result.toString()})
            drawBox.draw(canvas);
        })
        

    })

    
}

function loadLabeledImages() {
    const labels = ['David'];
    return Promise.all(
        labels.map(async label => {
            const descriptions = [];
            for( let i = 1; i <= 3; i++) {
                const img = await faceapi.fetchImage(`./labels/${label}/${i}.jpg`)
                const detections = await faceapi.detectSingleFace(img)
                .withFaceLandmarks().withFaceDescriptor();
                descriptions.push(detections.descriptor);
            }
            return new faceapi.LabeledFaceDescriptors(label,descriptions)
        })
    )
}

    
