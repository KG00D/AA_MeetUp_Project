import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import * as groupActions from '../../store/groups';

const GroupsUpdates = () => {
  
  const dispatch = useDispatch();
  const history = useHistory();
  const group = useSelector(state => state.groups.currentGroup);
  let { groupId } = useParams();
  let { city, state, name, about, type } = group;
  let privacy = group.private;

  const [updatedCity, setUpdatedCity] = useState(city);
  const [updatedState, setUpdatedState] = useState(state);
  const [updatedName, setUpdatedName] = useState(name);
  const [updatedAbout, setUpdatedAbout] = useState(about);
  const [updatedType, setUpdatedType] = useState(type);
  const [updatedPrivacy, setUpdatedPrivacy] = useState(privacy);

  const [formData, setFormData] = useState({
    city: group.city,
    state: group.state,
    name: group.name,
    about: group.about,
    type: group.type,
    privacy: group.private,
  });

  const [errors, setErrors] = useState([]);

  useEffect(() => {
    console.log('Fetching group details...');
    dispatch(groupActions.getGroupDetail(groupId));
  }, [dispatch, groupId]);

  const handleChange = e => {
    const { name, value } = e.target;
    console.log(`Updating ${name} to: ${value}`);
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      console.log('Updating group...');
      await dispatch(groupActions.updateGroup(formData, groupId));
      console.log('Group updated successfully');
      history.goBack();
    } catch (error) {
      console.log('Error response:', error);
      const data = await error.response?.json();
      //const data = error.response?.data;
      if (data && data.errors) {
        console.error('Update error:', data.errors);
        setErrors(data.errors);
      }
    }
  };

  return (
    <div id="main-form-container">
      <section className="sub-form-container">
        <h3>UPDATE YOUR GROUP'S INFORMATION</h3>
        <h1>We'll walk you through a few steps to build your local community</h1>

        <form onSubmit={handleSubmit}>
          <section>
            <h1>First, set your group's location</h1>
            <h3>Meetup groups meet locally, in person and online. We'll connect you with people in your area, and more can join you online.</h3>
            <input
              type="text"
              value={updatedCity}
              onChange={(e) => setUpdatedCity(e.target.value)}
              required
              placeholder="City"
              name="city"
            />
            <input
              type="text"
              value={updatedState}
              onChange={(e) => setUpdatedState(e.target.value)}
              required
              placeholder="State"
              name="state"
            />
          </section>

          <section>
            <h1>What will your group's name be?</h1>
            <h3>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</h3>
            <input
              type="text"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
              required
              placeholder="Group Name"
              name="name"
            />
          </section>

          <section>
            <h1>Now describe what your group will be about</h1>
            <h3>People will see this when we promote your group, but you'll be able to add to it later, too.</h3>
            <ol>
              <li>What's the purpose of the group?</li>
              <li>Who should join?</li>
              <li>What will you do at your events?</li>
            </ol>
            <textarea
              type="text"
              value={updatedAbout}
              onChange={(e) => setUpdatedAbout(e.target.value)}
              required
              placeholder="Please write at least 30 characters"
              name="about"
            ></textarea>
          </section>

          <section id="final-steps-div">
            <div>
              <h1>Final steps...</h1>
              <h3>Is this an in person or online group?</h3>
              <select
                name="meeting type"
                value={updatedType}
                onChange={(e) => setUpdatedType(e.target.value)}
                required
              >
                <option value="">(select one)</option>
                <option value="In Person">In Person</option>
                <option value="Online">Online</option>
              </select>
            </div>

            <div>
              <h3>Is this group private or public?</h3>
              <select
                name="privacy"
                value={updatedPrivacy}
                onChange={(e) => setUpdatedPrivacy(e.target.value)}
                required
              >
                <option value="">(select one)</option>
                <option value={true}>Private</option>
                <option value={false}>Public</option>
              </select>
            </div>
          </section>

          {errors && (
            <ul className="errors">
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          )}

          <button type="submit" className="update-button">
            Update Group
          </button>
        </form>
      </section>
    </div>
  );
};

export default GroupsUpdates;
