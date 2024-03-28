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
        if(selectedRole === "Prisiregistravęs"){
            return <button>Prašyti patvirtinti paskyrą</button>
        }
        return null;
    };
    const handleGithubLink = () => {
        if(selectedRole === "Prisiregistravęs"){
            return <p>Github: www.github.com/naudotojas</p>
        }
        return null;
    };
    const handleCompanyName = () => {
        if(selectedRole === "Patvirtinas"){
            return <p>Atstovaujama įmonė: Seimas</p>
        }
        return null;
    };
    const handleAdminPrivileges = () => {
        let token=localStorage.getItem('accessToken')
        switch (token){
            case null:
                return(null);
        default:
            const data :CustomJwtPayload=jwtDecode(token)
                if(selectedRole === "Administratorius" && userProfile?.role === "Prisiregistravęs"){
                    return(<button>Patvirtinti naudotoją</button>);
                }
                else if(selectedRole === "Administratorius" && userProfile?.role === "Patvirtinas"){
                    return(<button>Panaikinti patvirtinto naudotojo statusą</button>);
                }
                else{
                    return(null);
                }
        }
    };

  // Add logic for rendering based on user role

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
