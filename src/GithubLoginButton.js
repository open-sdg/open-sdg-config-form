import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';

const GithubLoginButton = (props) => {

    const { githubClientId } = props;
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
        await fetch('https://open-sdg-github-auth-production.up.railway.app/getAccessToken?code=' + codeParam, {})
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.access_token) {
                localStorage.setItem('accessToken', data.access_token);
                getUsername();
            }
        });
    }

    async function getUsername() {
        await fetch('https://open-sdg-github-auth-production.up.railway.app/getUserData', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            localStorage.setItem('username', data.login);
            setRerender(!rerender);
        });
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
            ? <Button variant="contained" onClick={logoutFromGithub}>
                Logout {localStorage.getItem('username')}
              </Button>
            : <Button variant="contained" onClick={loginWithGithub}>
                Login with Github
              </Button>
        }
        </>
    )
}

export default GithubLoginButton;
