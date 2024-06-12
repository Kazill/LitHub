import { Button, TextField } from '@mui/material';
import axios from 'axios';
import { JwtPayload, jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface UserProfile {
  id: number;
  userName: string;
  email: string;
  company: string;
  githubProfile: string;
  phoneNumber: string;
  role: string;
  imageLink: string;
  about:string;
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
  const [flag, setflag] = useState<boolean>();
  const [userRole, setUserRole] = useState('Svečias');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    let token = localStorage.getItem('accessToken')
    if (token === null) {
      setUserRole("Svečias")
    } else {
      const data: CustomJwtPayload = jwtDecode(token)
      setUserRole(data.role)
    }
  }, []);

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

  const handleConfirmation = async (userId: string) => {
    await axios.post(`https://localhost:7054/api/User/AskConf/${username}`);
    window.location.reload()
  }

  const getStatus = async (username: string | undefined) => {
    if (typeof username == "string") {
      const response = await axios.get(`https://localhost:7054/api/User/Waitting/${username}`);
      setflag(response.data)
    }
  }

  useEffect(() => {
    getStatus(username)
  }, [username])

  const handleConfirmationRequest = () => {
    if (userRole === "Prisiregistravęs") {
      let token = localStorage.getItem('accessToken')
      switch (token) {
        case null:
          return null
        default:
          const data: CustomJwtPayload = jwtDecode(token)
          if (data.username === username) {
            if (flag === true) {
              return <Button variant="contained" onClick={() => handleConfirmation(data.username)} style={{ background: '#3f5581' }}>Prašyti patvirtinti paskyrą</Button>
            }
          }
      }
    }
    return null;
  };

  const handleGithubLink = () => {
    if (userProfile?.role === "Prisiregistravęs") {
      if (userProfile?.githubProfile !== null) {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <p style={{ marginBottom: '5px', color: "white" }}>Github adresas:</p>
            <div style={{ background: '#6E83AC', padding: '5px', width: '100%' }}>
              <p style={{ margin: 0 }}>{userProfile?.githubProfile}</p>
            </div>
          </div>
        );
      }
      else {
        return null;
      }
    }
    return null;
  };

  const handleCompanyName = () => {
    if (userProfile?.role === "Patvirtinas") {
      if (userProfile?.company !== null) {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <p style={{ marginBottom: '5px', color: "white" }}>Įmonė:</p>
            <div style={{ background: '#6E83AC', padding: '5px', width: '100%' }}>
              <p style={{ margin: 0 }}>{userProfile?.company}</p>
            </div>
          </div>
        );
      }
      else {
        return null;
      }
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
        if (userRole === "Administratorius" && userProfile?.role === "Prisiregistravęs") {
          return (
            <Button variant="contained" onClick={() => handleApproveUser(userProfile?.id)} style={{ background: '#3f5581' }}>Patvirtinti naudotoją</Button>
          );
        } else if (userRole === "Administratorius" && userProfile?.role === "Patvirtinas") {
          return (
            <Button variant="contained" onClick={() => handleRevokeUser(userProfile?.id)} style={{ background: '#3f5581' }}>Panaikinti patvirtinto naudotojo statusą</Button>
          );
        }
        else {
          return (null);
        }
    }
  };

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

  const handleEditCall= () =>{
    let token = localStorage.getItem('accessToken')
    if (token !== null) {
      const data: CustomJwtPayload = jwtDecode(token)
      if (username === data.username) {
        return <Button variant="contained" href={`/profile-edit/${username}`} style={{background: '#3f5581'}}>Redaguoti
          profilį</Button>
      }
    }
  }


  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '30px', minHeight: '100vh' }}>
      <div><h1>Profilis</h1></div>
      <div style={{ display: 'flex', width: '100%', marginBottom: '20px' }}>{handleEditCall()}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '20px' }}>
        <div style={{ width: '45%', padding: '20px', background: '#335285', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <p style={{ marginBottom: '10px', color: "white" }}>El. paštas:</p>
          <div style={{ background: '#6E83AC', padding: '5px', width: '100%' }}>
            <p style={{ margin: 0, textAlign: 'left' }}>{userProfile?.email}</p>
          </div>
          <p style={{ marginBottom: '10px', color: "white" }}>Tel. nr.:</p>
          <TextField
            fullWidth
            name="number"
            value={userProfile?.phoneNumber}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.3)',
              mt: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: '#344955',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#344955',
                },
              },
            }}
          />
        </div>
        <div style={{ width: '45%', padding: '20px', background: '#335285', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ marginBottom: '20px', color: "white" }}>{userProfile.userName}</h2>
            <img
              src={userProfile.imageLink}
              style={{ width: '100px', height: '100px', marginBottom: '20px',borderRadius: '50%'  }}
              alt="Profilio nuotrauka"
            />
            <div>
              <br></br>
              {handleConfirmationRequest()}
              <br />
              {handleAdminPrivileges()}
            </div>
          </div>
      </div>
      <div style={{ padding: '20px', background: '#335285', marginBottom: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        {handleGithubLink()}
        {handleCompanyName()}
        <p style={{color: "white"}}>Aprašymas:</p>
        <div style={{ background: '#6E83AC', padding: '5px', width: '100%' }}>
          <p style={{ margin: 0, textAlign: 'left' }}>{userProfile?.about}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
