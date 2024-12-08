import React, { useState } from 'react';

function App() {
  const [originalImage, setOriginalImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [compressionRatio, setCompressionRatio] = useState(0.5);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setOriginalSize(file.size);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompress = async () => {
    // Call backend API to compress image
    const response = await fetch('/api/compress', {
      method: 'POST',
      body: JSON.stringify({ image: originalImage, ratio: compressionRatio }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    setCompressedImage(data.compressedImage);
    setCompressedSize(data.compressedSize);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>图片压缩</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {originalImage && (
        <div>
          <h2>原始图片</h2>
          <img src={originalImage} alt="Original" style={{ maxWidth: '100%' }} />
          <p>文件大小: {originalSize} bytes</p>
        </div>
      )}
      <div>
        <label>压缩比例: </label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={compressionRatio}
          onChange={(e) => setCompressionRatio(e.target.value)}
        />
      </div>
      <button onClick={handleCompress}>压缩图片</button>
      {compressedImage && (
        <div>
          <h2>压缩后的图片</h2>
          <img src={compressedImage} alt="Compressed" style={{ maxWidth: '100%' }} />
          <p>文件大小: {compressedSize} bytes</p>
          <a href={compressedImage} download="compressed-image.jpg">下载图片</a>
        </div>
      )}
    </div>
  );
}

export default App; 