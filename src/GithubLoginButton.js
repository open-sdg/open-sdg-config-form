import React, { useEffect, useState } from 'react';

const GithubLoginButton = (props) => {

    const CLIENT_ID = 'd057ffc62f01ce8f3376';
    const [rerender, setRerender] = useState(false);
    const [username, setUsername] = useState('');

    function loginWithGithub() {
        window.location.assign(
            'https://github.com/login/oauth/authorize?client_id=' +
            CLIENT_ID +
            '&scope=public_repo'
        );
    }

    function logoutFromGithub() {
        localStorage.removeItem('accessToken');
        setRerender(!rerender);
    }

    async function getAccessToken(codeParam) {
        await fetch('http://localhost:4000/getAccessToken?code=' + codeParam, {})
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.access_token) {
                localStorage.setItem('accessToken', data.access_token);
                setRerender(!rerender);
                getUsername();
            }
        });
    }

    async function getUsername() {
        await fetch('http://localhost:4000/getUserData', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setUsername(data.login);
        });
    }

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const codeParam = urlParams.get('code');
    
        if (codeParam && localStorage.getItem('accessToken') === null) {
          getAccessToken(codeParam);
        }
    });

    //const { } = props;
    return (
        <>
        {localStorage.getItem('accessToken')
            ? <button onClick={logoutFromGithub}>Logout ({username})</button>
            : <button onClick={loginWithGithub}>Login with Github</button>
        }
        </>
    )
}

export default GithubLoginButton;
