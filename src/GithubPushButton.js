import React from 'react';
import { Button } from '@mui/material';

const GithubLoginButton = (props) => {

    const { proxyUrl, data, errors, filename, repository } = props;

    async function pushToGithub() {
        if (errors.length > 0) {
            const errorMessages = errors.map((error) => '- ' + error.message);
            let message = 'Please correct the following errors: \n';
            alert(message + errorMessages.join('\n'));
        }
        else {
            const response = await fetch(proxyUrl + '/pushCode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: data,
                    filename: filename,
                    repository: repository,
                }),
            });
            console.log(response);
            return response.json;
        }
    }

    return (
        <Button variant="contained" onClick={pushToGithub}>
            Push to Github
        </Button>
    )
}

export default GithubLoginButton;
