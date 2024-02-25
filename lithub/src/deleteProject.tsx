import React from 'react';

interface Props {
    onDelete: () => void;
}

const DeleteProject: React.FC<Props> = ({ onDelete }) => {
    return (
        <button onClick={onDelete}>Delete</button>
    );
}

export default DeleteProject;