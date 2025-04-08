import React from 'react';
import { Helmet } from 'react-helmet-async';

interface HelmetComponentProps {
    title?: string;
    description?: string;
    keywords?: string;  // Add keywords prop
    ogTitle?: string;   // Add Open Graph title
    ogDescription?: string; // Add Open Graph description
    ogImage?: string;   // Add Open Graph image URL
    ogUrl?: string;     // Add Open Graph canonical URL
}

const HelmetComponent: React.FC<HelmetComponentProps> = ({
    title = '学习English - Learn English with Native Tutors',
    description = 'Connect with native English tutors for personalized online lessons. Improve your speaking, listening, and grammar skills.',
    keywords = 'learn english, english tutor, online english lessons, esl, english speaking, english grammar',
    ogTitle = '学习English - Learn English with Native Tutors',
    ogDescription = 'Connect with native English tutors for personalized online lessons.',
    ogImage,
    ogUrl
}) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph Tags */}
            <meta property="og:title" content={ogTitle} />
            <meta property="og:description" content={ogDescription} />
            {ogImage && <meta property="og:image" content={ogImage} />}
            {ogUrl && <meta property="og:url" content={ogUrl} />}
            <meta property="og:type" content="website" />

            {/* Optional: Twitter Card Tags */}
            {/* 
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:title" content={ogTitle}>
            <meta name="twitter:description" content={ogDescription}>
            {ogImage && <meta name="twitter:image" content={ogImage}>}
            */}
        </Helmet>
    );
};

export default HelmetComponent; 