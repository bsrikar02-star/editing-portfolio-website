import React, { useState, useEffect, useRef, useCallback } from "react";
import "./admin.css";

// Fetch directly from API server so it works regardless of Vite port
const API = "http://127.0.0.1:3001";

// ── Auth ─────────────────────────────────────────────────────────
const CREDS = { username: "srikar", password: "srikar2006" };
const SESSION_KEY = "adm_session";

function isAuthed() {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

// ── Toast ────────────────────────────────────────────────────────
function Toast({ msg, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return <div className={`adm-toast ${type}`}>{msg}</div>;
}

// ── Login ────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (user === CREDS.username && pass === CREDS.password) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onLogin();
    } else {
      setErr("Invalid username or password.");
    }
  }

  return (
    <div className="adm-login-bg">
      <div className="adm-login-grid" />
      <form className="adm-login-card" onSubmit={handleSubmit}>
        <div className="adm-login-logo">ADy</div>
        <div className="adm-login-subtitle">Admin Portal</div>

        <div className="adm-field">
          <label className="adm-label">Username</label>
          <input
            className="adm-input"
            type="text"
            autoComplete="username"
            value={user}
            onChange={(e) => { setUser(e.target.value); setErr(""); }}
            placeholder="Enter username"
          />
        </div>
        <div className="adm-field">
          <label className="adm-label">Password</label>
          <input
            className="adm-input"
            type="password"
            autoComplete="current-password"
            value={pass}
            onChange={(e) => { setPass(e.target.value); setErr(""); }}
            placeholder="Enter password"
          />
        </div>

        {err && <div className="adm-error">{err}</div>}
        <button className="adm-btn" type="submit">Sign In</button>
      </form>
    </div>
  );
}

// ── Thumbnail Modal ───────────────────────────────────────────────
function ThumbnailModal({ video, onClose, onSaved, toast }) {
  const videoRef = useRef(null);
  const [saving, setSaving] = useState(false);

  function captureFrame() {
    const v = videoRef.current;
    if (!v) return;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth || 1280;
    canvas.height = v.videoHeight || 720;
    canvas.getContext("2d").drawImage(v, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
    saveCapture(dataUrl);
  }

  async function saveCapture(dataUrl) {
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/videos/${video.id}/thumbnail/capture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl }),
      });
      const updated = await res.json();
      onSaved(updated);
      toast("Thumbnail saved!", "success");
      onClose();
    } catch {
      toast("Failed to save thumbnail.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage(file) {
    setSaving(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch(`${API}/api/videos/${video.id}/thumbnail`, {
        method: "PUT",
        body: form,
      });
      const updated = await res.json();
      onSaved(updated);
      toast("Thumbnail saved!", "success");
      onClose();
    } catch {
      toast("Failed to upload thumbnail.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="adm-modal-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="adm-modal">
        <div className="adm-modal-header">
          <span className="adm-modal-title">Set Thumbnail — {video.label}</span>
          <button className="adm-btn icon-btn" onClick={onClose}>✕</button>
        </div>
        <div className="adm-modal-body">
          {/* Live video preview to capture frame */}
          <div className="adm-thumb-video-wrap">
            <video
              ref={videoRef}
              src={video.src}
              controls
              muted
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>

          <div className="adm-thumb-capture-bar">
            <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
              Pause the video at the frame you want, then:
            </span>
          </div>

          <div className="adm-thumb-options">
            {/* Option 1: Capture frame */}
            <div className="adm-thumb-option" onClick={captureFrame} style={{ cursor: saving ? "wait" : "pointer" }}>
              <span className="adm-thumb-option-icon">🎬</span>
              <div className="adm-thumb-option-title">{saving ? "Saving…" : "Capture Frame"}</div>
              <div className="adm-thumb-option-desc">Use the current paused frame as thumbnail</div>
            </div>

            {/* Option 2: Upload image */}
            <label className="adm-thumb-option" style={{ cursor: "pointer" }}>
              <span className="adm-thumb-option-icon">🖼️</span>
              <div className="adm-thumb-option-title">Upload Image</div>
              <div className="adm-thumb-option-desc">Choose any JPG or PNG from your laptop</div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files[0] && uploadImage(e.target.files[0])}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Video Row ─────────────────────────────────────────────────────
function VideoRow({ video, index, total, onMove, onDelete, onThumb, onLabelChange, dragHandlers }) {
  const [label, setLabel] = useState(video.label);

  function handleLabelBlur() {
    if (label !== video.label) onLabelChange(video.id, label);
  }

  return (
    <div
      className={`adm-video-row ${dragHandlers.draggingId === video.id ? "dragging" : ""} ${dragHandlers.dragOverId === video.id ? "drag-over" : ""}`}
      draggable
      onDragStart={() => dragHandlers.onDragStart(video.id)}
      onDragOver={(e) => { e.preventDefault(); dragHandlers.onDragOver(video.id); }}
      onDrop={() => dragHandlers.onDrop(video.id)}
      onDragEnd={dragHandlers.onDragEnd}
    >
      {/* Drag handle */}
      <div className="adm-drag-handle" title="Drag to reorder">⠿</div>

      {/* Thumbnail preview */}
      <div className="adm-thumb-preview" onClick={() => onThumb(video)}>
        {video.thumbnail
          ? <img src={video.thumbnail} alt={video.label} />
          : <video src={video.src} muted preload="metadata" />
        }
        <div className="adm-thumb-preview-overlay">
          <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", color: "#fff" }}>SET THUMB</span>
        </div>
      </div>

      {/* Info + editable label */}
      <div className="adm-video-info">
        <input
          className="adm-video-label-input"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleLabelBlur}
          title="Click to rename"
        />
        <div className="adm-video-meta">#{index + 1} of {total}</div>
      </div>

      {/* Actions */}
      <div className="adm-video-actions">
        <div className="adm-order-btns">
          <button className="adm-btn icon-btn" onClick={() => onMove(index, -1)} disabled={index === 0} title="Move up">▲</button>
          <button className="adm-btn icon-btn" onClick={() => onMove(index, 1)} disabled={index === total - 1} title="Move down">▼</button>
        </div>
        <button className="adm-btn icon-btn" onClick={() => onThumb(video)} title="Set thumbnail" style={{ color: "var(--gold)" }}>🖼</button>
        <button className="adm-btn danger" onClick={() => onDelete(video.id)}>Delete</button>
      </div>
    </div>
  );
}

// ── Upload Tab ────────────────────────────────────────────────────
function UploadTab({ onUploaded, toast }) {
  const [file, setFile] = useState(null);
  const [label, setLabel] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragover, setDragover] = useState(false);

  function handleFileSelect(f) {
    if (!f || !f.type.startsWith("video/")) {
      toast("Please select a video file.", "error");
      return;
    }
    setFile(f);
    // Auto-fill label from filename (strip extension)
    const name = f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
    setLabel(name.charAt(0).toUpperCase() + name.slice(1));
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setProgress(0);

    // Use XHR for progress
    const form = new FormData();
    form.append("file", file);
    form.append("label", label || file.name);

    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (ev) => {
      if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100));
    });
    xhr.addEventListener("load", () => {
      try {
        const result = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
          onUploaded(result);
          toast(`"${result.label}" added to portfolio!`, "success");
          setFile(null);
          setLabel("");
          setProgress(0);
        } else {
          toast(result.error || "Upload failed.", "error");
        }
      } catch {
        toast("Upload failed.", "error");
      }
      setUploading(false);
    });
    xhr.addEventListener("error", () => {
      toast("Upload failed. Is the API server running?", "error");
      setUploading(false);
    });
    xhr.open("POST", `${API}/api/videos`);
    xhr.send(form);
  }

  function formatSize(bytes) {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div>
      <p className="adm-section-title">Add New Video</p>

      {/* Drop zone */}
      <div
        className={`adm-dropzone ${dragover ? "dragover" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
        onDragLeave={() => setDragover(false)}
        onDrop={(e) => { e.preventDefault(); setDragover(false); handleFileSelect(e.dataTransfer.files[0]); }}
      >
        <span className="adm-dropzone-icon">🎞️</span>
        <div className="adm-dropzone-title">{file ? "File selected" : "Drop your video here"}</div>
        <div className="adm-dropzone-sub">{file ? file.name : "or click to browse — MP4, MOV, WebM"}</div>
        {!file && (
          <input
            type="file"
            accept="video/*"
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />
        )}
      </div>

      {file && (
        <form className="adm-upload-form" onSubmit={handleUpload}>
          {/* File info */}
          <div className="adm-upload-preview">
            <span className="adm-upload-preview-icon">🎬</span>
            <div>
              <div className="adm-upload-preview-name">{file.name}</div>
              <div className="adm-upload-preview-size">{formatSize(file.size)}</div>
            </div>
            {!uploading && (
              <button
                type="button"
                className="adm-btn icon-btn"
                style={{ marginLeft: "auto" }}
                onClick={() => { setFile(null); setLabel(""); }}
              >✕</button>
            )}
          </div>

          {/* Label */}
          <div className="adm-field">
            <label className="adm-label">Video Title</label>
            <input
              className="adm-input"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Cinematic Wedding Reel"
            />
          </div>

          {/* Progress */}
          {uploading && (
            <div>
              <div className="adm-progress">
                <div className="adm-progress-bar" style={{ width: `${progress}%` }} />
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 6 }}>
                Uploading… {progress}%
              </p>
            </div>
          )}

          <div style={{ display: "flex", gap: 12 }}>
            <button className="adm-btn" type="submit" disabled={uploading} style={{ flex: 1 }}>
              {uploading ? `Uploading ${progress}%…` : "Upload to Portfolio"}
            </button>
            {!uploading && (
              <button
                type="button"
                className="adm-btn secondary"
                onClick={() => { setFile(null); setLabel(""); }}
              >Cancel</button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

// ── Manage Tab ────────────────────────────────────────────────────
function ManageTab({ videos, setVideos, toast }) {
  const [thumbTarget, setThumbTarget] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const saveTimeout = useRef(null);

  async function saveOrder(newVideos) {
    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      try {
        await fetch(`${API}/api/videos/order`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: newVideos.map((v) => v.id) }),
        });
      } catch {
        toast("Failed to save order.", "error");
      }
    }, 600);
  }

  function move(index, dir) {
    const next = [...videos];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setVideos(next);
    saveOrder(next);
    toast("Order updated!", "success");
  }

  async function handleDelete(id) {
    if (!window.confirm("Remove this video from the portfolio?")) return;
    try {
      await fetch(`${API}/api/videos/${id}`, { method: "DELETE" });
      const updated = videos.filter((v) => v.id !== id);
      setVideos(updated);
      toast("Video removed.", "success");
    } catch {
      toast("Failed to delete.", "error");
    }
  }

  async function handleLabelChange(id, newLabel) {
    try {
      const res = await fetch(`${API}/api/videos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel }),
      });
      const updated = await res.json();
      setVideos((prev) => prev.map((v) => (v.id === id ? updated : v)));
      toast("Title updated!", "success");
    } catch {
      toast("Failed to update title.", "error");
    }
  }

  function handleThumbSaved(updated) {
    setVideos((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
  }

  // Drag & Drop handlers
  const dragHandlers = {
    draggingId,
    dragOverId,
    onDragStart: (id) => setDraggingId(id),
    onDragOver: (id) => setDragOverId(id),
    onDragEnd: () => { setDraggingId(null); setDragOverId(null); },
    onDrop: (targetId) => {
      if (!draggingId || draggingId === targetId) return;
      const next = [...videos];
      const fromIdx = next.findIndex((v) => v.id === draggingId);
      const toIdx = next.findIndex((v) => v.id === targetId);
      const [item] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, item);
      setVideos(next);
      saveOrder(next);
      toast("Order updated!", "success");
      setDraggingId(null);
      setDragOverId(null);
    },
  };

  return (
    <div>
      <p className="adm-section-title">Drag rows or use ▲▼ to reorder · click a thumbnail to change it</p>
      <div className="adm-video-list">
        {videos.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--muted)", border: "1px dashed var(--border)", borderRadius: "var(--radius-lg)" }}>
            <div style={{ fontSize: "2rem", marginBottom: 12 }}>⚠️</div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Could not connect to the API server</div>
            <div style={{ fontSize: "0.84rem" }}>Make sure you started both servers with <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 8px",borderRadius:4}}>npm run dev:full</code></div>
          </div>
        )}
        {videos.map((video, i) => (
          <VideoRow
            key={video.id}
            video={video}
            index={i}
            total={videos.length}
            onMove={move}
            onDelete={handleDelete}
            onThumb={setThumbTarget}
            onLabelChange={handleLabelChange}
            dragHandlers={dragHandlers}
          />
        ))}
      </div>

      {thumbTarget && (
        <ThumbnailModal
          video={thumbTarget}
          onClose={() => setThumbTarget(null)}
          onSaved={handleThumbSaved}
          toast={toast}
        />
      )}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────
function Dashboard({ onLogout }) {
  const [tab, setTab] = useState("manage"); // "upload" | "manage"
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastData, setToastData] = useState(null);

  const toast = useCallback((msg, type = "success") => {
    setToastData({ msg, type, key: Date.now() });
  }, []);

  useEffect(() => {
    fetch(`${API}/api/videos`)
      .then((r) => r.json())
      .then((data) => { setVideos(data); setLoading(false); })
      .catch(() => { setLoading(false); toast("API server not reachable. Run: npm run dev:full", "error"); });
  }, []);

  function handleUploaded(newVideo) {
    setVideos((prev) => [...prev, newVideo]);
    setTab("manage");
  }

  return (
    <div className="adm-shell">
      {/* Header */}
      <header className="adm-header">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div className="adm-header-logo">ADy</div>
          <div className="adm-header-badge">Admin</div>
        </div>
        <div className="adm-header-right">
          <a href="/" className="adm-header-link">← View Portfolio</a>
          <button className="adm-btn secondary" onClick={onLogout}>Sign Out</button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="adm-tabs">
        <button className={`adm-tab ${tab === "upload" ? "active" : ""}`} onClick={() => setTab("upload")}>
          ＋ Add Video
        </button>
        <button className={`adm-tab ${tab === "manage" ? "active" : ""}`} onClick={() => setTab("manage")}>
          🎬 Manage ({videos.length})
        </button>
      </nav>

      {/* Content */}
      <div className="adm-content">
        {/* Quick stats */}
        <div className="adm-stats">
          <div className="adm-stat-card">
            <div className="adm-stat-value">{videos.length}</div>
            <div className="adm-stat-label">Total Videos</div>
          </div>
          <div className="adm-stat-card">
            <div className="adm-stat-value">{videos.filter((v) => v.thumbnail).length}</div>
            <div className="adm-stat-label">Custom Thumbs</div>
          </div>
          <div className="adm-stat-card">
            <div className="adm-stat-value" style={{ color: "var(--green)" }}>Live</div>
            <div className="adm-stat-label">Portfolio Status</div>
          </div>
        </div>

        {loading ? (
          <p style={{ color: "var(--muted)", textAlign: "center", paddingTop: 60 }}>Loading…</p>
        ) : tab === "upload" ? (
          <UploadTab onUploaded={handleUploaded} toast={toast} />
        ) : (
          <ManageTab videos={videos} setVideos={setVideos} toast={toast} />
        )}
      </div>

      {/* Toast */}
      {toastData && (
        <Toast
          key={toastData.key}
          msg={toastData.msg}
          type={toastData.type}
          onDone={() => setToastData(null)}
        />
      )}
    </div>
  );
}

// ── AdminApp (root) ───────────────────────────────────────────────
export default function AdminApp() {
  const [authed, setAuthed] = useState(isAuthed());

  // Apply body class for admin styling
  useEffect(() => {
    document.body.classList.add("admin-body");
    document.title = "ADy Admin";
    return () => {
      document.body.classList.remove("admin-body");
      document.title = "ADyFolio";
    };
  }, []);

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  }

  return authed
    ? <Dashboard onLogout={handleLogout} />
    : <LoginPage onLogin={() => setAuthed(true)} />;
}
