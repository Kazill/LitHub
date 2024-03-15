import { useNavigate, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { FaStar } from "react-icons/fa";

interface CustomJwtPayload extends JwtPayload {
    username: string;
    role: string;
    // Add other custom properties if needed
}


const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

interface problemData {
    title: string,
    lastUpdate: string,
    languages: string,
    source: string,
    description: string,
    link: string
}

interface markedData {
    userName: string
}

interface CommentData {
    id: number;
    author: string;
    text: string;
    parentCommentId: number;
    problemId: number;
    postedDate: string;
    replies?: CommentData[]; // Optional for nesting replies
}

function SetMarks(id: number) {
    const [marks, setMarks] = useState<markedData[]>([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`https://localhost:7054/api/Marked/problem/${id}`);
                setMarks(response.data);
            } catch (error) {
                // Handle the error or log it
                console.error(error);
            }
        }

        fetchData();
    }, [id]);
    return marks;
}



function Project(this: any) {
    const [comments, setComments] = useState<CommentData[]>([]); // Define comments state here
    const [newCommentText, setNewCommentText] = useState(''); // New state for the comment text
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [selectedRole, setSelectedRole] = useState('');

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


    const id = useQuery().get('id');

    const marks = SetMarks(Number(id));

    const [problem, setProblem] = useState<problemData>();

    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const response = await axios.get(`https://localhost:7054/api/Problem/${id}`);
            setProblem(response.data);
            await fetchComments(); // Call a separated fetch function
        } catch (error) {
            console.error(error);
        }
    };

    const fetchComments = async () => {
        const commentsResponse = await axios.get(`https://localhost:7054/api/Comment/problem/${id}`);
        setComments(commentsResponse.data);
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleDelete = async () => {
        try {
            await axios.delete(`https://localhost:7054/api/Problem/${id}`);
            navigate("/Projects");
        } catch (error) {
            // Handle the error or log it
            console.error(error);
        }
    };
    const handleNewCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewCommentText(event.target.value);
    };
    const handleReplyClick = (commentId: number) => {
        setReplyingTo(commentId);
        // Optionally, scroll to the reply input or focus it for better user experience
    };
    let userRole = "Svečias"; // Default to guest if no token or role found
    let userName = "Svečias";
    const token = localStorage.getItem('accessToken');
    if (token) {
        const decoded: CustomJwtPayload = jwtDecode(token);
        userRole = decoded.role;
        userName = decoded.username;
    }
    const handleCommentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!newCommentText.trim()) return;
        // Ensure `id` is not null and is a string before attempting to parse it
        if (id === null) {
            console.error("Problem ID is null. This should never happen.");
            return; // Optionally, handle this case more gracefully in your UI
        }
        const problemId = parseInt(id, 10); // Use the radix parameter to ensure base 10
        if (isNaN(problemId)) {
            console.error("Problem ID is not a number. This should never happen.");
            return; // Again, handle this error as appropriate for your application
        }
        try {
            await axios.post(`https://localhost:7054/api/Comment`, {
                author: userName, // Dynamic author name
                text: newCommentText, // User input from state
                problemId: problemId,
                parentCommentId: replyingTo  // This could be dynamic too if you're implementing reply functionality
            });

            setNewCommentText(''); // Clear the comment box after successful submission
            setReplyingTo(null); // Reset replyingTo state            
            await fetchComments(); // Assuming you've implemented fetchComments method to reload comments
        } catch (error) {
            console.error("Failed to submit comment", error);
        }
    };
    interface ReplyComponentProps {
        commentId: number;
        onSubmit: (replyText: string, commentId: number) => void;
    }

    function ReplyComponent({ commentId, onSubmit }: ReplyComponentProps) {
        const [replyText, setReplyText] = useState('');

        const handleReplyChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
            setReplyText(event.target.value);
        };

        const handleReplySubmit = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            onSubmit(replyText, commentId); // Pass the reply text and comment ID back to the parent
            setReplyText(''); // Reset the reply input after submission
            setReplyingTo(null)
        };

        return (
            <form onSubmit={handleReplySubmit}>
                <textarea
                    value={replyText}
                    onChange={handleReplyChange}
                    placeholder="Write your reply here..."
                    style={{ width: '100%', height: '100px' }}
                />
                <button type="submit">Submit Reply</button>
            </form>
        );
    }

    // Function to render comments and their replies recursively
    const renderComments = (comments: CommentData[], parentCommentId?: number) => {
        return comments.map((comment) => (
            <div key={comment.id}>
                <p><strong>{comment.author}</strong> at {new Date(comment.postedDate).toLocaleString()}:</p>
                <p>{comment.text}</p>
                {
                    userRole !== "Svečias" && (comment.parentCommentId === null || comment.parentCommentId === undefined) && (
                        <button onClick={() => handleReplyClick(comment.id)}>Reply</button>
                    )
                }
                {comment.replies && comment.replies.length > 0 && (
                    <div style={{ marginLeft: '20px' }}>
                        {renderComments(comment.replies, comment.id)}
                    </div>
                )}
                {replyingTo === comment.id && (
                    <ReplyComponent
                        commentId={comment.id}
                        onSubmit={async (replyText, parentCommentId) => {
                            const problemId = Number(id); // Assuming `id` is the problem's ID from URL
                            if (!replyText.trim()) return;
                            console.log(parentCommentId);
                            try {
                                await axios.post(`https://localhost:7054/api/Comment`, {
                                    author: userName,
                                    text: replyText,
                                    problemId: problemId,
                                    parentCommentId: parentCommentId // This links the reply to its parent comment
                                }, {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        // Include any other necessary headers, like authorization tokens
                                    }
                                });

                                await fetchComments(); // Refresh comments to show the new reply
                            } catch (error) {
                                console.error("Failed to submit reply", error);
                            }
                        }}
                    />

                )}

            </div>
        ));
    };

    const renderDeleteButton = () => {
        if(selectedRole === "Administratorius"){
            return <button onClick={() => handleDelete()}>Šalinti</button>;
        }
        return null;
    };
    const renderEditButton = () => {
        console.log();

        let token=localStorage.getItem('accessToken')
        switch (token){
            case null:
                return(null);
        default:
            const data :CustomJwtPayload=jwtDecode(token)
            console.log(problem?.source);
            console.log(data.username);
            console.log(selectedRole);
                if(problem?.source === data.username && selectedRole === "Patvirtinas"){
                    
                    return( <Link to={`/editProject?id=${id}`}>
                                <button>Redaguoti</button>
                            </Link>);
                }
                else{
                    return(null);
                }
        }
    };
    const renderMarkButton = () => {
        if(selectedRole === "Prisiregistravęs"){
            return <MarkProject />;
        }
        return null;
    };

    return (
        <><div>
            <div>
                <center><h1>{problem?.title} <IsMarked /></h1></center>
                <p>{problem?.description}</p>
                <p><b>Įkėlėjas: </b>{problem?.source}</p>
                <p><b>Kalbos: </b>{problem?.languages}</p>
                <p><b>Paskutinis atnaujinimas: </b>{problem?.lastUpdate}</p>
                <select id="id" value="Pasižymėją programuotojai" >
                    <option value="start" hidden>Pasižymėją programuotojai</option>
                    {marks.map(mark => (
                        <option value="Vardas" disabled>{mark.userName}</option>
                    ))}
                </select>
                <div>
                    <h2>Failai:</h2>
                    <a href={problem?.link}>{problem?.link}</a>
                </div>
                
                {renderDeleteButton()}
                {renderEditButton()}
                {renderMarkButton()}
            </div>

            <div>
                <h2>Komentarai:</h2>
                {comments.length > 0 ? (
                    renderComments(comments)
                ) : (
                    <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
                        Komentarų dar nėra.
                    </div>
                )}
            </div>

            <h3>Palikite komentarą:</h3>
            {userRole !== "Svečias" ? (
                <form onSubmit={handleCommentSubmit}>
                    <textarea
                        value={newCommentText}
                        onChange={handleNewCommentChange}
                        placeholder="Write your comment here..."
                        style={{ width: '100%', height: '100px' }}
                    />
                    <button type="submit">Submit Comment</button>
                </form>
            ) : (
                <p>Norint rašyti komentarą prisijunkite.</p>
            )}
        </div></>
    );
}

function IsMarked() {
    const marks = SetMarks(Number(useQuery().get('id')));
    let token = localStorage.getItem('accessToken')
    switch (token) {
        case null:
            return (null);
        default:
            const data: CustomJwtPayload = jwtDecode(token)
            if (marks.find(x => x.userName === data.username) === undefined) {
                return (null);
            }
            else {
                return (<FaStar />);
            }
    }
}

function MarkProject() {
    const id = useQuery().get('id');
    const marks = SetMarks(Number(id));
    const handleMark = async (name: string) => {
        const mark = { problemId: Number(id), userName: name }
        try {
            const response = await axios.post('https://localhost:7054/api/Marked', {
                ...mark,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response from server:', response.data);
            window.location.reload()
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };

    let token = localStorage.getItem('accessToken')
    switch (token) {
        case null:
            return (null);
        default:
            const data: CustomJwtPayload = jwtDecode(token)
            if (marks.find(x => x.userName === data.username) === undefined) {
                return (<button onClick={() => handleMark(data.username)}>Planuoju padėti</button>)
            }
            else {
                return (null);
            }
    }
}

export default Project;
