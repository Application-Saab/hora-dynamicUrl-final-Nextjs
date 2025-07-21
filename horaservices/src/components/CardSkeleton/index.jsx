// import Button from 'react-bootstrap/Button';
import { Card, Placeholder } from 'react-bootstrap';
import dummyImage from '../../assets/dummyPlaceholder.webp';
import Image from "next/image";
export const CardSkeleton = ({ ...props }) => {
    return (
        <Card style={{ width: '18rem' }} className='w-100' {...props}>
            <Image variant="top" className='glow' src={dummyImage} alt='loading' height={150} width={300}/>
            <Card.Body>
                <Placeholder as={Card.Title} animation="glow">
                    <Placeholder xs={10} />
                </Placeholder>
                <Placeholder as={Card.Text} animation="glow">
                    <Placeholder xs={4} />
                    <Placeholder xs={6} /> <Placeholder xs={8} />
                </Placeholder>
            </Card.Body>
        </Card>
    )
}
