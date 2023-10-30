import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import * as groupActions from '../../store/groups';
import { getGroupDetail } from '../../store/groups';

const GroupsUpdates = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { groupId } = useParams(); 

  const group = useSelector(state => {
    const fetchedGroup = state.groups.currentGroup;
    return fetchedGroup;
  });

  const [errors, setErrors] = useState([]);
  const [submissionAttempt, setSubmissionAttempt] = useState(false);

  const initialFormData = {
    location: '',
    name: '',
    about: '',
    type: '',
    private: false, 
    imgUrl: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (!group || Object.keys(group).length === 0 || !group[0] || !group[0].Venues || !group[0].Venues[0]) {
      return;
    }
  
    setFormData(prevData => ({
      ...prevData,
      location: `${group[0].city}, ${group[0].state}` || '',
      name: group[0].name || '',
      about: group[0].about || '',
      type: group[0].type || '',
      private: group[0].private || false, 
      imgUrl: group[0].groupImages[0].url || ''
    }));
  }, [group]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    if (groupId) {
      dispatch(getGroupDetail(groupId));
    }
  }, [dispatch, groupId]);

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmissionAttempt(true);
    
    const loadErrors = [];
    if (!formData.location) loadErrors.push('City and State is required');
    if (!formData.name) loadErrors.push('Group name is required');
    if (formData.about.length < 30) loadErrors.push('Description must be at least 30 characters long');
    if (!formData.type) loadErrors.push('Group type is required');
    if (formData.private === undefined || formData.private === null) loadErrors.push('Visibility Type is required');
    if (formData.imgUrl && !formData.imgUrl.match(/\.(jpg|jpeg|png)$/)) {
      loadErrors.push('Image URL must end in .jpg, .jpeg, or .png');
    }
  
    setErrors(loadErrors);

    if (loadErrors.length === 0) {
      let city, state;

      if (formData.location) {
        const locationParts = formData.location.split(',').map(part => part.trim());
        if (locationParts.length === 2) {
          city = locationParts[0];
          state = locationParts[1];
        } else {
          console.log('figure out what I want this to do')
        }
      }

      try {
        const updatedGroup = {
          city: city,
          state: state,
          name: formData.name,
          about: formData.about,
          type: formData.type,
          private: formData.private === 'true',
          previewImage: formData.imgUrl,
        };
        console.log(groupId, 'GROUPID HERE')
        console.log(updatedGroup, 'UPDATEDGROUP HERE')

        const response = await dispatch(groupActions.updateGroup(updatedGroup, groupId)); 
        console.log(response, 'RESPONSE HERE');

        if (response && response.id) {
          history.push(`/groups/${response.id}`);
        } else {
          console.error('Error updating group.');
        }
      } catch (error) {
        const data = error.response?.data;
        if (data && data.errors) {
          setErrors(data.errors);
        }
      }
    }
  };

return (
  <div id='main-form-container'>
    <div className='sub-form-container'>
      <div className='form-header'>
        <h3>Update your groups information</h3>
        <h1>We'll walk you through a few steps to update your group's information</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='border-div'>
          <h1>First, set your group's location.</h1>
          <h3>Meetup groups meet locally, in person and online. We'll connect you with people in your area, and more can join you online.</h3>
          <input
            type='text'
            value={formData.location}
            onChange={handleChange}
            placeholder="City, State"
            name='location'></input>
            <div className="field-error-placeholder">
            {submissionAttempt && !formData.location && <p className='field-error'>City is required</p>}
            </div>
        </div>
        <div className='border-div'>
          <h1>What will your group's name be?</h1>
          <h3>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</h3>
          <input
            type='text'
            value={formData.name}
            onChange={handleChange}
            placeholder="What is your group name?" name='name'></input>
            <div className="field-error-placeholder">
            {submissionAttempt && !formData.name && <p className='field-error'>Group Name is required</p>}
            </div>
        </div>
        <div className='border-div'>
          <h1>Now describe what your group will be about</h1>
          <h3>People will see this when we promote your group, but you'll be able to add to it later, too.</h3>
          <ol>
            <li>What's the purpose of the group?</li>
            <li>Who should join?</li>
            <li>What will you do at your events?</li>
          </ol>
          <textarea
            type='text'
            value={formData.about}
            onChange={handleChange}
            placeholder={formData.about} name='about'></textarea>
            <div className="field-error-placeholder">
            {submissionAttempt && formData.about.length < 30 && (
  <p className='field-error'>Description must be at least 30 characters long</p>)}
  </div>
        </div>

        <div id='final-steps-div'>
          <div>
            <h1>Final steps...</h1>
            <h3>Is this an in person or online group?</h3>
            <select
              name='type'
              value={formData.type}
              onChange={handleChange}
            >
              <option value=''>(select one)</option>
              <option value='In Person'>In Person</option>
              <option value='Online'>Online</option>
            </select>
            {submissionAttempt && !formData.type && (
    <p className='field-error'>Group Type is required</p>
  )}
          </div>

          <div className='final-steps-border-div'>
            <h3>Is this group private or public?</h3>
            <select
              name='private'
              value={formData.private}
              onChange={handleChange}
            >
              <option value=''>(select one)</option>
              <option value={true}>Private</option>
              <option value={false}>Public</option>
            </select>
            {submissionAttempt && formData.private === '' && (
    <p className='field-error'>Visibility Type is required</p>
  )}
          </div>
        </div>

        <div className='img-div'>
          <h3>Please add an image url for your group below:</h3>
          <input
            type='text'
            value={formData.imgUrl}
            onChange={handleChange}
            placeholder={group.imgUrl} name='imgUrl'></input>
            <div className="field-error-placeholder">
            {submissionAttempt && !formData.imgUrl.match(/\.(jpg|jpeg|png)$/) && <p className='field-error'>Image URL must end in .jpg, .jpeg, or .png</p>}
            </div>
        </div>

        <button type='submit' className='newGroupSubmitButton'>
        Update Group
        </button>
      </form>
    </div>
  </div>
);
};

export default GroupsUpdates;