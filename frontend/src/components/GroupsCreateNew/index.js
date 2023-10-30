import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as groupActions from '../../store/groups';
import './GroupsCreateNew.css';

const GroupsCreateNew = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [formData, setFormData] = useState({
    location: '',
    name: '',
    about: '',
    type: '',
    privacy: '',
    imgUrl: '',
  });

  const [errors, setErrors] = useState([]);
  const [submissionAttempt, setSubmissionAttempt] = useState(false);

  useEffect(() => {
    if (submissionAttempt) {
      const loadErrors = [];
      if (!formData.location) loadErrors.push('City and State is required');
      if (!formData.name) loadErrors.push('Group name is required');
      if (formData.about.length < 30) loadErrors.push('Description must be at least 30 characters long');
      if (!formData.type) loadErrors.push('Group type is required');
      if (!formData.privacy) loadErrors.push('Visibility Type is required');
      if (!formData.imgUrl) {
        loadErrors.push('Image URL is required');
      } else if (!formData.imgUrl.match(/\.(jpg|jpeg|png)$/)) {
        loadErrors.push('Image URL must end in .jpg, .jpeg, or .png');
      }
      setErrors(loadErrors);
    }
  }, [formData, submissionAttempt]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmissionAttempt(true);
    
    const loadErrors = [];

    setErrors(loadErrors);
    
    if (loadErrors.length > 0) {
      console.log("Form has errors, not submitting")
      return;
    }
 
    if (!formData.location) loadErrors.push('City and State is required');
    if (!formData.name) loadErrors.push('Group name is required');
    if (formData.about.length < 30) loadErrors.push('Description must be at least 30 characters long');
    if (!formData.type) loadErrors.push('Group type is required');
    if (!formData.privacy) loadErrors.push('Visibility Type is required');
    if (formData.imgUrl && !formData.imgUrl.match(/\.(jpg|jpeg|png)$/)) {
      loadErrors.push('Image URL must end in .jpg, .jpeg, or .png');
    }
  
    setErrors(loadErrors);
    console.log("Validation Errors:", loadErrors);

    if (loadErrors.length === 0) {
      let city, state;

      if (formData.location) {
        const locationParts = formData.location.split(',').map(part => part.trim());
        city = locationParts[0];
        state = locationParts[1];
      }

      try {
        const newGroup = {
          city: city,
          state: state,
          name: formData.name,
          about: formData.about,
          type: formData.type,
          private: formData.privacy,
          previewImage: formData.imgUrl,
        };
        

        const createdGroup = await dispatch(groupActions.createNewGroup(newGroup));

        if (createdGroup && createdGroup.groupId) {
          history.push(`/groups/${createdGroup.groupId}`);
        } else {
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
          <h3>Start a New Group</h3>
          <h1>We'll walk you through a few steps to build your local community</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='border-div'>
            <h1>First, set your group's location.</h1>
            <h3>Meetup groups meet locally, in person and online. We'll connect you with people in your area, and more can join you online.</h3>
            <input
              type='text'
              value={formData.location}
              onChange={handleChange}
              placeholder='City, STATE' 
              name='location'
              className='location-input'></input>
              <div className="field-error-placeholder">
              {submissionAttempt && !formData.location && <p className='field-error'>Location is required</p>}
              </div>
          </div>
          <div className='border-div'>
            <h1>What will your group's name be?</h1>
            <h3>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</h3>
            <input
              type='text'
              value={formData.name}
              onChange={handleChange}
              placeholder='What is your group name?' name='name'></input>
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
              placeholder='Please write at least 30 characters' name='about'></textarea>
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
                name='privacy'
                value={formData.privacy}
                onChange={handleChange}
              >
                <option value=''>(select one)</option>
                <option value={true}>Private</option>
                <option value={false}>Public</option>
              </select>
              {submissionAttempt && formData.privacy === '' && (
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
              placeholder='Image url' name='imgUrl'></input>
              <div className="field-error-placeholder">
              {submissionAttempt && !formData.imgUrl.match(/\.(jpg|jpeg|png)$/) && <p className='field-error'>Image URL must end in .jpg, .jpeg, or .png</p>}
              </div>
          </div>

          <button type='submit' className='newGroupSubmitButton' disabled={errors.length > 0}>
            Create group
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupsCreateNew;
