import { useInView } from 'react-intersection-observer';

const LazyGridItem = ({ children, className, onClick, style }) => {
  const { ref, inView } = useInView({
    triggerOnce: false, 
    rootMargin: '200px 0px', 
  });

  return (
    <div
      ref={ref}
      className={className}
      onClick={onClick}
      style={{
        ...style,
        minHeight: '150px', 
        visibility: inView ? 'visible' : 'hidden', 
      }}
    >
      {inView ? children : null} 
    </div>
  );
};
export default LazyGridItem;