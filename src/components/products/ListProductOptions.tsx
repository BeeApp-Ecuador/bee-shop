import React from 'react';
import Button from '../bootstrap/Button';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../bootstrap/Card';
import { OptionType } from '../../type/ItemOptionType';

const ListProductOptions = ({
	temporaryOptions,
	openItems,
	setOpenItems,
	setTemporaryOptions,
}: {
	temporaryOptions: OptionType[];
	openItems: { [key: number]: boolean };
	setOpenItems: React.Dispatch<React.SetStateAction<{ [key: number]: boolean }>>;
	setTemporaryOptions: React.Dispatch<React.SetStateAction<OptionType[]>>;
}) => {
	return (
		<div className='col-12 col-lg-5'>
			<Card>
				<CardHeader>
					<CardLabel icon='List' iconColor='primary'>
						<CardTitle>Listado de Opciones</CardTitle>
					</CardLabel>
				</CardHeader>
				<CardBody>
					{temporaryOptions.length === 0 ? (
						<p>No hay opciones agregadas.</p>
					) : (
						<ul className='list-group'>
							{temporaryOptions.map((item, index) => (
								<li key={index} className='list-group-item d-flex flex-column'>
									<div className='d-flex justify-content-between align-items-center w-100'>
										<span>{item.title}</span>
										<span className='badge bg-info rounded-pill'>
											{item.type === 'SINGLE'
												? 'Selección Única'
												: 'Selección Múltiple'}
										</span>
										<div className='d-flex gap-2'>
											<Button
												type='button'
												icon={
													openItems[index] ? 'ExpandLess' : 'ExpandMore'
												}
												color='info'
												isOutline
												onClick={() =>
													setOpenItems((prev) => ({
														...prev,
														[index]: !prev[index],
													}))
												}
											/>

											<Button
												type='button'
												icon='Remove'
												color='danger'
												isOutline
												onClick={() =>
													setTemporaryOptions((prev) =>
														prev.filter((_, i) => i !== index),
													)
												}
											/>
										</div>
									</div>

									{openItems[index] && (
										<div className='mt-2 border-top pt-2'>
											<p>
												<b>
													Opciones:{' '}
													{item.type === 'SINGLE'
														? 'Selección Única'
														: 'Selección Múltiple'}
												</b>
											</p>
											<ul>
												{item.items?.map((opt, i) => (
													<li key={i}>
														{opt.detail}{' '}
														{opt.priceWithVAT
															? `- $${opt.priceWithVAT}`
															: ''}
													</li>
												))}
											</ul>
										</div>
									)}
								</li>
							))}
						</ul>
					)}
				</CardBody>
			</Card>
		</div>
	);
};

export default ListProductOptions;
