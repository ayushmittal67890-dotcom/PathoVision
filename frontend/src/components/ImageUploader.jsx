import { useState, useCallback } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function ImageUploader() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [error, setError] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    if (file.type === "image/jpeg" || file.type === "image/jpg") {
      setFile(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
      setResult(null);
      setConfidence(null);
    } else {
      setError("Please upload a JPEG image.");
      setFile(null);
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setConfidence(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get prediction from server");
      }

      const data = await response.json();
      setResult(data.prediction);
      setConfidence(data.confidence);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setConfidence(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <div 
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ease-in-out
          ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 hover:border-slate-500 bg-slate-800/50'}
          ${file ? 'border-green-500/50 bg-green-500/5' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept=".jpg,.jpeg" 
          onChange={handleChange} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={loading}
        />
        
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          {!file ? (
            <>
              <div className="p-4 bg-slate-700/50 rounded-full">
                <UploadCloud className="w-10 h-10 text-blue-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-slate-200">Drag & Drop your image here</p>
                <p className="text-sm text-slate-400 mt-1">or click to browse (JPEG only)</p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center w-full">
              {preview && (
                <div className="relative w-48 h-48 mb-4 rounded-lg overflow-hidden border border-slate-600 shadow-xl">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex items-center space-x-2 text-green-400 font-medium">
                <CheckCircle className="w-5 h-5" />
                <span>Image selected</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 truncate max-w-full px-4">{file.name}</p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start space-x-3 text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-2xl transform transition-all duration-500">
          <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold mb-2">Prediction Result</p>
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            {result}
          </h3>
          {confidence && (
            <p className="text-sm text-green-400 font-medium mt-2">
              Confidence: {confidence}
            </p>
          )}
        </div>
      )}

      <div className="mt-6 flex space-x-3">
        {file && (
          <>
            <button
              onClick={reset}
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-lg font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              Reset
            </button>
            <button
              onClick={handleUpload}
              disabled={loading || !!result}
              className="flex-[2] flex items-center justify-center py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : result ? (
                'Analysis Complete'
              ) : (
                'Analyze Image'
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
