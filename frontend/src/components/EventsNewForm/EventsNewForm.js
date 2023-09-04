import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import * as groupActions from '../../store/groups';
import * as eventActions from '../../store/events';
import './EventsNewForm.css';

const InputField = ({ label, type, value, onChange, name, placeholder }) => (
  <div className='border-div'>
    <h3>{label}</h3>
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} name={name} />
  </div>
);

const SelectField = ({ label, value, onChange, name, options }) => (
  <div>
    <h3>{label}</h3>
    <select name={name} value={value} onChange={onChange}>
      <option value=''>{`(select one)`}</option>
      {options.map((opt, index) => (
        <option value={opt.value} key={index}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const NewEventForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { groupId } = useParams();
  const currentGroup = useSelector((state) => state.groups.currentGroup);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    privacy: null,
    description: '',
    price: 0,
    startDate: '',
    endDate: '',
    imgUrl: '',
  });
  const [errors, setErrors] = useState([]);
  const [submissionAttempt, setSubmissionAttempt] = useState(false);

  useEffect(() => {
    const { name, type, privacy, description, price, startDate, endDate } = formData;
    const loadErrors = [];

    if (!name) loadErrors.push('Event name is required');
    if (!type) loadErrors.push('Event type is required');
    if (privacy === null) loadErrors.push('Visibility Type is required');
    if (!price) loadErrors.push('Price is required');
    if (!startDate) loadErrors.push('Event start is required');
    if (!endDate) loadErrors.push('Event end is required');
    if (description.length < 30) loadErrors.push('Description must be at least 30 characters long');

    setErrors(loadErrors);
  }, [formData]);

  useEffect(() => {
    dispatch(groupActions.getGroupDetail(groupId));
  }, [dispatch, groupId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.length) {
      setSubmissionAttempt(true);
      return;
    }

    const { name, type, description, price, startDate, endDate, imgUrl } = formData;
    const event = {
      groupId: currentGroup.id,
      name,
      type,
      description,
      price,
      startDate,
      endDate,
      previewImage: imgUrl,
    };

    try {
      const res = await dispatch(eventActions.createNewEvent(currentGroup.id, event));
      history.push(`/events/${res.id}`);
    } catch (res) {
      const data = await res.json();
      if (data && data.errors) setErrors(data.errors);
    }
  };

  return (
    <div className='main-new-event-container'>
      <h1>Create an event for {currentGroup.name}</h1>
      <div className='form-container'>
        <form className='new-event-form' onSubmit={handleSubmit}>
          {submissionAttempt && (
            <ul className='errors'>
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          )}
          <InputField label='jhjhhjjk?' type='text' value={formData.name} onChange={handleChange} name='name' placeholder='Event Name' />
          <SelectField label='jnjjkkj?' value={formData.type} onChange={handleChange} name='type' options={[{ value: 'In Person', label: 'In Person' }, { value: 'Online', label: 'Online' }]} />
          <SelectField label='klljjljljljlk?' value={formData.privacy} onChange={handleChange} name='privacy' options={[{ value: true, label: 'Private' }, { value: false, label: 'Public' }]} />
          {/* I'm probably missing crap */}
          <button type='submit' className='newEventSubmit'>
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewEventForm;
