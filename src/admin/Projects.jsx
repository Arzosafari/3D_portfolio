import { useState, useEffect } from 'react';
import { projectsAPI } from './api';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    category: '',
    link: '',
    is_published: false,
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await projectsAPI.update(editingProject.id, formData);
      } else {
        await projectsAPI.create(formData);
      }
      loadProjects();
      setShowForm(false);
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        image: '',
        category: '',
        link: '',
        is_published: false,
      });
    } catch (err) {
      console.error('Failed to save project:', err);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData(project);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await projectsAPI.delete(id);
        loadProjects();
      } catch (err) {
        console.error('Failed to delete project:', err);
      }
    }
  };

  if (showForm) {
    return (
      <div style={{ padding: '30px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginBottom: '25px', color: '#1a1a1a', fontSize: '24px' }}>{editingProject ? 'Edit Project' : 'New Project'}</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: '500' }}>Title:</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{ width: '100%', padding: '12px', boxSizing: 'border-box', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: '500' }}>Description:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: '100%', padding: '12px', boxSizing: 'border-box', minHeight: '100px', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', outline: 'none', resize: 'vertical' }}
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: '500' }}>Image URL:</label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              style={{ width: '100%', padding: '12px', boxSizing: 'border-box', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: '500' }}>Category:</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{ width: '100%', padding: '12px', boxSizing: 'border-box', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: '500' }}>Link:</label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              style={{ width: '100%', padding: '12px', boxSizing: 'border-box', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#333', fontSize: '14px', fontWeight: '500' }}>
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              Published
            </label>
          </div>
          <button type="submit" style={{ padding: '12px 24px', marginRight: '10px', cursor: 'pointer', backgroundColor: '#3d58c2', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', transition: 'background-color 0.3s' }}>
            Save
          </button>
          <button type="button" onClick={() => setShowForm(false)} style={{ padding: '12px 24px', cursor: 'pointer', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', transition: 'background-color 0.3s' }}>
            Cancel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ color: '#1a1a1a', fontSize: '24px' }}>Projects</h2>
        <button onClick={() => setShowForm(true)} style={{ padding: '12px 24px', cursor: 'pointer', backgroundColor: '#3d58c2', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', transition: 'background-color 0.3s' }}>
          Add Project
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
        <thead>
          <tr style={{ borderBottom: '3px solid #e0e0e0', backgroundColor: '#f8f9fa' }}>
            <th style={{ padding: '15px', textAlign: 'left', color: '#333', fontSize: '14px', fontWeight: '600' }}>Title</th>
            <th style={{ padding: '15px', textAlign: 'left', color: '#333', fontSize: '14px', fontWeight: '600' }}>Category</th>
            <th style={{ padding: '15px', textAlign: 'left', color: '#333', fontSize: '14px', fontWeight: '600' }}>Published</th>
            <th style={{ padding: '15px', textAlign: 'left', color: '#333', fontSize: '14px', fontWeight: '600' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} style={{ borderBottom: '1px solid #e0e0e0', transition: 'backgroundColor 0.2s' }}>
              <td style={{ padding: '15px', color: '#333', fontSize: '14px' }}>{project.title}</td>
              <td style={{ padding: '15px', color: '#666', fontSize: '14px' }}>{project.category || '-'}</td>
              <td style={{ padding: '15px' }}>
                <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', backgroundColor: project.is_published ? '#27ae60' : '#95a5a6', color: 'white' }}>
                  {project.is_published ? 'Yes' : 'No'}
                </span>
              </td>
              <td style={{ padding: '15px' }}>
                <button onClick={() => handleEdit(project)} style={{ marginRight: '10px', cursor: 'pointer', padding: '8px 16px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', transition: 'background-color 0.3s' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(project.id)} style={{ cursor: 'pointer', padding: '8px 16px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', transition: 'background-color 0.3s' }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Projects;
