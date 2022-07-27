/** @format */

import React, { useState } from 'react';
import { Modal, useMantineTheme } from '@mantine/core';
import './ProfileModal.css';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { updateUser } from '../../actions/UserAction';
import Select from 'react-select';
import { programmingLanguageOptions } from '../../docs/data';

const ProfileModal = ({ modalOpened, setModalOpened, data }) => {
	const theme = useMantineTheme();
	const { password, ...other } = data;
	const [formData, setFormData] = useState(other);
	const dispatch = useDispatch();
	const param = useParams();

	const { user } = useSelector(state => state.authReducer.authData);
	const handleChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleChangeSelect = (options) => {
		const languages = options.map((option) => option.label);
		setFormData({ ...formData, ['languages']: languages });
	  };


	// form submission
	const handleSubmit = e => {
		e.preventDefault();
		let UserData = formData;
		dispatch(updateUser(param.id, UserData));
		setModalOpened(false);
	};

	return (
		<Modal
			overlayColor={
				theme.colorScheme === 'dark'
					? theme.colors.dark[9]
					: theme.colors.gray[2]
			}
			overlayOpacity={0.55}
			overlayBlur={3}
			size='55%'
			opened={modalOpened}
			onClose={() => setModalOpened(false)}
		>
			<form className='infoForm' onSubmit={handleSubmit}>
				<h3>Your Info</h3>
				<div>
					<input
						value={formData.firstname}
						onChange={handleChange}
						type='text'
						placeholder='First Name'
						name='firstname'
						className='infoInput'
					/>

					<input
						value={formData.lastname}
						onChange={handleChange}
						type='text'
						placeholder='Last Name'
						name='lastname'
						className='infoInput'
					/>
				</div>

				<Select
					isMulti 
					name="languages"
					value={(formData.languages || []).map(language => ({ label: language }))}
					options={programmingLanguageOptions}
					closeMenuOnSelect={false}
					className="basic-multi-select"
					classNamePrefix="select"
					onChange={handleChangeSelect}
				/>

				<button className='button infoButton' type='submit'>
					Update
				</button>
			</form>
		</Modal>
	);
};

export default ProfileModal;