import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Checks from '../../components/bootstrap/forms/Checks';
import Button from '../../components/bootstrap/Button';
import { demoPagesMenu } from '../../menu';
import useDarkMode from '../../hooks/useDarkMode';

interface ICategoryRowProps {
	id: string | number;
	name: string;
	description: string;
	selectOnChange: any;
	selectChecked: any;
	selectName: string;
}
const CategoryRow: FC<ICategoryRowProps> = ({
	id,
	name,
	description,
	selectOnChange,
	selectChecked,
	selectName,
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
			<td className='fw-bold'>{name}</td>
			<td>{description}</td>
			<td className='text-end'>
				<Button
					color='dark'
					isLight
					icon='Edit'
					tag='a'
					to={`../${demoPagesMenu.sales.subMenu.productID.path}/${id}`}
					aria-label='Edit'
				/>
			</td>
		</tr>
	);
};

export default CategoryRow;
