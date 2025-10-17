import React from 'react';
import { ShopType } from '../../type/shop-type';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../bootstrap/Card';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';

const LegalAgentInfo = ({ shop }: { shop: ShopType }) => {
	return (
		<Card
			className='rounded-2'
			tag='form' // onSubmit={formik.handleSubmit}
		>
			<CardHeader>
				<CardLabel icon='Person'>
					<CardTitle>Representante Legal</CardTitle>
				</CardLabel>
			</CardHeader>
			<CardBody>
				<div className='row g-4'>
					<FormGroup className='col-md-12' id='formName' label='Nombre'>
						<Input disabled value={shop.nameLegalAgent} />
					</FormGroup>
					<FormGroup className='col-md-12' id='formAddress' label='Dirección'>
						<Input disabled value={shop.addressLegalAgent} />
					</FormGroup>

					<FormGroup className='col-lg-6' id='formEmailAddress' label='Identificación'>
						<Input type='text' disabled value={shop.ciLegalAgent} />
					</FormGroup>
					<FormGroup className='col-lg-6' id='formPhone' label='Teléfono'>
						<Input
							type='tel'
							disabled
							value={shop.prefixLegalAgent + shop.phoneLegalAgent}
						/>
					</FormGroup>
				</div>
			</CardBody>
		</Card>
	);
};

export default LegalAgentInfo;
