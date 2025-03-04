import React, { useState, useEffect } from "react";
import ModelViewer from "./components/ModelViewr";
import SearchBar from "./components/SearchBar";
import UploadModel from "./components/UploadModel";

const defaultThumbnail =
  "https://happenings.lpu.in/wp-content/uploads/2018/03/Top-5-Most-Expensive-Sneakers-in-the-World-2018-e1521003233131.jpg"; // Placeholder image

function App() {
  const defaultModels = [
    {
      name: "Nike Oneonta Next Nature",
      url: "/models/Nike Oneonta Next Nature.glb",
    },
    { name: "True Blue and Copper", url: "/models/True Blue and Copper.glb" },
    { name: "Air Jordan 1 Low", url: "/models/Air Jordan 1 Low.glb" },
    { name: "Jordan Hex Mule", url: "/models/Jordan Hex Mule.glb" },
    { name: "Nike Air Max 97 SE", url: "/models/Nike Air Max 97 SE.glb" },
  ];

  const [modelList, setModelList] = useState(defaultModels); // Models from backend + default models
  const [selectedModel, setSelectedModel] = useState(defaultModels[0]); // Default selected model
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false); // Controls modal visibility

  // Fetch models from backend on mount
  useEffect(() => {
    fetch("http://localhost:5000/models")
      .then((res) => res.json())
      .then((data) => {
        setModelList((prevModels) => [...prevModels, ...data]); // Append backend models
      })
      .catch((error) => console.error("Error fetching models:", error));
  }, []);

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
  };

  const handleDownload = (modelUrl, modelName) => {
    const link = document.createElement("a");
    link.href = modelUrl;
    link.download = `${modelName}.glb`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add new uploaded model to the list
  const handleUploadSuccess = (newModel) => {
    setModelList((prevModelList) => [...prevModelList, newModel]);
    setShowUploadModal(false); // Close modal after upload
  };

  // Filter models based on search term
  const filteredModels = modelList.filter((model) =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>3D Model Viewer</h1>

      {/* Upload Button */}
      <button
        onClick={() => setShowUploadModal(true)}
        style={{
          marginBottom: "10px",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Upload Model
      </button>

      {/* Search Bar */}
      <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          onClick={() => {
            console.log("Closing modal..."); // Debugging
            setShowUploadModal(false);
          }}
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation(); // Prevents modal from closing when clicking inside
            }}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "400px",
              textAlign: "center",
            }}
          >
            <UploadModel onUploadSuccess={handleUploadSuccess} />

            {/* Close Button */}
            <button
              onClick={() => {
                console.log("Close button clicked!"); // Debugging
                setShowUploadModal(false);
              }}
              style={{
                marginTop: "10px",
                padding: "5px 15px",
                fontSize: "14px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Shoe List Container */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        {filteredModels.map((model) => (
          <div
            key={model.name}
            onClick={() => handleModelSelect(model)}
            style={{
              cursor: "pointer",
              border:
                selectedModel?.name === model.name
                  ? "3px solid blue"
                  : "1px solid gray",
              padding: "10px",
              borderRadius: "10px",
              textAlign: "center",
              width: "180px",
              background: "#f5f5f5",
            }}
          >
            <img
              src={defaultThumbnail}
              alt={model.name}
              style={{
                width: "100%",
                height: "120px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
            <p>{model.name}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(model.url, model.name);
              }}
              style={{
                marginTop: "5px",
                padding: "5px 10px",
                fontSize: "12px",
                cursor: "pointer",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Download
            </button>
          </div>
        ))}
      </div>

      {/* 3D Viewer Section */}
      {selectedModel && (
        <div
          style={{
            width: "100%",
            height: "500px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ModelViewer modelUrl={selectedModel.url} />
        </div>
      )}
    </div>
  );
}

export default App;
