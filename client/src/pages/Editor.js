import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const quillRef = useRef(null);
  const lastSavedData = useRef({});

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/api/blogs/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((response) => {
          const blog = response.data.blog;
          setTitle(blog.title);
          setContent(blog.content);
          setTags(blog.tags.join(', '));
        })
        .catch((err) => {
          toast.error('Blog fetch karne mein error');
        });
    }
  }, [id]);

  const saveDraft = async () => {
    const data = { id, title, content, tags };
    if (JSON.stringify(data) === JSON.stringify(lastSavedData.current)) {
      return;
    }
    lastSavedData.current = data;
    setSaveStatus('Saving...');
    try {
      const response = await axios.post(
        'http://localhost:5000/api/blogs/save-draft',
        data,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSaveStatus('Draft saved!');
      toast.success('Draft saved!');
      if (!id) {
        navigate(`/editor/${response.data.blog._id}`);
      }
    } catch (err) {
      setSaveStatus('Error saving draft');
      toast.error('Draft save karne mein error');
    }
  };

  const publishBlog = async () => {
    setSaveStatus('Publishing...');
    try {
      await axios.post(
        'http://localhost:5000/api/blogs/publish',
        { id, title, content, tags },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSaveStatus('Blog published!');
      toast.success('Blog published!');
      navigate('/blogs');
    } catch (err) {
      setSaveStatus('Error publishing blog');
      toast.error('Blog publish karne mein error');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (title && content) {
        saveDraft();
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [title, content, tags]);

  return (
    <Container className="my-4">
      <h2>{id ? 'Edit Blog' : 'New Blog'}</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <ReactQuill
            ref={quillRef}
            value={content}
            onChange={setContent}
            theme="snow"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Tags (comma-separated)</Form.Label>
          <Form.Control
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </Form.Group>
        <Row>
          <Col>
            <Button onClick={saveDraft} className="me-2">
              Save as Draft
            </Button>
            <Button onClick={publishBlog} variant="success">
              Publish
            </Button>
          </Col>
        </Row>
        <p className="mt-3">{saveStatus}</p>
      </Form>
    </Container>
  );
};

export default Editor;