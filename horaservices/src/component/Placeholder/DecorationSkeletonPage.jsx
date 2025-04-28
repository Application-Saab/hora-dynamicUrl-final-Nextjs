import React from 'react';

const DecorationSkeletonPage = () => {
  return (
    <div className="container py-4">

      {/* Top Categories */}
      <div className="d-flex justify-content-lg-between overflow-auto mb-4">
        {[1,2,3,4,5,6,7].map((_, index) => (
          <div key={index} className="me-3">
            <div className="placeholder rounded" style={{ width: '100px', height: '100px' }}></div>
          </div>
        ))}
      </div>

      {/* Section Title */}
      <h4 className="placeholder-glow mb-3">
        <span className="placeholder col-3"></span>
      </h4>

      {/* Product Cards */}
      <div className="row">
        {[1,2,3,4,5,6,7,8].map((_, index) => (
          <div className="col-6 col-md-3 mb-4" key={index}>
            <div className="card">
              <div className="placeholder rounded" style={{ width: '100%', height: '180px' }}></div>
              <div className="card-body">
                <h5 className="placeholder-glow">
                  <span className="placeholder col-6"></span>
                </h5>
                <p className="placeholder-glow">
                  <span className="placeholder col-4"></span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default DecorationSkeletonPage;
