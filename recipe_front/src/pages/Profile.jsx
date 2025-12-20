import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; 
import { useTranslate } from "../i18n/useTranslate";
import defaultAvatar from "../assets/default-avatar.png";
import "../styles/profile.css";

const AVATAR_STORAGE_KEY = "user_avatar";

function Profile() {
  const { user } = useAuth();
  const { t } = useTranslate();
  const [avatarUrl, setAvatarUrl] = useState(null);

  
  useEffect(() => {
    const savedAvatar = localStorage.getItem(AVATAR_STORAGE_KEY);
    if (savedAvatar) {
      setAvatarUrl(savedAvatar);
    }
  }, []);

  
  const currentAvatar = avatarUrl || defaultAvatar;

  if (!user) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>{t("notAuthorized")}</p>
      </div>
    );
  }

  function handleFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

 
    if (!file.type.startsWith("image/")) {
      alert(t("invalidImageFile") || "Please select a valid image file");
      return;
    }

   
    const maxSize = 5 * 1024 * 1024; 
    if (file.size > maxSize) {
      alert(t("fileTooLarge") || "Image size must be less than 5MB");
      return;
    }

    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
     
      localStorage.setItem(AVATAR_STORAGE_KEY, base64String);
    
      setAvatarUrl(base64String);
    };
    reader.onerror = () => {
      alert(t("errorReadingFile") || "Error reading file. Please try again.");
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="profile-page">
      <h1 className="profile-header">{t("profile")}</h1>

      <div className="profile-info">
        <div className="profile-avatar-wrapper">
          <img
            src={currentAvatar}
            alt="User avatar"
            className="profile-avatar-img"
          />
        </div>

        <div className="profile-text">
          <h2>
            {t("hello")}, {user.username}!
          </h2>

          {user.email && (
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          )}
          <p className="status-badge">{t("authorized")}</p>

          <div className="profile-upload">
            <label htmlFor="avatar-upload">{t("uploadAvatar") || "Upload profile picture"}</label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;