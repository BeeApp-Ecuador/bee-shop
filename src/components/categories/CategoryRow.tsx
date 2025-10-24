import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Checks from '../../components/bootstrap/forms/Checks';
import Button from '../../components/bootstrap/Button';
import { demoPagesMenu } from '../../menu';
import useDarkMode from '../../hooks/useDarkMode';
import Popovers from '../bootstrap/Popovers';
import Badge from '../bootstrap/Badge';
import { CheckCircle, Checkroom } from '../icon/material-icons';
import Icon from '../icon/Icon';

interface ICategoryRowProps {
	id: string | number;
	name: string;
	description: string;
	status: boolean;
	onEdit: () => void;
	onDisableOrEnable: () => void;
	// selectOnChange: any;
	// selectChecked: any;
	// selectName: string;
}
const CategoryRow: FC<ICategoryRowProps> = ({
	id,
	name,
	description,
	status,
	onEdit,
	onDisableOrEnable,
}) => {
	const { darkModeStatus } = useDarkMode();
	return (
		<tr>
			{/* <th scope='row' aria-label='Check'>
				<Checks
					id={id.toString()}
					name={selectName}
					value={id}
					onChange={selectOnChange}
					checked={selectChecked}
					ariaLabel={selectName}
				/>
			</th> */}
			<td className=''>
				{status ? (
					<Icon icon='CheckCircle' color='success' size='lg' />
				) : (
					<Icon icon='Circle' color='danger' size='lg' />
				)}
			</td>
			<td className='fw-bold'>{name}</td>
			<td>{description}</td>
			<td className='text-end'>
				<div className='d-inline-flex gap-2'>
					<Popovers desc='Deshabilitar' trigger='hover'>
						<Button
							color='danger'
							isLight
							icon={status ? 'Block' : 'CheckCircle'}
							aria-label='Disable'
							onClick={onDisableOrEnable}
						/>
					</Popovers>
					<Popovers desc='Editar' trigger='hover'>
						<Button
							color='dark'
							isLight
							icon='Edit'
							aria-label='Edit'
							onClick={onEdit}
						/>
					</Popovers>
				</div>
			</td>
		</tr>
	);
};

export default CategoryRow;
