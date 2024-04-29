import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode, JwtPayload } from "jwt-decode";

interface UserProfile {
  id: number;
  userName: string;
  email: string;
  role: string;
  // Add other fields as needed
}
interface CustomJwtPayload extends JwtPayload {
  username: string;
  role: string;
  // Add other custom properties if needed
}

const Profile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { username } = useParams<{ username: string }>();
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`https://localhost:7054/api/User/username/${username}`);
        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [username]);

  useEffect(() => {
    // Fetch initial role when component mounts
    fetchRole();
  }, []);

  const fetchRole = () => {
    fetch('https://localhost:7054/api/Roles')
      .then(response => response.json())
      .then(role => {
        // Process the data received from the backend
        setSelectedRole(role ? role.name : 'error in role format');
      })
      .catch(error => console.error('Error fetching role:', error));
  };

  const handleConfirmationRequest = () => {
    if (selectedRole === "Prisiregistravęs") {
      return <button>Prašyti patvirtinti paskyrą</button>
    }
    return null;
  };
  const handleGithubLink = () => {
    if (selectedRole === "Prisiregistravęs") {
      return <p>Github: www.github.com/naudotojas</p>
    }
    return null;
  };
  const handleCompanyName = () => {
    if (selectedRole === "Patvirtinas") {
      return <p>Atstovaujama įmonė: Seimas</p>
    }
    return null;
  };
  const handleAdminPrivileges = () => {
    let token = localStorage.getItem('accessToken')
    switch (token) {
      case null:
        return (null);
      default:
        const data: CustomJwtPayload = jwtDecode(token)
        if (selectedRole === "Administratorius" && userProfile?.role === "Prisiregistravęs") {
          return (
            <button onClick={() => handleApproveUser(userProfile?.id)}>Patvirtinti naudotoją</button>
          );
        } else if (selectedRole === "Administratorius" && userProfile?.role === "Patvirtinas") {
          return (
            <button onClick={() => handleRevokeUser(userProfile?.id)}>Panaikinti patvirtinto naudotojo statusą</button>
          );
        }
        else {
          return (null);
        }
    }
  };

  // Define the method to handle user approval
  const handleApproveUser = async (userId: number) => {
    // Logic to approve the user
    console.log("Approving user...");
    try {
      const response = await fetch(`https://localhost:7054/api/User/Approve/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include other headers as needed, like authorization tokens
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      // Only parse the response as JSON if there's content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const data = await response.json();
        console.log('User approved:', data);
        // Update local state
        setUserProfile(prev => prev ? { ...prev, role: "Patvirtinas" } : null);
      } else {
        console.log('User approved, no content returned');
        // Update local state
        setUserProfile(prev => prev ? { ...prev, role: "Patvirtinas" } : null);
      }
    } catch (error) {
      console.error('Error approving user:', error);
    }
    try {
      const response = await fetch(`https://localhost:7054/api/Admin/ApproveUser/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include other headers as needed, like authorization tokens
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
  
      console.log('User approved');
      // Update local state to reflect the change in role
      setUserProfile(prev => prev ? { ...prev, role: "Patvirtinas" } : null);
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  // Define the method to handle revocation of an approved user
  const handleRevokeUser = async (userId: number) => {
    // Logic to revoke the user
    console.log("Revoking user approval...");
    try {
      const response = await fetch(`https://localhost:7054/api/User/Revoke/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include other headers as needed, like authorization tokens
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      // Only parse the response as JSON if there's content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const data = await response.json();
        console.log('User approval revoked:', data);
        // Update local state
        setUserProfile(prev => prev ? { ...prev, role: "Prisiregistravęs" } : null);
      } else {
        console.log('User approval revoked, no content returned');
        // Update local state
        setUserProfile(prev => prev ? { ...prev, role: "Prisiregistravęs" } : null);
      }
    } catch (error) {
      console.error('Error revoking approval user:', error);
    }
    try {
      const response = await fetch(`https://localhost:7054/api/Admin/RevokeUser/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include other headers as needed, like authorization tokens
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
  
      console.log('User approval revoked');
      // Update local state to revert the role change
      setUserProfile(prev => prev ? { ...prev, role: "Prisiregistravęs" } : null);
    } catch (error) {
      console.error('Error revoking user:', error);
    }
  };



  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <h2>{userProfile.userName}</h2>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT550iCbL2jq7s7PMi3ikSNrvX1zpZYiZ_BTsQ9EUk4-Q&s"
          style={{ width: '100px', height: '100px' }}
          alt="Nuotrauka"
        />
        <p>Tel. nr.: +37060000000</p>
        <p>El. paštas: {userProfile.email}</p>
        {handleGithubLink()}
        {handleConfirmationRequest()}
        {handleCompanyName()}
        {handleAdminPrivileges()}

      </div>

    </div>
  );
};

export default Profile;
