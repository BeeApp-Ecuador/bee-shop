import React, { FC } from 'react';
import Button from '../../components/bootstrap/Button';
import Popovers from '../bootstrap/Popovers';
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
	return (
		<tr>
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
					<Popovers desc={status ? 'Deshabilitar' : 'Habilitar'} trigger='hover'>
						<Button
							color={status ? 'danger' : 'success'}
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
