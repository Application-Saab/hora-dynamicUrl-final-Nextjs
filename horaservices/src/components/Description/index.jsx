const SectionDescription = ({ title = "Description", paragraphs = [] }) => {
    return (
      <div className="container my-4">
        <div className="w-100">
          <h2
            className="h4 text-capitalize fw-bold text-purple text-start border-bottom pb-2 mb-4"
            style={{ letterSpacing: '1.5px'}}
          >
            {title}
          </h2>
  
          <div className="fs-6 text-muted">
            {paragraphs.map((para, index) => (
              <p key={index} className="mb-3">
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default SectionDescription;
  