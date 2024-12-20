document.addEventListener('DOMContentLoaded', () => {
    const upload = document.getElementById('upload');
    const originalImage = document.getElementById('originalImage');
    const compressedImage = document.getElementById('compressedImage');
    const downloadBtn = document.getElementById('downloadBtn');
    const currentFormat = document.getElementById('currentFormat');
    const targetFormat = document.getElementById('targetFormat');
    
    // 格式化文件大小
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // 获取图片文件格式
    const getImageFormat = (file) => {
        return file.type.split('/')[1].toUpperCase();
    };

    // 更新图片信息显示
    const updateImageInfo = (image, sizeElement, dimensionsElement, fileSize) => {
        dimensionsElement.textContent = `尺寸: ${image.naturalWidth} × ${image.naturalHeight}`;
        sizeElement.textContent = `大小: ${formatFileSize(fileSize)}`;
    };

    // 压缩并转换图片格式
    const compressAndConvertImage = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // 显示原始图片信息
                originalImage.src = e.target.result;
                updateImageInfo(
                    img,
                    document.getElementById('originalSize'),
                    document.getElementById('originalDimensions'),
                    file.size
                );
                currentFormat.textContent = getImageFormat(file);

                // 创建canvas进行压缩和格式转换
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // 计算压缩后的尺寸（保持宽高比）
                let width = img.width;
                let height = img.height;
                const maxSize = 1200;
                
                if (width > maxSize || height > maxSize) {
                    if (width > height) {
                        height = Math.round(height * maxSize / width);
                        width = maxSize;
                    } else {
                        width = Math.round(width * maxSize / height);
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                // 根据选择的格式进行转换
                const quality = 0.7;
                const convertedImage = canvas.toDataURL(targetFormat.value, quality);
                
                // 显示压缩后的图片
                compressedImage.src = convertedImage;
                
                // 计算压缩后文件大小
                fetch(convertedImage)
                    .then(res => res.blob())
                    .then(blob => {
                        updateImageInfo(
                            compressedImage,
                            document.getElementById('compressedSize'),
                            document.getElementById('compressedDimensions'),
                            blob.size
                        );
                    });
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    // 文件上传处理
    upload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            compressAndConvertImage(file);
        }
    });

    // 格式转换处理
    targetFormat.addEventListener('change', () => {
        const file = upload.files[0];
        if (file) {
            compressAndConvertImage(file);
        }
    });

    // 下载处理
    downloadBtn.addEventListener('click', () => {
        if (compressedImage.src) {
            const link = document.createElement('a');
            link.download = `compressed_image.${targetFormat.value.split('/')[1]}`;
            link.href = compressedImage.src;
            link.click();
        }
    });
}); 