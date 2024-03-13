import { useNavigate, useLocation } from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import axios from "axios";
import { Link } from "react-router-dom";
import {jwtDecode, JwtPayload} from "jwt-decode";
import { FaStar } from "react-icons/fa";

interface CustomJwtPayload extends JwtPayload {
    username: string;
    role: string;
    // Add other custom properties if needed
}


const useQuery= () => {
    return new URLSearchParams(useLocation().search);
}

interface problemData{
    title:string,
    lastUpdate:string,
    languages:string,
    source:string,
    description:string,
    link:string
}

interface markedData{
    userName:string
}

interface CommentData {
    commentId: number;
    author: string;
    text: string;
    postedDate: string;
    replies?: CommentData[]; // Optional for nesting replies
}

function SetMarks(id:number){
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
                "author": "John Doe",
                "text": "This is a sample comment.",
                "problemId": 1,
                "parentCommentId": null  // Include this only if making a reply to another comment
              }
              
              
              );
    
            setNewCommentText(''); // Clear the comment box after successful submission
            // Fetch comments again to update UI
            await fetchComments(); // Assuming you've implemented fetchComments method to reload comments
        } catch (error) {
            console.error("Failed to submit comment", error);
        }
    };
    // Function to render comments and their replies recursively
    const renderComments = (comments: CommentData[]) => {
        return comments.map((comment) => (
            <div key={comment.commentId}>
                <p><strong>{comment.author}</strong> at {new Date(comment.postedDate).toLocaleString()}:</p>
                <p>{comment.text}</p>
                {comment.replies && comment.replies.length > 0 && (
                    <div style={{ marginLeft: '20px' }}>
                        {renderComments(comment.replies)}
                    </div>
                )}
            </div>
        ));
    };
    return (
        <><div>
                <div>
                    <center><h1>{problem?.title} <IsMarked/></h1></center>
                    <p>{problem?.description}</p>
                    <p><b>Įkėlėjas: </b>{problem?.source}</p>
                    <p><b>Kalbos: </b>{problem?.languages}</p>
                    <p><b>Paskutinis atnaujinimas: </b>{problem?.lastUpdate}</p>
                    <select  id="id" value= "Pasižymėją programuotojai" >
                    <option value="start" hidden>Pasižymėją programuotojai</option>
                        {marks.map(mark => (
                            <option value="Vardas" disabled>{mark.userName}</option>
                        ))}
                    </select>           
                    <div>
                        <h2>Failai:</h2>
                        <a href={problem?.link}>{problem?.link}</a>
                    </div>
                    <MarkProject />
                    <button onClick={() => handleDelete()}>Šalinti</button>
                    <Link to={`/editProject?id=${id}`}>
                        <button>Redaguoti</button>
                    </Link>
                </div>

                <div>
                <h2>Comments:</h2>
                {comments.length > 0 ? (
                    renderComments(comments)
                ) : (
                    <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
                        Komentarų dar nėra.
                    </div>
                )}
            </div>

            <div>
                <h3>Leave a Comment</h3>
                <form onSubmit={handleCommentSubmit}>
                    <textarea
                        value={newCommentText}
                        onChange={handleNewCommentChange}
                        placeholder="Write your comment here..."
                        style={{ width: '100%', height: '100px' }}
                    />
                    <button type="submit">Submit Comment</button>
                </form>
            </div>
        </div></>
    );
}

function IsMarked(){
    const marks = SetMarks(Number(useQuery().get('id')));
    let token=localStorage.getItem('accessToken')
        switch (token){
            case null:
                return(null);
            default:
                const data :CustomJwtPayload=jwtDecode(token)
                if(marks.find(x=> x.userName === data.username) === undefined){
                    return(null);
                }
                else{
                    return(<FaStar />);
                }
        }
}

function MarkProject(){
    const id = useQuery().get('id');
    const marks = SetMarks(Number(id));
    const handleMark = async (name:string) => {
    const mark = {problemId:Number(id), userName:name}
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

    let token=localStorage.getItem('accessToken')
        switch (token){
            case null:
                return(null);
        default:
            const data :CustomJwtPayload=jwtDecode(token)
                if(marks.find(x=> x.userName === data.username) === undefined){
                    return(<button onClick={() => handleMark(data.username)}>Planuoju padėti</button>)
                }
                else{
                    return(null);
                }
        }
}

export default Project;
