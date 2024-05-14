import { useNavigate, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link } from "react-router-dom";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { FaStar } from "react-icons/fa";
import GithubCodeDisplay from '../components/githubCodeDisplay';
import './design.css';
import check from './img/check.png'
import langImg from './img/lang.png'
import noCheck from './img/nocheck.png'
import lock from './img/lock.png'
import unlock from './img/unlocked.png'
import check2 from './img/check.jpg'
import arrow from './img/arrow.png'
interface CustomJwtPayload extends JwtPayload {
    username: string;
    role: string;
    userid: number
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
    isPrivate: boolean,
    sourceId: number | undefined
}

interface userData {
    username: string,
    id: number
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
    const [isCollapsed, setIsCollapsed] = useState(true); // State to track collapse/expand

    const [userRole, setUserRole] = useState('Svečias');
    useEffect(() => {
        let token=localStorage.getItem('accessToken')
        if (token === null) {
            setUserRole("Svečias")
        } else {
            const data: CustomJwtPayload = jwtDecode(token)
            setUserRole(data.role)
        }
    }, []);

    useEffect(() => {
        // Fetch initial role when component mounts
        const handleKeyPress = (event: KeyboardEvent) => {
            // Check for key combination Ctrl + /
            if ((event.ctrlKey || event.metaKey) && event.key === '/') {
                event.preventDefault();
                toggleCollapse();
            }
        };
        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []);


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

    const handleDeleteForCreator = async (problem: problemData) => {

        problem.description = undefined;
        //problem.lastUpdate = undefined;
        problem.languages = undefined;
        problem.link = undefined;
        problem.source = undefined;
        problem.isClosed = true;
        problem.sourceId = undefined;

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
    let userName = "Svečias";
    let userId = -1;
    const token = localStorage.getItem('accessToken');
    if (token) {
        const decoded: CustomJwtPayload = jwtDecode(token);
        userName = decoded.username;
        userId = decoded.userid;
    }
    const handleCommentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const allowedDomains = ["github.com"];
        if (!newUrl) {
            console.error("URL cannot be empty");
            return;
        }
        try {
            const urlObj = new URL(newUrl); // Tries to create a URL object, which will throw if the URL is invalid
            if (!allowedDomains.includes(urlObj.hostname)) {
                console.error("URL from this domain is not allowed");
                return;
            }
            // Proceed with form submission or AJAX request here
        } catch (error) {
            console.error('Please enter a valid URL.');
            return; // Stop the form submission
        }
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
                parentCommentId: replyingTo,
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
                <div className='background'>
                    <div className='pref'> </div>
                    <div className='comments-content'>
                <textarea
                    value={replyText}
                    onChange={handleReplyChange}
                    placeholder="Rašyti atsakymą..."
                    style={{ width: '100%', height: '100px', background: 6E83, border: 6E83 }}
                />
                </div>
                </div>
                <button type="submit" className='com-button'>Pateikti <img src={arrow} alt='arrow'/></button>
            </form>
        );
    }

    const toggleCollapse = () => {
        setIsCollapsed(prevIsCollapsed => !prevIsCollapsed);
    };

    // Function to render comments and their replies recursively
    const renderComments = (comments: CommentData[], likes: LikeData[], parentCommentId?: number) => {
        return comments.map((comment) => {
            // Filter likes for the current comment
            const commentLikes = likes.filter(like => like.commentId === comment.id);

            return (
                <div key={comment.id}>
                    <div className='background'>
                    <p className='pref'><strong><Link to={`/profile/${comment.author}`}>{comment.author}</Link></strong><br></br> <br></br> {new Date(comment.postedDate).toLocaleDateString()}</p>
                    {/* {problem?.source === userName && ( */}
                    {/* <p>Likes: {commentLikes.length}</p> */}
                    {/* )} */}
                    {/* {userRole === "Prisiregistravęs" && (
                        <button className="like-button" onClick={() => handleLikeClick(comment.id, likes)}>
                            Like
                        </button>
                    )} */}
                    <div className='comments-content'>

                    <p>{comment.text}</p>
                    {comment.url && comment.url !== "null" && (
                        <a href={comment.url} target="_blank" rel="noreferrer">{comment.url}</a>
                    )}
                    <div style={{ display: isCollapsed ? 'none' : 'block' }}>
                        {<GithubCodeDisplay initialUrl={comment.url} />}
                    </div>
                    </div>
                    </div>
                    
                    {comment.replies && comment.replies.length > 0 && (
                        <><br></br><div style={{ marginLeft: '20px' }}>
                            {renderComments(comment.replies, likes, comment.id)}
                        </div></>
                    )}
                    {
                        userRole !== "Svečias" && !problem?.isClosed && (comment.parentCommentId === null || comment.parentCommentId === undefined) && (
                            <button onClick={() => handleReplyClick(comment.id)} className='com-button'>Atsakyti <img src={arrow} alt='arrow'/></button>
                        )
                    }
                    <br></br>
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
                                        parentCommentId: parentCommentId, // This links the reply to its parent comment
                                        url: "null"
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
        if (userRole === "Administratorius") {
            return <button onClick={() => handleDelete()}>Šalinti</button>;
        }
        else if (userRole === "Patvirtinas") {
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
                if (problem?.source === data.username && data.role === "Patvirtinas" && !problem?.isClosed) {

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
                if (problem?.source === data.username && userRole === "Patvirtinas") {
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
        if (userRole === "Prisiregistravęs" && problem && !problem.isClosed) {
            return <MarkProject isPrivate={problem.isPrivate} />;
        }
        return null;
    };

    const renderChosen = () => {
        const redirectToProfile = (userName: string) => {
            window.location.href = `/profile/${userName}`;
        };

        if (problem?.isPrivate) {
            return (
                <>
                    <select id="id" onChange={(e) => redirectToProfile(e.target.value)}>
                        <option value="start" hidden>Pasižymėję programuotojai</option>
                        {marks.map(mark => (
                            <option value={mark.userName} key={mark.id}>
                                {mark.userName}
                            </option>
                        ))}
                    </select>
                </>
            );
        }
        else {
            return (
                <>
                    <select id="id" onChange={(e) => redirectToProfile(e.target.value)}>
                        <option value="start" hidden>Pasižymėję programuotojai viešame projekte</option>
                        {marks.map(mark => (
                            <option value={mark.userName} key={mark.id}>
                                {mark.userName}
                            </option>
                        ))}
                    </select>
                </>
            );
        }
        return null;
    }

    const isClosed = () =>{
        if(problem?.isClosed){
            return(
                <><text className='state-name'>Uždarytas</text> &nbsp;  &nbsp; &nbsp; <img src={noCheck} alt='noCheck'/></>);
        }
        return (
        <><text className='state-name'>Aktyvus</text> &nbsp;  &nbsp; &nbsp;<img src={check} alt='checkmark'/></>
        );
    }
    const isPrivate = () =>{
        if(problem?.isPrivate){
            return(
            <><text className='state-name'>Uždaras projekto tipas</text>  &nbsp;  &nbsp; &nbsp; <img src={lock} alt='lock'/></>
        );
        }
        return (
            <><text className='state-name'>Atviras projekto tipas</text>  &nbsp;  &nbsp; &nbsp;<img src={unlock} alt='unlock'/></>
        );
    }

    return (
        <><div className='body'>
            <div>
                <p className='align-left'><Link to={`/`}>Pagrindinis</Link> / <Link to={`/projects`}> Projektai </Link>/ <Link to={`/Project?id=${id}`}>{problem?.title}</Link></p>
                <div className='project-details'>
                    <div className='project-info'>
                        <h1>{problem?.title} </h1>
                        <p>Paskelbė: <Link to={`/profile/${problem?.source}`}>{problem?.source}</Link></p>
                    </div>
                    <div className='project-state'>
                        <p>{isClosed()}</p>
                        <p>{isPrivate()}</p>
                        <p><IsMarked /></p>
                    </div>
                </div>

                <div className='background'>
                    <div className='info'>
                        <p>{problem?.description}</p>
                    </div>
                    <div className='language'>
                        <div className='language-box'>
                            <img src={langImg} alt='lang'/><br></br>{problem?.languages}
                        </div>
                    </div>
                    <div className='other-info'>
                            <p>Kodas:</p>
                            <p>
                            <button onClick={toggleCollapse}>
                            {isCollapsed ? 'Atslėpti kodą' : 'Paslėpti kodą'}
                        </button>
                                <a href={problem?.link}>{problem?.link}</a>
                            
                            
                        <div style={{ display: isCollapsed ? 'none' : 'block' }}>
                                {problem?.link && <GithubCodeDisplay initialUrl={problem?.link} />}
                            </div>
                        </p>
                        
                        <p>{renderChosen()}
                        {renderDeleteButton()}
                        {renderEditButton()}
                        {renderCloseButton()}
                        {renderMarkButton()}
                        </p>
                        <p>Paskutinis atnaujinimas: {problem?.lastUpdate}</p>
                    </div>
                </div>
            </div>

            

            {problem?.isPrivate ? (
                <div className='background'>
                    <div className='pref'></div>
                    <p className='comments-content'>Projektas privatus</p>
                </div>
            ) : (

                <><div>
                    <h2 className='align-left'>Komentarai:</h2>
                    {comments.length > 0 ? (
                        renderComments(comments, likes)
                    ) : (
                        <div className='background'>
                            <div className='pref'></div>
                        <div /*style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}*/className='comments-content'>
                            Komentarų dar nėra.
                        </div>
                        </div>
                    )}
                </div>
                {/* <h3>Palikite komentarą:</h3> */}
                
                    
                    {userRole !== "Svečias" ? (
                        problem?.isClosed ? (
                            <div className='background'>
                                <div className='pref'></div>
                            <p className='comments-content'>Projektas uždarytas</p>
                            </div>
                        ) : (
                            <form onSubmit={handleCommentSubmit}>
                                <div className='background'>
                                <div className='pref'> </div>
                                <div className='comments-content'>
                                <textarea
                                    
                                    value={newCommentText}
                                    onChange={handleNewCommentChange}
                                    placeholder="Rašyti komentarą..."
                                    style={{ width: '100%', height: '50px', background: 6E83, border: 6E83}}

                                />
                                <input type="url"
                                    value={newUrl}
                                    onChange={handleNewUrlChange}
                                    id="websiteInput"
                                    placeholder="Įdėti nuorodą..." 
                                    style={{ width: '100%', height: '50px', background: 6E83, border: 6E83}}
                                    />
                                    
                                    </div></div>
                                <button type="submit" className='com-button'>Pateikti <img src={arrow} alt='arrow'/></button>
                            </form>
                        )
                    ) : (
                        <div className='background'>
                                <div className='pref'></div>
                        <p className='comments-content'>Norint rašyti komentarą prisijunkite.</p>
                        </div>
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
                return (<><text className='state-name'>Dirbu prie projekto</text> &nbsp;  &nbsp; &nbsp; <img src={check2} alt='check2'/></>);
            }
    }
}

function MarkProject({ isPrivate }: { isPrivate: boolean }) {
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
            if (isPrivate) {
                if (!userMark) {
                    return (<button onClick={() => handleMark(data.username)}>Planuoju padėti</button>);
                } else {
                    return (
                            <button onClick={() => handleUnmark(data.username)}>Atšaukti pasižymėjimą</button>
                    );
                }
            } else {
                if (!userMark) {
                    return (<button onClick={() => handleMark(data.username)}>Dirbu prie projekto</button>);
                } else {
                    return (
                        <div>
                            <button onClick={() => handleUnmark(data.username)}>Atšaukti pasižymėjimą</button>
                        </div>
                    );
                }
            }
    }
}

export default Project;
