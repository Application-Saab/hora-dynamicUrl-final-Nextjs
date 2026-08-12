import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../css/ske.css';

const SkeletonLoader = () => {
    const dishSkeletons = Array(7).fill(null).map((_, index) => (
        <div key={index} className="dish-skeleton">
            <Skeleton circle={true} height={50} width={50} />
            <div className="dish-info">
                <Skeleton height={20} width="60%" className="name" style={{ marginBottom: '5px' }} />
                <Skeleton height={20} width="40%" className="price" />
            </div>
        </div>
    ));

    return (
        <div className="skeleton-loader">
            {/* Skeleton for the bill value message */}
            <Skeleton height={20} width="100%" style={{ marginBottom: '10px' }} />

            <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px', margin: '10px 0' }}>
                {Array(2).fill().map((_, index) => (
                    <Skeleton key={index} height={40} width={80} />
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px', margin: '10px 0' }}>
                {Array(6).fill().map((_, index) => (
                    <Skeleton key={index} height={40} width={80} />
                ))}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {dishSkeletons}
            </div>

            {/* Skeleton for the continue button */}
            <Skeleton height={50} width="100%" style={{ marginTop: '20px' }} />
        </div>
    );
};

export default SkeletonLoader;
