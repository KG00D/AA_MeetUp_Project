import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import * as groupActions from '../../store/groups';
import * as eventActions from '../../store/events';
import './EventsCreateNew.css';

const InputField = ({ label, type, value, onChange, name, placeholder, error }) => (
  <div className='border-div'>
    <h3>{label}</h3>
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} name={name} />
    {error && <p className='field-error'>{error}</p>}
  </div>
);

const TextAreaField = ({ label, value, onChange, name, placeholder, error }) => (
  <div className='border-div'>
    <h3>{label}</h3>
    <textarea value={value} onChange={onChange} placeholder={placeholder} name={name}></textarea>
    {error && <p className='field-error'>{error}</p>}
  </div>
);

const SelectField = ({ label, value, onChange, name, options, error }) => (
  <div className='border-div'>
    <h3>{label}</h3>
    <select name={name} value={value} onChange={onChange}>
      <option value=''>{`(select one)`}</option>
      {options.map((opt, index) => (
        <option value={opt.value} key={index}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className='field-error'>{error}</p>}
  </div>
);

const EventsCreateNew = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { groupId } = useParams();

  const currentGroup = useSelector((state) => state.groups.currentGroup);

  const [errors, setErrors] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    privacy: '',
    description: '',
    price: 0,
    startDate: '',
    endDate: '',
    imgUrl: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    dispatch(groupActions.getGroupDetail(groupId));
  }, [dispatch, groupId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = {};

    if (!formData.name) formErrors.name = "Event name is required";
    if (!formData.type) formErrors.type = "Event type is required";
    if (formData.privacy === '') formErrors.privacy = "Please specify if the event is private or public";
    if (formData.price === null || formData.price === undefined) formErrors.price = "Event price is required";
    
    const currentDate = new Date();
    const selectedStartDate = new Date(formData.startDate);
    const selectedEndDate = new Date(formData.endDate);
    
    if (!formData.startDate || selectedStartDate < currentDate) {
      formErrors.startDate = "Event start date must be in the future";
    }
  
    if (!formData.endDate || selectedEndDate < currentDate || selectedEndDate < selectedStartDate) {
      formErrors.endDate = "Event end date must be in the future and after the start date";
    }
    
    if (!formData.startDate) formErrors.startDate = "Event start date is required";
    if (!formData.endDate) formErrors.endDate = "Event end date is required";
    if (!formData.imgUrl) formErrors.imgUrl = "Image URL is required";
    if (formData.description.length < 30) formErrors.description = "Description must be at least 30 characters long";
      
    if (Object.keys(formErrors).length > 0) {
      setFieldErrors(formErrors);
      return;
    }
  
    if (!currentGroup || !currentGroup.length || !currentGroup[0].id) {
      return;
    }
  
    const groupId = currentGroup[0].id;
    const { name, type, description, price, startDate, endDate, imgUrl } = formData;
    const event = {
      groupId,
      name,
      type,
      description,
      price,
      startDate,
      endDate,
      previewImage: imgUrl,
      // groupImage: groupImgUrl
    };
  
    try {
      const res = await dispatch(eventActions.createNewEvent(groupId, event));      
      if (res && res.id) {
        history.push(`/events/${res.id}`);
      } else {
        console.log("Debug: Dispatch returned an unexpected result:", res);
      }
    } catch (error) {
      console.error("Debug: An error occurred during dispatch:", error);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFieldErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      return newErrors;
    });

    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className='main-new-event-container'>
      <h1>Create an event for {currentGroup[0]?.name}</h1>
      <form className='new-event-form' onSubmit={handleSubmit}>
        <InputField label='What is the name of your event?' type='text' value={formData.name} onChange={handleChange} name='name' placeholder='Event Name' error={fieldErrors.name} />
        <SelectField label='Is this an in person or online event?' value={formData.type} onChange={handleChange} name='type' options={[{ value: 'In Person', label: 'In Person' }, { value: 'Online', label: 'Online' }]} error={fieldErrors.type} />
        <SelectField label='Is this event private or public?' value={formData.privacy} onChange={handleChange} name='privacy' options={[{ value: true, label: 'Private' }, { value: false, label: 'Public' }]} error={fieldErrors.privacy} />
        <InputField label='What is the price for your event?' type='number' min='0' value={formData.price} onChange={handleChange} name='price' placeholder='Event Price' error={fieldErrors.price} />
        <InputField label='When does your event start?' type='datetime-local' value={formData.startDate} onChange={handleChange} name='startDate' placeholder='Event Start Time' error={fieldErrors.startDate} />
        <InputField label='When does your event end?' type='datetime-local' value={formData.endDate} onChange={handleChange} name='endDate' placeholder='Event End Time' error={fieldErrors.endDate} />
        <InputField label='Please add an image URL for the event below:' type='text' value={formData.imgUrl} onChange={handleChange} name='imgUrl' placeholder='Image URL' error={fieldErrors.imgUrl} />
        <TextAreaField label='Please describe your event:' value={formData.description} onChange={handleChange} name='description' placeholder='Please include at least 30 characters.' error={fieldErrors.description} />
        <button type='submit' className='newEventSubmit'>Create Event</button>
      </form>
    </div>
  );
};

export default EventsCreateNew;
