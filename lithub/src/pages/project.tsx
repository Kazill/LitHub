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
    lastUpdate: string | undefined,
    languages: string | undefined,
    source: string | undefined,
    description: string | undefined,
    link: string | undefined,
    isClosed: boolean,
    isPrivate: boolean
}

interface markedData {
    userName: string
    id: number;
}

interface CommentData {
    id: number;
    author: string;
    text: string;
    url: string;
    parentCommentId: number;
    problemId: number;
    postedDate: string;
    replies?: CommentData[]; // Optional for nesting replies
}
interface LikeData {
    id: number;
    userName: string;
    role: string;
    problemId: number;
    commentId: number;
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
    const [likes, setLikes] = useState<LikeData[]>([]); // Define likes state here
    const [newCommentText, setNewCommentText] = useState(''); // New state for the comment text
    const [newUrl, setNewUrl] = useState('');
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
            await fetchLikes();
        } catch (error) {
            console.error(error);
        }
    };

    const fetchComments = async () => {
        const commentsResponse = await axios.get(`https://localhost:7054/api/Comment/problem/${id}`);
        setComments(commentsResponse.data);
    };
    const fetchLikes = async () => {
        try {
            const likesResponse = await axios.get(`https://localhost:7054/api/Like/byProblemId/${id}`);
            setLikes(likesResponse.data); // Assuming `likes` state is of type LikeData[]
        } catch (error: any) { // Specify 'any' if you're not sure about the type
            if (error.response && error.response.status === 404) {
                console.log('No likes found for this problem.');
                setLikes([]); // Return an empty array if no likes are found
            } else {
                console.error('Failed to fetch likes:', error);
                // Handle other errors appropriately
            }
        }
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

    const handleDeleteForCreator = async (problem: problemData) =>{

        problem.description = undefined;
        problem.lastUpdate = undefined;
        problem.languages = undefined;
        problem.link = undefined;
        problem.source = undefined;
        problem.isClosed = true;

        try {
            const response = await axios.put(`https://localhost:7054/api/Problem/${id}`, problem, {
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

    const handleClose = async (problem: problemData) => {
        problem.isClosed = true;
        try {
            const response = await axios.put(`https://localhost:7054/api/Problem/${id}`, problem, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response from server:', response.data);
            window.location.reload()
        } catch (error) {
            // Handle the error or log it
            console.error(error);
        }
    };
    const handleOpen = async (problem: problemData) => {
        problem.isClosed = false;
        try {
            const response = await axios.put(`https://localhost:7054/api/Problem/${id}`, problem, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response from server:', response.data);
            window.location.reload()
        } catch (error) {
            // Handle the error or log it
            console.error(error);
        }
    };

    const handleNewCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewCommentText(event.target.value);
    };
    const handleNewUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewUrl(event.target.value);
    };
    const handleLikeClick = async (commentId: number, likes: LikeData[]) => {
        // Check if the user is signed in
        if (!userName || userName.trim() === "" || userRole.trim() === "" || userName === userRole) {
            // Display a message or perform any action for unsigned users
            alert("User is not signed in. Please sign in to like comments.");
            return;
        }

        const likedByCurrentUser = likes.some(like => like.commentId === commentId && like.userName === userName);

        try {
            if (likedByCurrentUser) {
                // User has already liked the comment, so revoke the like
                const likeToRemove = likes.find(like => like.commentId === commentId && like.userName === userName);
                if (likeToRemove) {
                    await axios.delete(`https://localhost:7054/api/Like/${likeToRemove.id}`);
                    // Refresh likes after revoking the like
                    await fetchLikes();
                }
            } else {
                // User has not liked the comment, so create a new like
                await axios.post(`https://localhost:7054/api/Like`, {
                    userName: userName,
                    role: userRole,
                    problemId: id,
                    commentId: commentId
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        // Include any other necessary headers, like authorization tokens
                    }
                });
                // Refresh likes after liking the comment
                await fetchLikes();
            }
        } catch (error) {
            console.error("Failed to handle like click:", error);
        }
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
        //const allowedDomains = ["github.com", "bitbucket.org"];
        if (!newUrl) {
            console.error("URL cannot be empty");
            return;
        }
        /*try {
            const urlObj = new URL(newUrl); // Tries to create a URL object, which will throw if the URL is invalid
            if (!allowedDomains.includes(urlObj.hostname)) {
                console.error("URL from this domain is not allowed");
                return;
              }
            // Proceed with form submission or AJAX request here
          } catch (error) {
            console.error('Please enter a valid URL.');
            return; // Stop the form submission
          }*/
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
                parentCommentId: replyingTo,  // This could be dynamic too if you're implementing reply functionality
                url: newUrl
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
    const renderComments = (comments: CommentData[], likes: LikeData[], parentCommentId?: number) => {
        return comments.map((comment) => {
            // Filter likes for the current comment
            const commentLikes = likes.filter(like => like.commentId === comment.id);

            return (
                <div key={comment.id}>
                    <p><strong><Link to={`/profile/${comment.author}`}>{comment.author}</Link></strong> at {new Date(comment.postedDate).toLocaleString()}:</p>
                    {/* {problem?.source === userName && ( */}
                        <p>Likes: {commentLikes.length}</p>
                     {/* )} */}
                    {userRole === "Prisiregistravęs" && (
                        <button className="like-button" onClick={() => handleLikeClick(comment.id, likes)}>
                            Like
                        </button>
                    )}

                    <p>{comment.text}</p>
                    <a href={comment.url} target="_blank" rel="noreferrer">{comment.url}</a>
                    <br></br>
                    {
                        userRole !== "Svečias" && !problem?.isClosed && (comment.parentCommentId === null || comment.parentCommentId === undefined) && (
                            <button onClick={() => handleReplyClick(comment.id)}>Reply</button>
                        )
                    }
                    {comment.replies && comment.replies.length > 0 && (
                        <div style={{ marginLeft: '20px' }}>
                            {renderComments(comment.replies, likes, comment.id)}
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
            );
        });
    };

    const renderDeleteButton = () => {
        if (selectedRole === "Administratorius") {
            return <button onClick={() => handleDelete()}>Šalinti</button>;
        }
        else if (selectedRole === "Patvirtinas"){
            let token = localStorage.getItem('accessToken')
            switch (token) {
            case null:
                return (null);
            default:
                const data: CustomJwtPayload = jwtDecode(token)
                if (problem?.source === data.username) {

                    return <button onClick={() => handleDeleteForCreator(problem)}>Šalinti</button>;
                }
            }
        }
        return null;
    };


    const renderEditButton = () => {
        console.log();

        let token = localStorage.getItem('accessToken')
        switch (token) {
            case null:
                return (null);
            default:
                const data: CustomJwtPayload = jwtDecode(token)
                if (problem?.source === data.username && selectedRole === "Patvirtinas" && !problem?.isClosed) {

                    return (
                        <Link to={`/editProject?id=${id}`}>
                            <button>Redaguoti</button>
                        </Link>
                    );
                }
                else {
                    return (null);
                }
        }
    };
    const renderCloseButton = () => {
        console.log();
        let token = localStorage.getItem('accessToken')
        switch (token) {
            case null:
                return (null);
            default:
                const data: CustomJwtPayload = jwtDecode(token)
                if (problem?.source === data.username && selectedRole === "Patvirtinas") {
                    if (!problem?.isClosed) {
                        return (<button onClick={() => handleClose(problem)}>Uždaryti</button>);
                    }
                    else {
                        return (<button onClick={() => handleOpen(problem)}>Atidaryti</button>);
                    }
                }
                else {
                    return (null);
                }
        }
    };
    const renderMarkButton = () => {
        if (selectedRole === "Prisiregistravęs" && !problem?.isClosed && problem?.isPrivate) {
            return <MarkProject />;
        }
        return null;
    };

    const renderChosen = () => {
        if(problem?.isPrivate)
        {
            return(
                <><select id="id" value="Pasižymėją programuotojai" >
                    <option value="start" hidden>Pasižymėją programuotojai</option>
                    {marks.map(mark => (
                        <option value="Vardas" disabled>{mark.userName}</option>
                    ))}
                </select></>
            )
        }
        return null;
    }

    const isClosed = () => {
        if (problem?.isClosed) {
            return ("(Uždarytas)");
        }
        return "(Aktyvus)";
    }

    return (
        <><div>
            <div>
                <center><h1>{problem?.title} {isClosed()} <IsMarked /></h1></center>
                <p>{problem?.description}</p>
                <p><b>Įkėlėjas: </b><Link to={`/profile/${problem?.source}`}>{problem?.source}</Link></p>
                <p><b>Kalbos: </b>{problem?.languages}</p>
                <p><b>Paskutinis atnaujinimas: </b>{problem?.lastUpdate}</p>
                {renderChosen()}
                <div>
                    <h2>Failai:</h2>
                    <a href={problem?.link}>{problem?.link}</a>
                </div>

                {renderDeleteButton()}
                {renderEditButton()}
                {renderCloseButton()}
                {renderMarkButton()}
            </div>

            

            {problem?.isPrivate ? (
                <p>Projektas privatus</p>
            ) : (

                <><div>
                        <h2>Komentarai:</h2>
                        {comments.length > 0 ? (
                            renderComments(comments, likes)
                        ) : (
                            <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
                                Komentarų dar nėra.
                            </div>
                        )}
                    </div><h3>Palikite komentarą:</h3>

                    {userRole !== "Svečias" ? (
                        problem?.isClosed ? (
                            <p>Projektas uždarytas</p>
                        ) : (
                            <form onSubmit={handleCommentSubmit}>
                                <textarea
                                    value={newCommentText}
                                    onChange={handleNewCommentChange}
                                    placeholder="Write your comment here..."
                                    style={{ width: '100%', height: '100px' }}
                                />
                                <input type="url"
                                    value={newUrl}
                                    onChange={handleNewUrlChange}
                                    id="websiteInput"
                                    placeholder="Enter website URL" />
                                <button type="submit">Submit Comment</button>
                            </form>
                            )
                    ) : (
                        <p>Norint rašyti komentarą prisijunkite.</p>
                    )}</>
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

    const handleUnmark = async (name: string) => {
        try {
            const existingMark = marks.find(x => x.userName === name);
            if (existingMark) {
                const response = await axios.delete(`https://localhost:7054/api/Marked/${existingMark.id}`);
                console.log('Response from server:', response.data);
                window.location.reload(); // Reload the page to reflect the updated marks
            }
        } catch (error) {
            console.error('Error removing mark:', error);
        }
    };

    let token = localStorage.getItem('accessToken');
    switch (token) {
        case null:
            return (null);
        default:
            const data: CustomJwtPayload = jwtDecode(token);
            const userMark = marks.find(x => x.userName === data.username);
            if (!userMark) {
                return (<button onClick={() => handleMark(data.username)}>Planuoju padėti</button>);
            } else {
                return (
                    <div>
                        <button onClick={() => handleUnmark(data.username)}>Atšaukti pasižymėjimą</button>
                    </div>
                );
            }
    }
}

export default Project;
