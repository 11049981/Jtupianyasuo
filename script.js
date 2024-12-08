document.getElementById('upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function() {
                document.getElementById('originalImage').src = img.src;
                document.getElementById('originalSize').textContent = `原始大小: ${Math.round(file.size / 1024)} KB`;
                compressImage(img);
            };
        };
        reader.readAsDataURL(file);
    }
});

function compressImage(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const scaleFactor = 0.5; // 压缩比例
    canvas.width = img.width * scaleFactor;
    canvas.height = img.height * scaleFactor;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(function(blob) {
        const compressedUrl = URL.createObjectURL(blob);
        document.getElementById('compressedImage').src = compressedUrl;
        document.getElementById('compressedSize').textContent = `压缩大小: ${Math.round(blob.size / 1024)} KB`;
        document.getElementById('downloadBtn').onclick = function() {
            const a = document.createElement('a');
            a.href = compressedUrl;
            a.download = 'compressed_image.png';
            a.click();
        };
    }, 'image/png', 0.7);
} 