// components/CardSkeleton.js
import { Card, Placeholder } from 'react-bootstrap';
import Image from 'next/image';
import dummyImage from '../../assets/dummyPlaceholder.webp';
import './CardSkeleton.css';

const CardSkeleton = () => {
  return (
    <Card className="card-skeleton">
      <div className="skeleton-image-wrapper">
        <Image
          className="skeleton-image"
          src={dummyImage}
          alt="loading"
          height={150}
          width={300}
        />
      </div>
      <Card.Body>
        <Placeholder as={Card.Title} animation="glow">
          <Placeholder xs={10} />
        </Placeholder>
        <Placeholder as={Card.Text} animation="glow">
          <Placeholder xs={5} /> <br />
          <Placeholder xs={6} /> <br />
          <Placeholder xs={8} />
        </Placeholder>
      </Card.Body>
    </Card>
  );
};

export default CardSkeleton;
