/* eslint-disable react/sort-comp,react/no-multi-comp */

import React from 'react';
import debounce from 'lodash.debounce';
import {
    ArrowIcon,
    InputNumberPlusIcon,
    InputNumberMinusIcon,
    CheckboxIcon,
    CheckboxActiveIcon,
} from './Icons.jsx';
import '../../sass/components/form.scss';

export const FormGroup = ({ title, type, children }) => (
    <div className={`form__group ${type ? (`form__group--${type}`) : ''}`}>
        {
            title && (
                <div className="form__label">
                    <span> {title} </span>
                </div>
            )
        }
        <div className="form__control">
            {children}
        </div>
    </div>
);

export const Checkbox = ({
    id,
    label,
    checked,
    disabled,
    onChange,
}) => (
    <span
        onClick={() => onChange(!checked)}
    >
        <label
            htmlFor={id}
            className={`sc-checkbox ${checked ? 'sc-checkbox--checked' : ''} ${disabled ? 'sc-checkbox--disabled' : ''}`}
        >
            {
                checked
                    ? (<CheckboxActiveIcon className="sc-checkbox__box" />)
                    : (<CheckboxIcon className="sc-checkbox__box" />)
            }
            <span className="sc-checkbox__label">{label}</span>
        </label>
    </span>
);

export class Slider extends React.Component {
    onChange = (val) => {
        this.props.onChange(val.currentTarget.value);
    };

    shouldComponentUpdate(nextProps) {
        return this.props.value !== nextProps.value;
    }

    render() {
        const {
            min = 1,
            max = 10,
            step = 1,
            value,
        } = this.props;
        const barWidth = 238;// css hardcode
        let activeWidth = Math.round((barWidth * (value - min)) / (max - min));
        activeWidth = activeWidth < 0 ? 0 : activeWidth;

        return (
            <div className="sc-slider">
                <div className="sc-slider-range">
                    <div className="sc-slider-bar" />
                    <div className="sc-slider-active-bar" style={{ width: activeWidth }} />
                    <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        onChange={this.onChange}
                        value={value}
                    />
                </div>
                <div className="value">{value}</div>
            </div>
        );
    }
}

export class DropDown extends React.Component {
    state = { open: false };
    titleRef = null;
    onClick = () => {
        const bounding = this.ele.getBoundingClientRect();
        this.setState(prevState => ({
            open: !prevState.open,
            left: !prevState.open ? bounding.left : null,
            top: !prevState.open ? bounding.top : null,
            width: bounding.width,
        }));
    };
    close = (e) => {
        if (e.target !== this.titleRef) {
            this.setState({
                open: false,
                left: 0,
                top: 0,
            });
        }
    }

    componentDidMount() { document.addEventListener('click', this.close, false); }
    componentWillUnmount() { document.removeEventListener('click', this.close); }

    render() {
        const {
            subtitle, rows, children, value, onRowClick, className,
        } = this.props;
        const { open, left, top, width } = this.state;
        return (
            <div
                className={`${className || ''} sc-dropdown ${open ? 'active' : ''}`}
                ref={(ele) => { this.ele = ele; }}
                style={{ left, top, width }}
            >
                {subtitle ? (<div className="subtitle"><span>{subtitle}</span></div>) : ''}
                <div
                    className={`value ${open ? 'active' : ''}`}
                    onClick={this.onClick}
                    ref={(ref) => { this.titleRef = ref; }}
                >
                    <span className="text">{value}</span>
                    <ArrowIcon />
                </div>
                <div className={`dropdown ${open ? 'active' : ''}`}>
                    {rows.map((row, idx) => (
                        <div
                            key={idx} // eslint-disable-line react/no-array-index-key
                            className={`row ${row === value ? 'row--selected' : ''}`}
                            onClick={() => onRowClick && onRowClick(row)}
                        >
                            {children(row)}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export class Pattern extends React.Component {
    patterns = [
        { width: 1, pattern: 'solid' },
        { width: 3, pattern: 'solid' },
        { width: 5, pattern: 'solid' },
        { width: 1, pattern: 'dotted' },
        { width: 3, pattern: 'dotted' },
        { width: 5, pattern: 'dotted' },
        { width: 1, pattern: 'dashed' },
        { width: 3, pattern: 'dashed' },
        { width: 5, pattern: 'dashed' },
        { width: 0, pattern: 'none' },
    ];
    render() {
        const { pattern, subtitle, lineWidth, onChange, onActive } = this.props;
        const value = pattern !== 'none'
            ? <span className={`option ${pattern}-${lineWidth}`} />
            : <span className="none">None</span>;

        return (
            <DropDown
                rows={this.patterns}
                value={value}
                onActive={onActive}
                onRowClick={onChange}
                subtitle={subtitle}
            >
                {p => (p.pattern !== 'none'
                    ? <span className={`option ${p.pattern}-${p.width}`} />
                    : <span className="none">None</span>)
                }
            </DropDown>
        );
    }
}

export class ColorPicker extends React.Component {
    colorMap = [
        ['#ffffff', '#e1e1e1', '#cccccc', '#b7b7b7', '#a0a0a5', '#898989', '#707070',
            '#626262', '#555555', '#464646', '#363636', '#262626', '#1d1d1d', '#000000'],
        ['#f4977c', '#f7ac84', '#fbc58d', '#fff69e', '#c4de9e', '#85c99e', '#7fcdc7',
            '#75d0f4', '#81a8d7', '#8594c8', '#8983bc', '#a187bd', '#bb8dbe', '#f29bc1'],
        ['#ef6c53', '#f38d5b', '#f8ae63', '#fff371', '#acd277', '#43b77a', '#2ebbb3',
            '#00bff0', '#4a8dc8', '#5875b7', '#625da6', '#8561a7', '#a665a7', '#ee6fa9'],
        ['#ea1d2c', '#ee652e', '#f4932f', '#fff126', '#8ec648', '#00a553', '#00a99c',
            '#00afed', '#0073ba', '#0056a4', '#323390', '#66308f', '#912a8e', '#e9088c'],
        ['#9b0b16', '#9e4117', '#a16118', '#c6b920', '#5a852d', '#007238', '#00746a',
            '#0077a1', '#004c7f', '#003570', '#1d1762', '#441261', '#62095f', '#9c005d'],
        ['#770001', '#792e03', '#7b4906', '#817a0b', '#41661e', '#005827', '#005951',
            '#003b5c', '#001d40', '#000e35', '#04002c', '#19002b', '#2c002a', '#580028'],
    ];
    state = { open: false };
    titleRef = null;
    onClick = () => {
        const bounding = this.ele.getBoundingClientRect();
        this.setState(prevState => ({
            open: !prevState.open,
            left: !prevState.open ? bounding.left : null,
            top: !prevState.open ? bounding.top : null,
            width: bounding.width,
        }));
    }
    close = (e) => {
        if (e.target !== this.titleRef && e.target.parentNode !== this.titleRef) {
            this.setState({
                open: false,
                left: null,
                top: null,
            });
        }
    };

    defaultColor = () => (this.props.theme === 'light' ? '#000000' : '#ffffff')

    componentDidMount() { document.addEventListener('click', this.close, false); }
    componentWillUnmount() { document.removeEventListener('click', this.close); }

    shouldComponentUpdate(nextProps, nextState) {
        return (this.state.open !== nextState.open)
        || (this.props.color !== nextProps.color)
        || (this.props.theme !== nextProps.theme);
    }

    render() {
        const { subtitle, color, setColor } = this.props;
        const backgroundColor = color === 'auto' ? this.defaultColor() : color;
        const { open, left, top, width } = this.state;
        return (
            <div
                ref={(ele) => { this.ele = ele; }}
                className={`sc-color-picker ${this.state.open ? 'active' : ''}`}
                style={{ top, left, width }}
            >
                {subtitle ? (<div className="subtitle"><span>{subtitle}</span></div>) : ''}
                <div
                    className="value"
                    onClick={this.onClick}
                    ref={(ref) => { this.titleRef = ref; }}
                >
                    <div
                        className="sc-input-color"
                        style={{ backgroundColor }}
                    />
                    <ArrowIcon />
                </div>
                <div className={`dropdown ${open ? 'open' : ''}`}>
                    {this.colorMap.map((row, rowIdx) => (
                        <div key={rowIdx /* eslint-disable-line react/no-array-index-key */} className="row">
                            {row.map(tileColor => (
                                <div
                                    key={tileColor}
                                    className="tile-color"
                                    style={{ backgroundColor: tileColor }}
                                    onClick={() => setColor(tileColor)}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export const Switch = ({
    value,
    onChange,
}) => (
    <div
        className={`sc-switch ${value ? 'on' : 'off'}`}
        onClick={() => onChange(!value)}
    >
        <div className="handle" />
    </div>
);


export const SwitchIcon = ({
    id,
    label,
    value,
    onChange,
    noramIcon,
    activeIcon,
}) => {
    const Icon = value ? activeIcon : noramIcon;
    return (
        <div className="sc-switch-icon">
            <Icon className="sc-switch-icon__icon" />
            <div className="sc-switch-icon__description">
                <Checkbox
                    id={id}
                    label={label}
                    checked={value}
                    onChange={onChange}
                />
            </div>
        </div>
    );
};

// NumericInput fires onChange on Enter or onBlur
export class NumericInput extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            originalValue: '',
            value: '',
        };

        this.onUpdateValue = this.onUpdateValue.bind(this);
    }

    componentDidMount() {
        this.setState(() => ({
            originalValue: this.props.value,
            value: this.props.value,
        }));
    }

    static getDerivedStateFromProps(props, state) {
        const { value, min, max, onChange } = props;
        let val = value;
        if (value !== state.originalValue) {
            if (max !== undefined && value > max) {
                val = max;
            } else if (min !== undefined && value < min) {
                val = min;
            }
            onChange(val);
            return {
                originalValue: value,
                value: val,
            };
        }
        return null;
    }

    fireOnChange = debounce(() => {
        const { min, max, onChange } = this.props;
        const setAndChange = val => this.setState({ value: val }, () => onChange(this.state.value));
        if (max !== undefined && this.state.value > max) {
            setAndChange(max);
        } else if (min !== undefined && this.state.value < min) {
            setAndChange(min);
        } else {
            onChange(this.state.value);
        }
    }, 300, { leading: true, trailing: false });

    onUpdateValue = (e) => {
        e.persist();
        this.setState(() => ({ value: e.target.value }));
    };

    fireOnEnter = (e) => {
        if (['e', '+', 'E'].includes(e.key)) {
            e.preventDefault();
        }
        if (e.key === 'Enter') {
            this.fireOnChange();
        }
    };

    onIncrease = () => this.setState(prevState => ({ value: prevState.value + 1 }), this.fireOnChange);
    onDecrease = () => this.setState(prevState => ({ value: prevState.value - 1 }), this.fireOnChange);

    render() {
        const { subtitle, min, max, step } = this.props;
        return (
            <div className="sc-numeric-input">
                <input
                    type="number"
                    value={this.state.value}
                    onBlur={this.fireOnChange}
                    onChange={this.onUpdateValue}
                    onKeyPress={this.fireOnEnter}
                    min={min}
                    max={max}
                    step={step}
                />
                {subtitle ? (<div className="subtitle"><span>{subtitle}</span></div>) : ''}
                <div className="sc-numeric-input-buttons">
                    <InputNumberPlusIcon onClick={this.onIncrease} />
                    <InputNumberMinusIcon onClick={this.onDecrease} />
                </div>
            </div>
        );
    }
}

export const NumberColorPicker = ({
    value,
    theme,
    onChange,
    onActive,
}) => {
    // Do NOT rename the variables Value and Color! The keys are also
    // used as attribute suffixes
    const { Value, Color } = value;
    const onValueChange = v => onChange({ Color,    Value: v });
    const onColorChange = c => onChange({ Color: c, Value    });

    return (
        <span className="sc-numbercolorpicker">
            <NumericInput
                value={Value}
                subtitle={t.translate('Size')}
                onChange={val => onValueChange(val)}
            />
            <ColorPicker
                color={Color}
                theme={theme}
                onActive={onActive}
                subtitle={t.translate('Color')}
                setColor={val => onColorChange(val)}
            />
        </span>
    );
};

export const Toggle = ({
    className,
    children,
    active,
    onChange,
}) => (
    <div
        onClick={() => onChange(!active)}
        className={`${className || ''} ${active ? 'active' : ''} sc-toggle`}
    >
        {children}
    </div>
);

export const FontSetting = ({
    onChange,
    value,
}) => {
    const families = [
        'Default',
        'Helvetica',
        'Courier',
        'Garamond',
        'Palatino',
        'Times New Roman',
    ];
    const fontSizes = [8, 10, 12, 13, 14, 16, 20, 28, 36, 48, 64];

    const fireChange = change => onChange({ ...value, ...change });
    const onFontFamilyChange = family => fireChange({ family });
    const onFontSizeChange = size => fireChange({ size: `${size}px` });
    const onBoldChange = isBold => fireChange({ weight: isBold ? 'bold' : undefined });
    const onItalicChange = isItalic => fireChange({ style: isItalic ? 'italic' : undefined });
    const {
        family, style, weight, size,
    } = value;

    return (
        <span className="sc-fontsetting">
            <Toggle
                onChange={onBoldChange}
                active={!!weight}
            >
                <div className="sc-text-icon"><b>B</b></div>
            </Toggle>
            <Toggle
                active={!!style}
                onChange={onItalicChange}
            >
                <div className="sc-text-icon"><i>i</i></div>
            </Toggle>
            <DropDown
                className="sc-changefontsize"
                rows={fontSizes}
                title={size || '13px'}
                onRowClick={onFontSizeChange}
            >
                {p => <span className="option">{p}</span>}
            </DropDown>
            <DropDown
                className="sc-changefontfamily"
                rows={families}
                title={family || families[0]}
                onRowClick={onFontFamilyChange}
            >
                {p => <span className="option">{p}</span>}
            </DropDown>
        </span>
    );
};
