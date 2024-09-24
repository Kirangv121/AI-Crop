 import React, { useEffect, useState, useRef } from 'react';
import './Dashboard.css'; // Import your CSS file
import imageCompression from 'browser-image-compression'; // Import the image compression library

const Dashboard = () => {
  const [profileName, setProfileName] = useState('User Name');
  const [profileEmail, setProfileEmail] = useState('user@example.com');
  const [profileImage, setProfileImage] = useState('defaultProfile.jpg');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [diseasePrediction, setDiseasePrediction] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    loadProfile();
    setupCamera();
    return () => stopCamera(); // Clean up camera stream
  }, []);

  const loadProfile = () => {
    const name = localStorage.getItem('name') || 'Kiran';
    const email = localStorage.getItem('email') || 'kiran@example.com';
    const image = localStorage.getItem('image') || 'defaultProfile.jpg';
    
    setProfileName(name);
    setProfileEmail(email);
    setProfileImage(image);
  };

  const toggleSidebar = () => setSidebarOpen(prevState => !prevState);
  const toggleProfileModal = () => setProfileModalOpen(prevState => !prevState);

  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error accessing the camera: ", error);
      alert("Could not access camera. Please ensure you have granted permission.");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const captureImage = async () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/png');
    await compressAndStoreImage(imageData);
    analyzeImage(imageData);
  };

  const compressAndStoreImage = async (imageData) => {
    try {
      const response = await fetch(imageData);
      const blob = await response.blob();

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(blob, options);
      const reader = new FileReader();

      reader.onloadend = () => {
        localStorage.setItem('image', reader.result);
        setCapturedImage(reader.result); // Set the compressed image
        setUploadedImage(null); // Clear the uploaded image if any
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Image compression failed:', error);
    }
  };

  const analyzeImage = (imageData) => {
    setDiseasePrediction('Example Disease Detected'); // Simulate analysis
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      try {
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();

        reader.onloadend = () => {
          localStorage.setItem('image', reader.result);
          setUploadedImage(reader.result); // Update uploaded image
          setCapturedImage(null); // Clear the captured image if any
          analyzeImage(reader.result); // Analyze the uploaded image
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Image upload and compression failed:', error);
      }
    }
  };

  return (
    <div className={`dashboard-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <header>
        <div className="logo">CropAI</div>
        <button className="toggle-btn" onClick={toggleSidebar}>☰ Menu</button>
        <nav className="navbar">
          {['Dashboard', 'Disease Prediction', 'History', 'Help', 'Contact', 'Feedback', 'Settings'].map((link, index) => (
            <button key={index} className="nav-link">{link}</button>
          ))}
        </nav>
        <div className="profile" onClick={toggleProfileModal}>
          <img src={profileImage} alt={profileName} className="profile-logo" />
        </div>
      </header>

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <ul>
          {['Overview', 'Predictions', 'Management', 'Reports', 'Analytics'].map((link, index) => (
            <li key={index}><button className="sidebar-link">{link}</button></li>
          ))}
        </ul>
      </aside>

      <main>
        <h1>Dashboard</h1>
        <section className="dashboard">
          <h2>Welcome, {profileName}</h2>
          <div className="dashboard-cards">
            {['Recent Predictions', 'Active Alerts', 'Recommended Actions'].map((title, index) => (
              <div key={index} className="card">
                <h3>{title}</h3>
                <p>See the latest information related to {title.toLowerCase()}.</p>
              </div>
            ))}
          </div>

          <div className="map">
            <h2>Interactive Map</h2>
            <p>View affected areas on the map.</p>
          </div>

          <section className="image-capture">
            <h2>Disease Prediction</h2>
            <div className="video-container">
              <video ref={videoRef} autoPlay className="video-preview"></video>
              <button className="capture-button" onClick={captureImage}>Capture Image</button>
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
            {capturedImage && !uploadedImage && <img src={capturedImage} alt="Captured" className="captured-img" />}
            {uploadedImage && !capturedImage && <img src={uploadedImage} alt="Uploaded" className="uploaded-img" />}
            {diseasePrediction && <p>Predicted Disease: {diseasePrediction}</p>}

            <h2>Upload Image</h2>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </section>
        </section>
      </main>

      {profileModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleProfileModal}>&times;</span>
            <h2>Profile Information</h2>
            <p>Name: <span>{profileName}</span></p>
            <p>Email: <span>{profileEmail}</span></p>
            <img src={profileImage} alt={`Profile image of ${profileName}`} className="modal-profile-img" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
