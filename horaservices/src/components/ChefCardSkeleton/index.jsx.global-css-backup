import React, { Suspense, lazy } from "react";
import { Spinner } from "react-bootstrap";
import '../../css/chefcardskeleton.css';

const ChefCardSkeleton = lazy(() => import('./ChefCardSkeletonLazy'));

export const CardSkeletonGrid = ({ loading = false }) => {
  return (
      <div className="chef-card-grid">
        {loading &&
            <Suspense fallback={<Spinner animation="border" />}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item, index) => (
                  <ChefCardSkeleton key={index} />
              ))}
            </Suspense>
        }
      </div>
  );
};