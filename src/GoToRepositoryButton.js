import React from 'react';
import { Button } from '@mui/material';

const GoToRepositoryButton = (props) => {
    const { repoUrl, repositoryLink } = props;
    const clickHandler = (e) => {
        window.open(repoUrl + repositoryLink, '_blank').focus();
    }
    return (
        <Button sx={{ mt:2, mb:2, mr: 2 }} variant="contained" onClick={clickHandler}>
            Go to repository
        </Button>
    )
}

export default GoToRepositoryButton;
