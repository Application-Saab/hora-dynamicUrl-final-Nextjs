import React from 'react'
import Image from 'next/image';

 const blogData = [
    {
      id: 1,
      date: "June 15, 2017",
      category: "Tutorial",
      title: "12 Tips for Indoor Natural Light Photography",
      image: "/assets/bird1.jpg",
    },
    {
      id: 2,
      date: "June 1, 2017",
      category: "Personal",
      title: "Dealing with Weird Job Interview Questions",
      image: "/assets/bird2.jpg",
    },
    {
      id: 3,
      date: "May 23, 2017",
      category: "Travel",
      title: "How to Spend 4 Days in Amsterdam",
      image: "/assets/bird3.jpg",
    },
  ];
 const BlogPosts = () => {
  return (<>
       <div className="blog-posts-container">
        <h2 className="blog-title">From the Blog</h2>
        <h1 className="blog-sub-title">Recent Posts</h1>
        <img
          src="https://cdn.prod.website-files.com/593008e46c534e61e392e0f2/5938f139d7978c0a4faf1460_Sep.svg"
          alt=""
          class="section-separator"
        ></img>
        <div className="posts">
          {blogData.map((post) => (
            <div key={post.id} className="post">
              <Image
                src={post.image}
                alt={post.title}
                className="post-image"
                width={10}
                height={10}
              />
              <div className="post-details">
                <div className="post-meta">
                  <p className="post-date">{post.date}</p>
                  <p className="post-category">{post.category}</p>
                </div>
                <h3 className="post-title">{post.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

  </>
  )
}
export default BlogPosts;