import React from 'react';
import YouTubeEmbed from '/src/components/YouTubeEmbed.jsx';

const Resources = () => {
    return (
        <div>
            <h1>Resources</h1>
            <section>
                <h2>How to Meditate for Beginners</h2>
                <p>
                    Meditation is a simple yet powerful practice that can help reduce stress, improve focus, and enhance overall well-being. To get started, find a quiet and comfortable place where you won't be disturbed. Sit in a relaxed position with your back straight, either on a chair or a cushion. Close your eyes and take a few deep breaths, allowing your body to relax. Focus on your breath, noticing the sensation of air entering and leaving your nostrils. If your mind wanders, gently bring your attention back to your breath without judgment. Start with just a few minutes each day and gradually increase the duration as you become more comfortable. Remember, consistency is key, and it's perfectly normal for your mind to wander during meditation. With regular practice, you'll find it easier to stay focused and enjoy the benefits of meditation.
                </p>
                <YouTubeEmbed videoId="mMMerxh_12U" />
            </section>
        </div>
    );
};

export default Resources;