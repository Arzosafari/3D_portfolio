import { useState, useEffect } from 'react';
import { teamMembersAPI } from './api';

function TeamMembers() {
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    image: '',
    email: '',
    linkedin: '',
    is_active: true,
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const response = await teamMembersAPI.getAll();
      setMembers(response.data);
    } catch (err) {
      console.error('Failed to load team members:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await teamMembersAPI.update(editingMember.id, formData);
      } else {
        await teamMembersAPI.create(formData);
      }
      loadMembers();
      setShowForm(false);
      setEditingMember(null);
      setFormData({
        name: '',
        role: '',
        bio: '',
        image: '',
        email: '',
        linkedin: '',
        is_active: true,
      });
    } catch (err) {
      console.error('Failed to save team member:', err);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData(member);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await teamMembersAPI.delete(id);
        loadMembers();
      } catch (err) {
        console.error('Failed to delete team member:', err);
      }
    }
  };

  if (showForm) {
    return (
      <div style={{ padding: '30px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginBottom: '25px', color: '#1a1a1a', fontSize: '24px' }}>{editingMember ? 'Edit Team Member' : 'New Team Member'}</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: '500' }}>Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%', padding: '12px', boxSizing: 'border-box', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: '500' }}>Role:</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              style={{ width: '100%', padding: '12px', boxSizing: 'border-box', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: '500' }}>Bio:</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              style={{ width: '100%', padding: '12px', boxSizing: 'border-box', minHeight: '100px', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', outline: 'none', resize: 'vertical' }}
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
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: '500' }}>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{ width: '100%', padding: '12px', boxSizing: 'border-box', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: '500' }}>LinkedIn:</label>
            <input
              type="text"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              style={{ width: '100%', padding: '12px', boxSizing: 'border-box', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#333', fontSize: '14px', fontWeight: '500' }}>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              Active
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
        <h2 style={{ color: '#1a1a1a', fontSize: '24px' }}>Team Members</h2>
        <button onClick={() => setShowForm(true)} style={{ padding: '12px 24px', cursor: 'pointer', backgroundColor: '#3d58c2', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', transition: 'background-color 0.3s' }}>
          Add Team Member
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
        <thead>
          <tr style={{ borderBottom: '3px solid #e0e0e0', backgroundColor: '#f8f9fa' }}>
            <th style={{ padding: '15px', textAlign: 'left', color: '#333', fontSize: '14px', fontWeight: '600' }}>Name</th>
            <th style={{ padding: '15px', textAlign: 'left', color: '#333', fontSize: '14px', fontWeight: '600' }}>Role</th>
            <th style={{ padding: '15px', textAlign: 'left', color: '#333', fontSize: '14px', fontWeight: '600' }}>Email</th>
            <th style={{ padding: '15px', textAlign: 'left', color: '#333', fontSize: '14px', fontWeight: '600' }}>Active</th>
            <th style={{ padding: '15px', textAlign: 'left', color: '#333', fontSize: '14px', fontWeight: '600' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} style={{ borderBottom: '1px solid #e0e0e0', transition: 'backgroundColor 0.2s' }}>
              <td style={{ padding: '15px', color: '#333', fontSize: '14px' }}>{member.name}</td>
              <td style={{ padding: '15px', color: '#666', fontSize: '14px' }}>{member.role}</td>
              <td style={{ padding: '15px', color: '#666', fontSize: '14px' }}>{member.email || '-'}</td>
              <td style={{ padding: '15px' }}>
                <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', backgroundColor: member.is_active ? '#27ae60' : '#95a5a6', color: 'white' }}>
                  {member.is_active ? 'Yes' : 'No'}
                </span>
              </td>
              <td style={{ padding: '15px' }}>
                <button onClick={() => handleEdit(member)} style={{ marginRight: '10px', cursor: 'pointer', padding: '8px 16px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', transition: 'background-color 0.3s' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(member.id)} style={{ cursor: 'pointer', padding: '8px 16px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', transition: 'background-color 0.3s' }}>
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

export default TeamMembers;
