import { whereAreYouData } from '@/utils/homeDumpData/whereAreYouData'
import React from 'react'

export function CategorySection() {
  return (
    <div className="container my-3">
    <h1 className="fw-bold text-start mb-2 text-center">
      What are you <span className="text-purple text-center">into?</span>
    </h1>
    <h3 className="fs-5 text-muted mb-5 text-center ">
      We offer a variety of services, differing in the total value of
      needed.
    </h3>

    <div className="row g-4">
      {whereAreYouData.map((category) => (
        <div key={category.id} className="col-12 col-md-6 col-lg-4">
          <div className="card h-100 d-flex flex-column shadow-sm">
            <a
              href={category.link}
              rel="noopener noreferrer"
              className="text-decoration-none text-dark"
            >
              <img
                src={category.imageUrl}
                alt={category.title}
                className="card-img-top object-fit-cover"
                style={{ height: "180px" }}
              />
            </a>
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{category.title}</h5>
              <ul className="list-unstyled small mb-3">
                {category.points.map((point, index) => (
                  <li key={index} className="mb-1">
                    • {point}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <a
                  href={category.link}
                  className="btn btn-outline-primary btn-sm w-100"
                >
                  Explore More
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  )
}

