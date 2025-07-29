import React, { useState } from 'react';
import '../components/css/history.css';

const Upload_history = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      setError('Please select a file.');
      setFile(null);
      return;
    }

    // ✅ File type validation
    const allowedTypes = ['application/zip', 'application/x-zip-compressed'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Only ZIP files are allowed.');
      setFile(null);
      return;
    }

    // ✅ File size validation (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      setError('File size must be less than 5MB.');
      setFile(null);
      return;
    }

    setError('');
    setFile(selectedFile);
    console.log('Valid file selected:', selectedFile.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!file) {
      setError('No file selected to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file); // Must match @RequestParam("file")

    try {
      const response = await fetch('http://localhost:8080/api/files/uploadZip', {
        method: 'POST',
        body: formData,
        // 🚫 Don't set Content-Type — browser handles it
      });

      if (response.ok) {
        const result = await response.text();
        setMessage(`✅ ${result}`);
        setFile(null);
      } else {
        const errorText = await response.text();
        setMessage(`❌ ${errorText}`);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setMessage('❌ Something went wrong while uploading.');
    }
  };

  return (
    <section id='uhistory'>
      <div className='outerContainer' style={{ width: '18rem', margin: '0 auto' }}>
        <div className="upload-container">
          <div className="folder">
            <div className="front-side">
              <div className="tip" />
              <div className="cover" />
            </div>
            <div className="back-side cover" />
          </div>
          <form onSubmit={handleSubmit}>
            <label className="custom-file-upload">
              <input className="title" type="file" onChange={handleFileChange} />
              Choose a ZIP file
            </label>

            <button type="submit" className='btn custom-file-upload mt-1'>Submit</button>

            {/* ⚠️ Error Message */}
            <center>{error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}</center>
            <center>{file && <p style={{ color: '#076780ff', marginTop: '10px' }}>Selected: {file.name}</p>}</center>
            <center>{message && <p style={{ color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}</center>
          </form>
        </div>
      </div>

      <div className='Instruction'>
        <center>
          <h5>Instructions:</h5>
          <div style={{ marginTop: '20px', textAlign: 'center', maxWidth: '300px', marginInline: 'auto', color: '#333', fontSize: '0.95rem' }}>
            <p><strong>How to upload your YouTube history:</strong></p>
            <ol style={{ textAlign: 'left', paddingLeft: '20px' }}>
              <li>Visit <a href="https://takeout.google.com/" target="_blank" rel="noopener noreferrer">Google Takeout</a>.</li>
              <li>Select only <strong>YouTube and YouTube Music</strong>.</li>
              <li>Click <strong>Next step</strong> &gt; choose <strong>.ZIP</strong> format.</li>
              <li>Download the ZIP file once it's ready.</li>
              <li>Upload that ZIP file here.</li>
            </ol>
          </div>
        </center>
      </div>
    </section>
  );
};

export default Upload_history;
