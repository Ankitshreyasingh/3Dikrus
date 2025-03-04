import React, { useState } from 'react';

function UploadModel() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('model', file);
    formData.append('name', file.name);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Upload successful!');
      } else {
        setMessage('Upload failed.');
      }
    } catch (error) {
      setMessage('Error uploading file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h2>Upload 3D Model</h2>
      <input type="file" accept=".glb" onChange={handleUpload} disabled={uploading} />
      {uploading && <p>Uploading...</p>}
      {message && <p>{message}</p>}
    </div>
  );
}

export default UploadModel;
