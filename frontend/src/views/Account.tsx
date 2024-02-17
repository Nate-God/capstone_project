import { useState, useEffect } from 'react';
import DatabaseService from '../services/DatabaseService';


interface User {
  name: string;
  email: string;
  username: string;
  location: string;
  created: string;
}


const Account: React.FC = () => {
  const [showEditCard, setShowEditCard] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    oldPassword: '',
    oldEmail:'',
    newEmail: '',
    newPassword: '',
    confirmEmail:'',
    confirmPassword:''
  });


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await DatabaseService.getUser();
        setUser(userData);
        console.log(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (showEditCard === 'Email') {
      console.log(formData.oldEmail);
      console.log(formData.newEmail);
      if (formData.newPassword !== formData.confirmPassword) {
        alert("Passwords don't match");
        return;
      }
      try {
        const emailUpdate = await DatabaseService.editEmail(formData.oldEmail, formData.newEmail);
        console.log(emailUpdate);
        alert("Email updated successfully");
      } catch (error) {
        console.error('Error updating email:', error);
        alert("Failed to update email");
      }
    }
    else if (showEditCard === 'Password') {
      console.log(formData.oldPassword);
      console.log(formData.newPassword);
      if (formData.newPassword !== formData.confirmPassword) {
        alert("Passwords don't match");
        return;
      }
      try {
        const passwordUpdate = await DatabaseService.editPassword(formData.oldPassword, formData.newPassword);
        console.log(passwordUpdate);
        alert("Password updated successfully");
      } catch (error) {
        console.error('Error updating password:', error);
        alert("Failed to update password");
      }
    }
    else if (showEditCard === 'deleteUser') {
      console.log(formData.oldEmail);
      console.log(formData.newEmail);
      try {
        const deleteResponse = await DatabaseService.deleteUser(formData.oldPassword);
        console.log(deleteResponse);
        alert("account deleted successfully");
        localStorage.removeItem('accessToken')
        window.location.href = '/';
      } catch (error) {
        console.error('Error deleting account:', error);
        alert("Failed to delete account");
      }
    }

    setFormData({
      oldPassword: '',
      oldEmail:'',
      newEmail: '',
      newPassword: '',
      confirmEmail:'',
      confirmPassword:''
    });

    setShowEditCard('');
  };

  return (
    <div className="user-info">
      <h2>Your user information</h2>
      {user ? (
        <>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Location:</strong> {user.location}</p>
          <p><strong>Member Since:</strong> {user.created}</p>
          <div className="button-group">
            <button onClick={() => setShowEditCard('Email')}>Change Email</button>
            <button onClick={() => setShowEditCard('Password')}>Change Password</button>
            <button onClick={() => setShowEditCard('deleteUser')}>Delete Account</button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
      {showEditCard === 'Password' && (
        <div className="edit-card">
          <h3>Edit Profile</h3>
          <form onSubmit={handleSubmit}>
            <label htmlFor="oldPassword">Old Password:</label>
            <input type="password" id="oldPassword" name="oldPassword" value={formData.oldPassword} onChange={handleInputChange} />
            <label htmlFor="newPassword">New Password:</label>
            <input type="password" id="newPassword" name="newPassword" value={formData.newPassword} onChange={handleInputChange} />
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} />
            <button type="submit">Confirm</button>
          </form>
        </div>
      )}
      {showEditCard === 'Email' && (
        <div className="edit-card">
          <h3>Edit Profile</h3>
          <form onSubmit={handleSubmit}>
            <label htmlFor="oldEmail">Old Email:</label>
            <input type="email" id="oldEmail" name="oldEmail" value={formData.oldEmail} onChange={handleInputChange} />
            <label htmlFor="newEmail">New Email:</label>
            <input type="email" id="newEmail" name="newEmail" value={formData.newEmail} onChange={handleInputChange} />
            <label htmlFor="confirmEmail">Confirm Email:</label>
            <input type="email" id="confirmEmail" name="confirmEmail" value={formData.confirmEmail} onChange={handleInputChange} />
            <button type="submit">Confirm</button>
          </form>
        </div>
      )}
      {showEditCard === 'deleteUser' && (
        <div className="edit-card">
          <h3>are you sure? this action cannot be undone. </h3>
          <form onSubmit={handleSubmit}>
          <label htmlFor="oldPassword">Password:</label>
            <input type="password" id="oldPassword" name="oldPassword" value={formData.oldPassword} onChange={handleInputChange} />
            <button type="submit">Confirm</button>
          </form>
        </div>
      )}
    </div>
  );
};


export default Account;
