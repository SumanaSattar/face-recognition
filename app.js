
const imgUpload = document.querySelector("#imgUpload");

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start)

function start() {
    const container = document.createElement('div');
    container.style.position = 'relative' ;
    document.body.append(container);
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
        resizedDetections.forEach( detection => {
            const box = detection.detection.box
            const drawBox = new faceapi.draw.DrawBox (box, {label:'Face'})
            drawBox.draw(canvas);
        })
        

    })

    
}

function loadLabeledImages() {
    const labels = ['David']
}

    
