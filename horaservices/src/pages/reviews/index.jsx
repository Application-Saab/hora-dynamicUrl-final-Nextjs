import { allReviewsData } from '@/util/ReviewMockData';
import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const RatingHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: green;

  @media (max-width: 600px) {
    font-size: 20px;
  }
`;

const Star = styled.span`
  color: gold;
  margin-right: 5px;
  font-size: 24px;

  @media (max-width: 600px) {
    font-size: 20px;
  }
`;

const VerifiedReviews = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: green;

  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

const ReviewContainer1 = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 30px;
  margin-bottom: 30px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ReviewCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  position: relative;
`;

const UserInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  background-color: #ccc;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  margin-right: 10px;
`;

const UserName = styled.h3`
  margin: 0;
  font-size: 16px;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const BookingInfo = styled.div`
  font-size: 12px;
  color: #666;
  display: flex;
  flex-direction: column;

  @media (max-width: 600px) {
    font-size: 10px;
  }
`;

const BookingDate = styled.span`
  margin-top: 20px;
  font-size: 12px;
  color: #666;

  @media (max-width: 600px) {
    font-size: 10px;
  }
`;
const UserRating = styled.div`
   position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;

  @media (max-width: 600px) {
    font-size: 18px;
  }

  .filled {
    color: gold;
  }

  .blank {
    color: grey;
  }
`;

const ReviewContainer = styled.div`
  position: relative;
  padding: 20px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
`;

const Indicators = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
`;

const Indicator = styled.span`
  font-size: 12px;
  color: #4a4a4a;
  background-color: #f0f0f0;
  padding: 2px 5px;
  border-radius: 3px;

  @media (max-width: 600px) {
    font-size: 10px;
  }
`;

const ReviewText = styled.div`
  font-size: 14px;
  color: #333;
  max-height: 100px;
  overflow-y: auto;
  padding-right: 5px;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
  }

  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

const LoadMoreButton = styled.button`
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #9252aa;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const getStars = (rating) => {
    const filledStars = Array(rating).fill(<span className="filled">★</span>);
    const blankStars = Array(5 - rating).fill(<span className="blank">★</span>);
    return [...filledStars, ...blankStars];
  };

const CustomersReviews = () => {
    const [visibleReviews, setVisibleReviews] = useState(10);

    const loadMore = () => {
        setVisibleReviews((prevVisible) => Math.min(prevVisible + 10, allReviewsData.length));
    };

    return (
        <Container>
            <Header>
                <h1>Ratings & Reviews</h1>
                <p>HORA has Served 5 Lakh people in 20+ cities!</p>
                <RatingHeader>
                    <Star>★</Star> 4.7 / 5 Average Rating
                </RatingHeader>
                <VerifiedReviews>✔ 10238 Verified Reviews</VerifiedReviews>
            </Header>
            <ReviewContainer1>
                {allReviewsData.slice(0, visibleReviews).map((review, index) => (
                    <ReviewCard key={index}>
                        <UserInfo>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar src={review.avatar} />
                                <div>
                                    <UserName>{review.name}</UserName>
                                    <BookingInfo>{review.booking}</BookingInfo>
                                </div>
                            </div>
                            <BookingDate>{review.date}</BookingDate>
                        </UserInfo>
                        <UserRating>{getStars(review.rating)}</UserRating>
                        <ReviewText>{review.text}</ReviewText>
                    </ReviewCard>
                ))}
            </ReviewContainer1>
            {visibleReviews < allReviewsData.length && (
                <LoadMoreButton onClick={loadMore}>Load More</LoadMoreButton>
            )}
        </Container>
    );
};

export default CustomersReviews;