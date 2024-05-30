import React from 'react';
import YouTube from 'react-youtube';

//embed a youtube video
const YouTubeEmbed = ({ videoId }) => {
    const opts = {
        height: '300',
        width: '500',
        playerVars: {
            autoplay: 0,
        },
    };

    return <YouTube videoId={videoId} opts={opts} />;
};

export default YouTubeEmbed;