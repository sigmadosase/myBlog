import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/blogs', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        setBlogs(response.data.blogs);
      })
      .catch((err) => {
        toast.error('Blogs fetch karne mein error');
      });
  }, []);

  return (
    <Container className="my-4">
      <h2>Drafts</h2>
      <Row>
        {blogs
          .filter((blog) => blog.status === 'draft')
          .map((blog) => (
            <Col md={4} key={blog._id} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{blog.title}</Card.Title>
                  <Card.Text>
                    {blog.content.replace(/<[^>]+>/g, '').substring(0, 100)}...
                  </Card.Text>
                  <Card.Text>Tags: {blog.tags.join(', ')}</Card.Text>
                  <Link to={`/editor/${blog._id}`} className="btn btn-primary">
                    Edit
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
      <h2>Published Blogs</h2>
      <Row>
        {blogs
          .filter((blog) => blog.status === 'published')
          .map((blog) => (
            <Col md={4} key={blog._id} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{blog.title}</Card.Title>
                  <Card.Text>
                    {blog.content.replace(/<[^>]+>/g, '').substring(0, 100)}...
                  </Card.Text>
                  <Card.Text>Tags: {blog.tags.join(', ')}</Card.Text>
                  <Link to={`/editor/${blog._id}`} className="btn btn-primary">
                    Edit
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  );
};

export default BlogList;