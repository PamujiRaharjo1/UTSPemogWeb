const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let wasm;

fetch('grayscale.wasm').then(response =>
    response.arrayBuffer()
).then(bytes =>
    WebAssembly.instantiate(bytes, {
        env: {
            memory: new WebAssembly.Memory({ initial: 256 }),
        }
    })
).then(results => {
    wasm = results.instance.exports;
    console.log('WASM Loaded');
});

document.getElementById('fileInput').addEventListener('change', async function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;
        const len = data.length;

        // Allocate memory in WASM
        const ptr = wasm._malloc(len);
        const memory = new Uint8Array(wasm.memory.buffer, ptr, len);
        memory.set(data);

        // Call grayscale
        wasm._grayscale(ptr, len);

        // Copy back the result
        data.set(memory);
        ctx.putImageData(imageData, 0, 0);

        wasm._free(ptr);
    };
});
        