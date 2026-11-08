import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../utils/error";
import userService from "../../services/userService";
import mediaService from "../../services/mediaService";

const MyProfile = () => {
  const { user, updateUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [updateProfileloading, setUpdateProfileLoading] = useState(false);
  const [changePasswordloading, setChangePasswordLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    avatar: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setSelectedFile(file);

    setFormData((prev) => ({
      ...prev,
      avatar: URL.createObjectURL(file),
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      setUpdateProfileLoading(true);
      let avatar = formData.avatar;

      if (selectedFile) {
        avatar = await mediaService.uploadImage(selectedFile);
      }

      const result = await userService.updateMyProfile({
        ...formData,
        avatar,
      });

      updateUser(result);
      setSelectedFile(null);
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update profile."));
    } finally {
      setUpdateProfileLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Password confirmation does not match.");
      return;
    }

    try {
      setChangePasswordLoading(true);

      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Password changed successfully.");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to change password."));
    } finally {
      setChangePasswordLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    setFormData({
      name: user.name,
      avatar: user.avatar,
    });
  }, [user]);

  useEffect(() => {
    return () => {
      if (formData.avatar?.startsWith("blob:")) {
        URL.revokeObjectURL(formData.avatar);
      }
    };
  }, [formData.avatar]);

  return (
    <div className="margin-bottom-65">
      <div id="titlebar" className="gradient">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2>My Profile</h2>
              <nav id="breadcrumbs">
                <ul>
                  <Link to="/">Home</Link>
                  <li>My Profile</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row sticky-wrapper">
          <div className="col-lg-6 col-md-12">
            <div className="dashboard-list-box margin-top-0 shadow">
              <h4 className="gray">Profile Details</h4>
              <div className="dashboard-list-box-static">
                {/* Avatar */}
                <div className="edit-profile-photo">
                  <img src={formData.avatar} alt="Avatar" />
                  <div className="change-photo-btn">
                    <div className="photoUpload">
                      <span>
                        <i className="fa fa-upload"></i> Upload Photo
                      </span>
                      <input
                        type="file"
                        className="upload"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="my-profile">
                  <label>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />

                  <label>Email</label>
                  <input type="text" value={user?.email} disabled />
                  <small>Email is used for login and cannot be changed.</small>
                </div>

                <button
                  className="button margin-top-15"
                  onClick={handleUpdateProfile}
                  disabled={updateProfileloading}
                >
                  {updateProfileloading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="col-lg-6 col-md-12">
            <div className="dashboard-list-box margin-top-0 shadow">
              <h4 className="gray">Change Password</h4>
              <div className="dashboard-list-box-static">
                <div className="my-profile">
                  <label className="margin-top-0">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                  />

                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />

                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />

                  <button
                    className="button margin-top-15"
                    onClick={handleChangePassword}
                    disabled={changePasswordloading}
                  >
                    {changePasswordloading ? "Saving..." : "Change Password"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
