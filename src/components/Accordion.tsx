import React, {
	Children,
	cloneElement,
	ElementType,
	forwardRef,
	ReactElement,
	ReactNode,
	useState,
} from 'react';
import classNames from 'classnames';
import { TIcons } from '../type/icons-type';
import { TColor } from '../type/color-type';
import TagWrapper from './TagWrapper';
import Icon from './icon/Icon';
import Collapse from './bootstrap/Collapse';

type TActiveItemId = Array<string | number>;

// ---------------------------------------------------
// AccordionItem
// ---------------------------------------------------
interface IAccordionItemProps {
	id: string | number;
	icon?: TIcons;
	title?: ReactNode;
	children: ReactNode;
	tag?: ElementType;
	headerTag?: ElementType;
	overWriteColor?: null | TColor;
	parentId?: string | number | null;
	activeItems?: TActiveItemId;
	setActiveItems?: (items: TActiveItemId) => void;
}

export const AccordionItem = forwardRef<HTMLDivElement, IAccordionItemProps>(
	(
		{ id, icon, title, children, tag = 'div', headerTag = 'h2', overWriteColor, ...props },
		ref,
	) => {
		const ACTIVE = props.activeItems?.includes(id);

		const handleToggle = () => {
			if (!props.setActiveItems) return;
			if (ACTIVE) {
				props.setActiveItems(props.activeItems!.filter((item) => item !== id));
			} else {
				props.setActiveItems([...props.activeItems!, id]);
			}
		};

		return (
			<TagWrapper tag={tag} ref={ref} className={classNames('accordion-item')}>
				<TagWrapper tag={headerTag} className='accordion-header' id={id}>
					<button
						className={classNames('accordion-button', {
							collapsed: !ACTIVE,
							[`accordion-button-${overWriteColor}`]: overWriteColor,
						})}
						type='button'
						aria-expanded={ACTIVE}
						aria-controls={`${id}Collapse`}
						onClick={handleToggle}
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							width: '100%',
						}}>
						{icon && <Icon icon={icon} className='accordion-icon' />}
						<div style={{ flex: 1 }}>{title}</div>
					</button>
				</TagWrapper>

				<Collapse
					isOpen={ACTIVE}
					id={`${id}Collapse`}
					className='accordion-collapse'
					aria-labelledby={id}
					data-bs-parent={props.parentId ? `#${props.parentId}` : undefined}>
					<div className='accordion-body'>{children}</div>
				</Collapse>
			</TagWrapper>
		);
	},
);
AccordionItem.displayName = 'AccordionItem';

// ---------------------------------------------------
// Accordion
// ---------------------------------------------------
interface IAccordionProps {
	tag?: 'div' | 'section';
	id: string | number;
	activeItemId?: string | number | Array<string | number>;
	children: ReactElement<IAccordionItemProps> | ReactElement<IAccordionItemProps>[];
	shadow?: null | 'none' | 'sm' | 'default' | 'lg';
	color?: TColor;
	isFlush?: boolean;
	className?: string;
}

const Accordion = forwardRef<HTMLDivElement, IAccordionProps>(
	(
		{
			tag = 'div',
			id,
			activeItemId,
			children,
			shadow = 'default',
			color = 'primary',
			isFlush,
			className,
		},
		ref,
	) => {
		const initialActive =
			Array.isArray(activeItemId) && activeItemId.length > 0
				? activeItemId
				: activeItemId
					? [activeItemId]
					: [];

		const [activeItems, setActiveItems] = useState<TActiveItemId>(initialActive);

		const isAcceptedChild = (child: any) => {
			if (!child || !child.type) return false;
			const name = child.type.displayName || child.type.name;
			return name === 'AccordionItem';
		};

		return (
			<TagWrapper
				tag={tag}
				ref={ref}
				className={classNames(
					'accordion',
					{
						'accordion-flush': isFlush,
						'shadow-none': isFlush,
						[`shadow${shadow !== 'default' ? `-${shadow}` : ''}`]: !!shadow,
					},
					className,
				)}
				id={id}>
				{Children.map(children, (child) =>
					isAcceptedChild(child) ? (
						cloneElement(child as ReactElement<any>, {
							activeItems,
							setActiveItems,
							parentId: id,
							overWriteColor: child?.props?.overWriteColor || color,
						})
					) : (
						<code className='d-block'>
							Only AccordionItem component should be used as a child.
						</code>
					),
				)}
			</TagWrapper>
		);
	},
);
Accordion.displayName = 'Accordion';
export default Accordion;

// ---------------------------------------------------
// DayAccordionItem (especializado para los días de la semana)
// ---------------------------------------------------
interface IDayAccordionItemProps {
	day: string;
	checked: boolean;
	onChange: (value: boolean) => void;
	children?: React.ReactNode;
	id: string | number;
	activeItems?: TActiveItemId;
	setActiveItems?: (items: TActiveItemId) => void;
}

export const DayAccordionItem: React.FC<IDayAccordionItemProps> = ({
	day,
	checked,
	onChange,
	children,
	id,
	activeItems,
	setActiveItems,
}) => {
	const handleTitleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, toggle: () => void) => {
		const target = e.target as HTMLElement;
		// Si el click es sobre el input o el span del day, no toggle
		if (target.tagName === 'INPUT' || target.tagName === 'SPAN') {
			e.stopPropagation();
			return;
		}
		// Sino, toggle collapse
		toggle();
	};

	return (
		<AccordionItem
			id={id}
			activeItems={activeItems}
			setActiveItems={setActiveItems}
			title={
				<div
					style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
					onClick={(e) => handleTitleClick(e, () => {
						if (!setActiveItems || !activeItems) return;
						if (activeItems.includes(id)) {
							setActiveItems(activeItems.filter((item) => item !== id));
						} else {
							setActiveItems([...activeItems, id]);
						}
					})}
				>
					<div className='form-check form-switch'>
						<input
							className='form-check-input'
							type='checkbox'
							id={`switch-${id}`}
							checked={checked}
							onChange={(e) => onChange(e.target.checked)}
						/>
					</div>
					<span className='fw-bold ms-2'>{day}</span>
				</div>
			}
		>
			{children}
		</AccordionItem>
	);
};

DayAccordionItem.displayName = 'AccordionItem';
