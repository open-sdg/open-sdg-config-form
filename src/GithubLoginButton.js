import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { Octokit } from '@octokit/rest';

const GithubLoginButton = (props) => {

    const { githubClientId, proxyUrl } = props;
    const [rerender, setRerender] = useState(false);

    function loginWithGithub() {
        window.location.assign(
            'https://github.com/login/oauth/authorize' +
            '?client_id=' + githubClientId +
            '&scope=public_repo' +
            '&redirect_uri=' + encodeURIComponent(window.location.href)
        );
    }

    function logoutFromGithub() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
        setRerender(!rerender);
    }

    async function getAccessToken(codeParam) {
        await fetch(proxyUrl + '/getAccessToken?code=' + codeParam, {})
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.access_token) {
                localStorage.setItem('accessToken', data.access_token);
                getUsername();
                setRerender(!rerender);
            }
        });
    }

    async function getUsername() {
        if (!localStorage.getItem('accessToken')) {
            return;
        }
        const octokit = new Octokit({
            auth: localStorage.getItem('accessToken'),
        });
        const { data: user } = await octokit.rest.users.getAuthenticated();
        localStorage.setItem('username', user.login);
        setRerender(!rerender);
    }

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const codeParam = urlParams.get('code');
    
        if (codeParam && localStorage.getItem('accessToken') === null) {
            getAccessToken(codeParam);
        }
        else if (localStorage.getItem('username') === null) {
            getUsername();
        }
    });

    return (
        <>
        {localStorage.getItem('accessToken')
            ? <Button sx={{ mt:2, mb:2, mr: 2 }} variant="contained" onClick={logoutFromGithub}>
                Logout {localStorage.getItem('username')}
              </Button>
            : <Button sx={{ mt:2, mb:2, mr: 2 }} variant="contained" onClick={loginWithGithub}>
                Login with Github
              </Button>
        }
        </>
    )
}

export default GithubLoginButton;
