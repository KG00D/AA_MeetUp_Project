import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as groupActions from '../../store/groups';
import './GroupsCreateNew.css';

const GroupsCreateNew = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [formData, setFormData] = useState({
    city: '',
    state: '',
    name: '',
    about: '',
    type: '',
    privacy: '',
    imgUrl: '',
  });

  const [errors, setErrors] = useState([]);
  const [submissionAttempt, setSubmissionAttempt] = useState(false);

  // useEffect(() => {
  //   if (submissionAttempt) {
  //     const loadErrors = [];
  //     // if (!formData.city) loadErrors.push('City is required');
  //     if (!formData.state) loadErrors.push('State is required');
  //     if (formData.state.length > 2) loadErrors.push('Use state acronym');
  //     if (!formData.name) loadErrors.push('Group name is required');
  //     if (formData.about.length < 30) loadErrors.push('Description must be at least 30 characters long');
  //     if (!formData.type) loadErrors.push('Group type is required');
  //     if (!formData.privacy) loadErrors.push('Visibility Type is required');
  //     if (formData.imgUrl && !formData.imgUrl.match(/\.(jpg|jpeg|png)$/)) {
  //       loadErrors.push('Image URL must end in .jpg, .jpeg, or .png');
  //     }
  //     setErrors(loadErrors);
  //   }
  // }, [formData, submissionAttempt]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmissionAttempt(true);

    if (errors.length === 0) {
      try {
        const newGroup = {
          city: formData.city,
          state: formData.state,
          name: formData.name,
          about: formData.about,
          type: formData.type,
          private: formData.privacy,
          previewImage: formData.imgUrl,
        };

        const createdGroup = await dispatch(groupActions.createNewGroup(newGroup));
        console.log(createdGroup)
        if (createdGroup && createdGroup.groupId) {
          history.push(`/groups/${createdGroup.groupId}`);
        } else {
          console.log('Test')
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
          <h3>BECOME AN ORGANIZER</h3>
          <h1>We'll walk you through a few steps to build your local community</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {submissionAttempt && (
            <ul className='errors'>
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          )}
          <div className='border-div'>
            <h1>First, set your group's location.</h1>
            <h3>Meetup groups meet locally, in person and online. We'll connect you with people in your area, and more can join you online.</h3>
            <input
              type='text'
              value={formData.city}
              onChange={handleChange}
              placeholder='City' name='city'></input>
              <div className="field-error-placeholder">
              {submissionAttempt && !formData.city && <p className='field-error'>City is required</p>}
              </div>
            <input
              type='text'
              value={formData.state}
              onChange={handleChange}
              placeholder='State' name='state'></input>
              <div className="field-error-placeholder">
              {submissionAttempt && !formData.state && <p className='field-error'>State is required</p>}
              </div>
          </div>
          <div className='border-div'>
            <h1>What will your group's name be?</h1>
            <h3>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</h3>
            <input
              type='text'
              value={formData.name}
              onChange={handleChange}
              placeholder='Group Name' name='name'></input>
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

          <button type='submit' className='newGroupSubmitButton'>
            Create group
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupsCreateNew;